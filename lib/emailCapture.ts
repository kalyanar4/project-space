interface CapturePayload {
  email?: string;
  tool?: string;
  source?: string;
}

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export async function handleEmailCapture(req: Request) {
  let body: CapturePayload;

  try {
    body = (await req.json()) as CapturePayload;
  } catch {
    return jsonResponse({ error: "Invalid JSON payload." }, 400);
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const tool = String(body.tool ?? "").trim();
  const source = String(body.source ?? "post_success").trim();

  if (!email || !isValidEmail(email)) {
    return jsonResponse({ error: "Valid email is required." }, 400);
  }

  const webhook = process.env.EMAIL_CAPTURE_WEBHOOK_URL;
  if (!webhook) {
    return jsonResponse(
      { error: "Email capture is not configured. Set EMAIL_CAPTURE_WEBHOOK_URL." },
      503
    );
  }

  try {
    const upstream = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        tool,
        source,
        capturedAt: new Date().toISOString(),
      }),
    });

    if (!upstream.ok) {
      return jsonResponse({ error: "Failed to store email capture." }, 502);
    }

    return jsonResponse({ ok: true });
  } catch {
    return jsonResponse({ error: "Email capture service is unavailable." }, 502);
  }
}
