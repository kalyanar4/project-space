import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import { verifyStripeWebhookSignature } from "./stripeBilling.ts";

describe("verifyStripeWebhookSignature", () => {
  it("accepts a valid v1 signature", () => {
    const payload = JSON.stringify({ id: "evt_1", type: "checkout.session.completed" });
    const secret = "whsec_test_secret";
    const timestamp = Math.floor(Date.now() / 1000);
    const expected = createHmac("sha256", secret)
      .update(`${timestamp}.${payload}`)
      .digest("hex");

    const header = `t=${timestamp},v1=${expected}`;
    assert.equal(verifyStripeWebhookSignature(payload, header, secret), true);
  });

  it("rejects stale signatures", () => {
    const payload = JSON.stringify({ id: "evt_1" });
    const secret = "whsec_test_secret";
    const timestamp = 1;
    const expected = createHmac("sha256", secret)
      .update(`${timestamp}.${payload}`)
      .digest("hex");

    const header = `t=${timestamp},v1=${expected}`;
    assert.equal(verifyStripeWebhookSignature(payload, header, secret), false);
  });
});
