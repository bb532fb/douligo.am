import { describe, expect, it } from "vitest";
import { loginUrlWithCallback, safeCallbackUrl } from "@/lib/auth/callback-url";

describe("safeCallbackUrl", () => {
  it("accepts same-locale internal paths", () => {
    expect(safeCallbackUrl("/hy/start/hy-en", "hy")).toBe("/hy/start/hy-en");
    expect(safeCallbackUrl("/en/learn", "en")).toBe("/en/learn");
  });

  it("rejects open redirects and other locales", () => {
    expect(safeCallbackUrl("https://evil.test", "hy")).toBeNull();
    expect(safeCallbackUrl("//evil.test", "hy")).toBeNull();
    expect(safeCallbackUrl("/en/learn", "hy")).toBeNull();
    expect(safeCallbackUrl("/hy/../en", "hy")).toBeNull();
  });
});

describe("loginUrlWithCallback", () => {
  it("embeds the encoded callback", () => {
    expect(loginUrlWithCallback("hy", "/hy/start/en-hy")).toBe(
      "/hy/login?callbackUrl=%2Fhy%2Fstart%2Fen-hy",
    );
  });
});
