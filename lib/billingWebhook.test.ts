import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, it } from "node:test";
import { getEntitlement } from "./billingEntitlements.ts";
import { handleBillingWebhook } from "./billingWebhook.ts";
import { getServerToolUsageSnapshot, recordServerToolSuccess } from "./serverToolUsage.ts";

const originalWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const createSignedRequest = (payload: string, secret: string) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`)
    .digest("hex");

  return new Request("http://localhost/api/billing/webhook", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "stripe-signature": `t=${timestamp},v1=${signature}`,
    },
    body: payload,
  });
};

describe("billing webhook flows", () => {
  let tempDir = "";

  afterEach(async () => {
    if (originalWebhookSecret === undefined) {
      delete process.env.STRIPE_WEBHOOK_SECRET;
    } else {
      process.env.STRIPE_WEBHOOK_SECRET = originalWebhookSecret;
    }

    delete process.env.BILLING_STORE_FILE;
    delete process.env.TOOL_USAGE_STORE_FILE;

    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true });
      tempDir = "";
    }
  });

  it("upgrades on checkout completion and downgrades on subscription deletion", async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), "dmz-webhook-test-"));
    process.env.BILLING_STORE_FILE = path.join(tempDir, "billing.json");
    process.env.TOOL_USAGE_STORE_FILE = path.join(tempDir, "usage.json");
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_flow";

    const sessionId = "sess_checkout";
    const customerId = "cus_abc123";

    const checkoutPayload = JSON.stringify({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_1",
          client_reference_id: sessionId,
          customer: customerId,
          subscription: "sub_123",
          customer_details: { email: "owner@example.com" },
        },
      },
    });

    const checkoutReq = createSignedRequest(checkoutPayload, process.env.STRIPE_WEBHOOK_SECRET);
    const checkoutRes = await handleBillingWebhook(checkoutReq);
    assert.equal(checkoutRes.status, 200);

    const entitlementAfterUpgrade = await getEntitlement(sessionId);
    assert.equal(entitlementAfterUpgrade?.plan, "pro");
    assert.equal(entitlementAfterUpgrade?.stripeCustomerId, customerId);

    for (let i = 0; i < 4; i += 1) {
      await recordServerToolSuccess(sessionId, "ai_text_generator");
    }
    const proSnapshot = await getServerToolUsageSnapshot(sessionId, "ai_text_generator");
    assert.equal(proSnapshot.plan, "pro");
    assert.equal(proSnapshot.isLimitReached, false);

    const cancelPayload = JSON.stringify({
      type: "customer.subscription.deleted",
      data: {
        object: {
          customer: customerId,
        },
      },
    });
    const cancelReq = createSignedRequest(cancelPayload, process.env.STRIPE_WEBHOOK_SECRET);
    const cancelRes = await handleBillingWebhook(cancelReq);
    assert.equal(cancelRes.status, 200);

    const entitlementAfterCancel = await getEntitlement(sessionId);
    assert.equal(entitlementAfterCancel?.plan, "free");

    for (let i = 0; i < 4; i += 1) {
      await recordServerToolSuccess(sessionId, "pdf_merge");
    }
    const freeSnapshot = await getServerToolUsageSnapshot(sessionId, "pdf_merge");
    assert.equal(freeSnapshot.plan, "free");
    assert.equal(freeSnapshot.dailySuccessCount, 3);
    assert.equal(freeSnapshot.isLimitReached, true);
  });
});
