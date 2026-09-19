import { describe, expect, it } from "vitest";
import { registerSchema } from "@/lib/validations/auth";

describe("registerSchema", () => {
  it("rejects short passwords and mismatches", () => {
    const short = registerSchema.safeParse({
      name: "Ani",
      email: "ani@lezoo.app",
      password: "123",
      confirmPassword: "123",
    });
    expect(short.success).toBe(false);

    const mismatch = registerSchema.safeParse({
      name: "Ani",
      email: "ani@lezoo.app",
      password: "Password1",
      confirmPassword: "Password2",
    });
    expect(mismatch.success).toBe(false);
  });

  it("accepts a four-character password of any case or digits", () => {
    const parsed = registerSchema.safeParse({
      name: "Ani",
      email: "ani@lezoo.app",
      password: "ab12",
      confirmPassword: "ab12",
    });
    expect(parsed.success).toBe(true);
  });
});
