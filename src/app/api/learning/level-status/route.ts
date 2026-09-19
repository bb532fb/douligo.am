import { jsonDashboard } from "@/server/api/learning-api";

export const runtime = "nodejs";

export function GET() {
  return jsonDashboard();
}
