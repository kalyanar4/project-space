import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { __resetRateLimitStoreForTests, consumeRateLimit } from "./requestRateLimit.ts";

describe("consumeRateLimit", () => {
  it("allows requests until the limit and blocks after", () => {
    __resetRateLimitStoreForTests();
    const key = "test:limit";

    const first = consumeRateLimit(key, 2, 60000);
    assert.equal(first.allowed, true);
    assert.equal(first.remaining, 1);

    const second = consumeRateLimit(key, 2, 60000);
    assert.equal(second.allowed, true);
    assert.equal(second.remaining, 0);

    const third = consumeRateLimit(key, 2, 60000);
    assert.equal(third.allowed, false);
    assert.equal(third.remaining, 0);
    assert.equal(third.retryAfterSeconds > 0, true);
  });
});
