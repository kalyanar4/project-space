import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { handleEmailCapture } from "../../../lib/emailCapture.ts";

const originalWebhook = process.env.EMAIL_CAPTURE_WEBHOOK_URL;
const originalFetch = global.fetch;

afterEach(() => {
  if (originalWebhook === undefined) {
    delete process.env.EMAIL_CAPTURE_WEBHOOK_URL;
  } else {
    process.env.EMAIL_CAPTURE_WEBHOOK_URL = originalWebhook;
  }

  global.fetch = originalFetch;
});

describe("email capture route", () => {
  it("returns 400 for invalid payload", async () => {
    const req = new Request("http://localhost/api/email-capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not-json",
    });

    const res = await handleEmailCapture(req);
    assert.equal(res.status, 400);
  });

  it("returns 400 for invalid email", async () => {
    const req = new Request("http://localhost/api/email-capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "invalid-email", tool: "pdf_merge" }),
    });

    const res = await handleEmailCapture(req);
    assert.equal(res.status, 400);
  });

  it("returns 503 when webhook is not configured", async () => {
    delete process.env.EMAIL_CAPTURE_WEBHOOK_URL;

    const req = new Request("http://localhost/api/email-capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "user@example.com", tool: "pdf_merge" }),
    });

    const res = await handleEmailCapture(req);
    assert.equal(res.status, 503);
  });

  it("returns 200 when webhook call succeeds", async () => {
    process.env.EMAIL_CAPTURE_WEBHOOK_URL = "https://capture.example.com/hook";

    global.fetch = (async () => new Response("ok", { status: 200 })) as typeof fetch;

    const req = new Request("http://localhost/api/email-capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "user@example.com", tool: "pdf_merge" }),
    });

    const res = await handleEmailCapture(req);
    assert.equal(res.status, 200);

    const body = (await res.json()) as { ok: boolean };
    assert.equal(body.ok, true);
  });
});
