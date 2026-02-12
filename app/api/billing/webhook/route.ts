import { handleBillingWebhook } from "@/lib/billingWebhook";

export const dynamic = "force-static";

export async function POST(req: Request) {
  return handleBillingWebhook(req);
}
