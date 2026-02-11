import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { after, describe, it } from "node:test";
import { upsertEntitlement } from "./billingEntitlements.ts";
import { getServerToolUsageSnapshot, recordServerToolSuccess } from "./serverToolUsage.ts";

describe("server tool usage stubs", () => {
  let tempDir = "";

  after(async () => {
    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("enforces free limit and supports pro entitlement", async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), "dmz-usage-test-"));
    process.env.BILLING_STORE_FILE = path.join(tempDir, "billing.json");
    process.env.TOOL_USAGE_STORE_FILE = path.join(tempDir, "usage.json");

    const freeSession = "sess_free";
    await recordServerToolSuccess(freeSession, "pdf_merge");
    await recordServerToolSuccess(freeSession, "pdf_merge");
    const third = await recordServerToolSuccess(freeSession, "pdf_merge");
    assert.equal(third.dailySuccessCount, 3);
    assert.equal(third.isLimitReached, true);

    const blocked = await recordServerToolSuccess(freeSession, "pdf_merge");
    assert.equal(blocked.dailySuccessCount, 3);
    assert.equal(blocked.isLimitReached, true);

    const proSession = "sess_pro";
    await upsertEntitlement(proSession, { plan: "pro" });
    const proAfterOne = await recordServerToolSuccess(proSession, "pdf_merge");
    assert.equal(proAfterOne.plan, "pro");
    assert.equal(proAfterOne.isLimitReached, false);

    const proSnapshot = await getServerToolUsageSnapshot(proSession, "pdf_merge");
    assert.equal(proSnapshot.remainingDailyRuns > 900, true);
  });
});
