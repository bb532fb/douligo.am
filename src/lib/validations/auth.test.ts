import { describe, expect, it } from "vitest";
import { registerSchema } from "@/lib/validations/auth";

describe("registerSchema", () => {
  it("rejects short passwords and mismatches", () => {
    const short = registerSchema.safeParse({
      name: "Ani",
      email: "ani@lezu.app",
      password: "123",
      confirmPassword: "123",
    });
    expect(short.success).toBe(false);

    const mismatch = registerSchema.safeParse({
      name: "Ani",
      email: "ani@lezu.app",
      password: "Password1",
      confirmPassword: "Password2",
    });
    expect(mismatch.success).toBe(false);
  });

  it("accepts a valid payload", () => {
    const parsed = registerSchema.safeParse({
      name: "Ani",
      email: "ani@lezu.app",
      password: "Password1",
      confirmPassword: "Password1",
    });
    expect(parsed.success).toBe(true);
  });
});
