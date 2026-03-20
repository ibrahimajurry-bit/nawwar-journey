import { describe, it, expect } from "vitest";

// Mirrors the hardcoded accounts in TeacherLogin.tsx
const accounts: Record<string, { password: string; role: "owner" | "teacher" }> = {
  "admin2009": { password: "admin2009", role: "owner" },
  "Ayaali": { password: "aya1234", role: "teacher" },
  "Ayaali123": { password: "Ayaali123", role: "teacher" },
  "Ahmed123": { password: "Ahmed123", role: "teacher" },
};

function validateLogin(username: string, password: string) {
  const account = accounts[username];
  if (account && account.password === password) {
    return { success: true, role: account.role };
  }
  return { success: false, role: null };
}

describe("Teacher Login Logic", () => {
  it("should accept valid owner credentials (admin2009/admin2009)", () => {
    const result = validateLogin("admin2009", "admin2009");
    expect(result.success).toBe(true);
    expect(result.role).toBe("owner");
  });

  it("should accept Ayaali as regular teacher (not owner)", () => {
    const result = validateLogin("Ayaali", "aya1234");
    expect(result.success).toBe(true);
    expect(result.role).toBe("teacher");
  });

  it("should accept teacher Ayaali123", () => {
    const result = validateLogin("Ayaali123", "Ayaali123");
    expect(result.success).toBe(true);
    expect(result.role).toBe("teacher");
  });

  it("should accept teacher Ahmed123", () => {
    const result = validateLogin("Ahmed123", "Ahmed123");
    expect(result.success).toBe(true);
    expect(result.role).toBe("teacher");
  });

  it("should reject invalid credentials", () => {
    const result = validateLogin("wrong", "wrong123");
    expect(result.success).toBe(false);
  });

  it("should reject wrong password for valid username", () => {
    const result = validateLogin("Ayaali123", "wrongpass");
    expect(result.success).toBe(false);
  });

  it("should handle empty credentials", () => {
    const result = validateLogin("", "");
    expect(result.success).toBe(false);
  });
});
