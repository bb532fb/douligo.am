import { describe, expect, it } from "vitest";
import { replaceLocale, stripLocale, withLocale } from "@/i18n/path";

describe("i18n paths", () => {
  it("prefixes and strips locale segments", () => {
    expect(withLocale("en", "/learn")).toBe("/en/learn");
    expect(withLocale("hy", "/")).toBe("/hy");
    expect(stripLocale("/ru/settings")).toBe("/settings");
    expect(replaceLocale("/hy/profile", "en")).toBe("/en/profile");
  });
});
