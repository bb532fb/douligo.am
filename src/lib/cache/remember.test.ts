import { describe, expect, it } from "vitest";
import { remember } from "@/lib/cache/remember";

describe("remember", () => {
  it("loads through when Redis is disabled in tests", async () => {
    const value = await remember("lezu:test", 10, async () => ({ ok: true }));
    expect(value).toEqual({ ok: true });
  });
});
