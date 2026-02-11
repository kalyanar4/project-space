import { handleBillingWebhook } from "@/lib/billingWebhook";

export async function POST(req: Request) {
  return handleBillingWebhook(req);
}
