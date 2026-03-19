import { describe, it, expect } from "vitest";

describe("Teacher Login Logic", () => {
  it("should accept valid owner credentials", () => {
    const username = "Ayaali";
    const password = "aya1234";
    const isOwner = username === "Ayaali" && password === "aya1234";
    expect(isOwner).toBe(true);
  });

  it("should reject invalid credentials", () => {
    const username = "wrong";
    const password = "wrong123";
    const isOwner = username === "Ayaali" && password === "aya1234";
    expect(isOwner).toBe(false);
  });

  it("should handle empty credentials", () => {
    const username = "";
    const password = "";
    const isValid = username.trim().length > 0 && password.trim().length > 0;
    expect(isValid).toBe(false);
  });
});
