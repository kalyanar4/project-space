import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { after, describe, it } from "node:test";
import { ingestServerAnalyticsEvent, listServerAnalyticsEvents } from "./serverAnalytics.ts";

describe("server analytics store", () => {
  let tempDir = "";

  after(async () => {
    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it("stores events per session and filters by time window", async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), "dmz-analytics-test-"));
    process.env.ANALYTICS_STORE_FILE = path.join(tempDir, "analytics.json");

    const sessionA = "session_a";
    const sessionB = "session_b";

    await ingestServerAnalyticsEvent({
      sessionId: sessionA,
      event: "tool_start",
      payload: { tool: "pdf_merge" },
      timestamp: "2026-02-01T00:00:00.000Z",
    });
    await ingestServerAnalyticsEvent({
      sessionId: sessionA,
      event: "tool_success",
      payload: { tool: "pdf_merge" },
      timestamp: "2026-02-08T00:00:00.000Z",
    });
    await ingestServerAnalyticsEvent({
      sessionId: sessionB,
      event: "landing_view",
      payload: { page: "/" },
      timestamp: "2026-02-08T00:00:00.000Z",
    });

    const recentA = await listServerAnalyticsEvents(sessionA, "2026-02-05T00:00:00.000Z");
    assert.equal(recentA.length, 1);
    assert.equal(recentA[0]?.event, "tool_success");

    const allB = await listServerAnalyticsEvents(sessionB);
    assert.equal(allB.length, 1);
    assert.equal(allB[0]?.event, "landing_view");
  });
});
