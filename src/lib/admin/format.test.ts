import { describe, expect, it } from "vitest";
import { formatAdminDate } from "@/lib/admin/format";

describe("formatAdminDate", () => {
  it("formats a fixed UTC date without throwing", () => {
    const text = formatAdminDate(new Date("2026-09-19T12:00:00Z"), "en");
    expect(text.length).toBeGreaterThan(4);
  });
});
