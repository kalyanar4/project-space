import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { after, describe, it } from "node:test";
import {
  getEntitlement,
  setPlanByStripeCustomerId,
  upsertEntitlement,
} from "./billingEntitlements.ts";

describe("billing entitlements store", () => {
  let tempDir = "";

  after(async () => {
    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("stores and updates entitlement records", async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), "dmz-billing-test-"));
    process.env.BILLING_STORE_FILE = path.join(tempDir, "store.json");

    await upsertEntitlement("session_1", {
      plan: "pro",
      stripeCustomerId: "cus_123",
      stripeSubscriptionId: "sub_123",
      stripeCheckoutSessionId: "cs_123",
      email: "owner@example.com",
    });

    const first = await getEntitlement("session_1");
    assert.equal(first?.plan, "pro");
    assert.equal(first?.stripeCustomerId, "cus_123");

    const changed = await setPlanByStripeCustomerId("cus_123", "free");
    assert.equal(changed, true);

    const second = await getEntitlement("session_1");
    assert.equal(second?.plan, "free");
  });
});
