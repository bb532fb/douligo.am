import { postAttempt } from "@/server/api/learning-api";

export const runtime = "nodejs";

export function POST(request: Request) {
  return postAttempt(request);
}
