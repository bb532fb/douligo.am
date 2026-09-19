import { postAssessment } from "@/server/api/learning-api";

export const runtime = "nodejs";

export function POST(request: Request) {
  return postAssessment(request);
}
