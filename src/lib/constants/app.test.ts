import { describe, expect, it } from "vitest";
import { isCefrLevel, isCourseSlug } from "@/lib/constants/app";

describe("course and level ids", () => {
  it("accepts the four published track slugs", () => {
    expect(isCourseSlug("hy-en")).toBe(true);
    expect(isCourseSlug("hy-fr")).toBe(false);
  });

  it("accepts A1–B1 placement levels", () => {
    expect(isCefrLevel("A1")).toBe(true);
    expect(isCefrLevel("C1")).toBe(false);
  });
});
