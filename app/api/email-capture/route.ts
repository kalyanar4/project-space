import { handleEmailCapture } from "@/lib/emailCapture";

export async function POST(req: Request) {
  return handleEmailCapture(req);
}
