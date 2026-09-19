import { describe, expect, it } from "vitest";
import {
  adjustHeartsSchema,
  adminUserQuerySchema,
  updateHeartsMaxSchema,
  updateUserStatusSchema,
} from "@/lib/validations/admin";

describe("adminUserQuerySchema", () => {
  it("defaults to the first page and all statuses", () => {
    const parsed = adminUserQuerySchema.parse({});
    expect(parsed).toEqual({ q: "", status: "ALL", page: 1 });
  });

  it("rejects an unknown status", () => {
    expect(adminUserQuerySchema.safeParse({ status: "BANNED" }).success).toBe(false);
  });
});

describe("adjustHeartsSchema", () => {
  it("accepts add, remove, and refill", () => {
    expect(adjustHeartsSchema.parse({ userId: "u1", intent: "add" }).intent).toBe("add");
    expect(adjustHeartsSchema.safeParse({ userId: "u1", intent: "gift" }).success).toBe(false);
  });
});

describe("updateHeartsMaxSchema", () => {
  it("accepts a hearts cap between 1 and 99", () => {
    expect(updateHeartsMaxSchema.parse({ heartsMax: "8" }).heartsMax).toBe(8);
    expect(updateHeartsMaxSchema.safeParse({ heartsMax: 0 }).success).toBe(false);
    expect(updateHeartsMaxSchema.safeParse({ heartsMax: 100 }).success).toBe(false);
  });
});

describe("updateUserStatusSchema", () => {
  it("accepts only active and suspended", () => {
    expect(updateUserStatusSchema.parse({ userId: "u1", status: "SUSPENDED" }).status).toBe("SUSPENDED");
    expect(updateUserStatusSchema.safeParse({ userId: "u1", status: "BANNED" }).success).toBe(false);
  });
});
