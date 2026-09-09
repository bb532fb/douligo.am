import { createHash } from "node:crypto";

export const TRUSTED_CLIENT_TOKEN = "6A5AA1D4EAFF4E9FB37E23D68491D6F4";
export const EDGE_GEC_VERSION = "1-143.0.3650.96";
const EDGE_HEADERS = {
  Origin: "chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0",
} as const;

export function edgeRequestHeaders(): Record<string, string> {
  const muid = crypto.randomUUID().replaceAll("-", "").toUpperCase();
  return { ...EDGE_HEADERS, Cookie: `muid=${muid};` };
}

const WIN_EPOCH_SEC = 11_644_473_600;
const WINDOW_SEC = 300;

export function secMsGec(nowMs = Date.now(), skewSec = 0): string {
  const unix = Math.floor(nowMs / 1000) + skewSec;
  const ticks = unix + WIN_EPOCH_SEC;
  const rounded = BigInt(ticks - (ticks % WINDOW_SEC));
  const windowsTicks = rounded * BigInt(10_000_000);
  return createHash("sha256")
    .update(`${windowsTicks.toString()}${TRUSTED_CLIENT_TOKEN}`)
    .digest("hex")
    .toUpperCase();
}

export function synthUrl(connectionId: string, token: string): string {
  const params = new URLSearchParams({
    TrustedClientToken: TRUSTED_CLIENT_TOKEN,
    "Sec-MS-GEC": token,
    "Sec-MS-GEC-Version": EDGE_GEC_VERSION,
    ConnectionId: connectionId,
  });
  return `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?${params.toString()}`;
}
