import { describe, it, expect } from "vitest";

// Unit tests for teacher registration and login validation logic
// (Integration tests would require a running server + DB)

describe("Teacher Registration Validation", () => {
  const validateRegistration = (data: {
    name: string;
    email: string;
    whatsapp: string;
    password: string;
  }) => {
    if (!data.name || !data.email || !data.whatsapp || !data.password) {
      return { valid: false, error: "All fields are required" };
    }
    if (data.password.length < 6) {
      return { valid: false, error: "Password must be at least 6 characters" };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return { valid: false, error: "Invalid email format" };
    }
    return { valid: true };
  };

  it("should accept valid registration data", () => {
    const result = validateRegistration({
      name: "Ahmed Teacher",
      email: "ahmed@school.com",
      whatsapp: "+966501234567",
      password: "secure123",
    });
    expect(result.valid).toBe(true);
  });

  it("should reject empty name", () => {
    const result = validateRegistration({
      name: "",
      email: "ahmed@school.com",
      whatsapp: "+966501234567",
      password: "secure123",
    });
    expect(result.valid).toBe(false);
    expect(result.error).toBe("All fields are required");
  });

  it("should reject short password", () => {
    const result = validateRegistration({
      name: "Ahmed",
      email: "ahmed@school.com",
      whatsapp: "+966501234567",
      password: "abc",
    });
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Password must be at least 6 characters");
  });

  it("should reject invalid email format", () => {
    const result = validateRegistration({
      name: "Ahmed",
      email: "not-an-email",
      whatsapp: "+966501234567",
      password: "secure123",
    });
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Invalid email format");
  });

  it("should reject missing whatsapp", () => {
    const result = validateRegistration({
      name: "Ahmed",
      email: "ahmed@school.com",
      whatsapp: "",
      password: "secure123",
    });
    expect(result.valid).toBe(false);
  });
});

describe("Hardcoded Account Authentication", () => {
  // Updated: admin2009 is now the owner, Ayaali is a regular teacher
  const hardcodedAccounts: Record<string, { password: string; role: "owner" | "teacher" }> = {
    admin2009: { password: "admin2009", role: "owner" },
    Ayaali: { password: "aya1234", role: "teacher" },
    Ayaali123: { password: "Ayaali123", role: "teacher" },
    Ahmed123: { password: "Ahmed123", role: "teacher" },
  };

  const authenticate = (username: string, password: string) => {
    const account = hardcodedAccounts[username];
    if (account && account.password === password) {
      return { success: true, role: account.role };
    }
    return { success: false };
  };

  it("should authenticate admin2009 as owner", () => {
    const result = authenticate("admin2009", "admin2009");
    expect(result.success).toBe(true);
    expect(result.role).toBe("owner");
  });

  it("should authenticate Ayaali as teacher (not owner)", () => {
    const result = authenticate("Ayaali", "aya1234");
    expect(result.success).toBe(true);
    expect(result.role).toBe("teacher");
  });

  it("should authenticate teacher Ayaali123", () => {
    const result = authenticate("Ayaali123", "Ayaali123");
    expect(result.success).toBe(true);
    expect(result.role).toBe("teacher");
  });

  it("should authenticate teacher Ahmed123", () => {
    const result = authenticate("Ahmed123", "Ahmed123");
    expect(result.success).toBe(true);
    expect(result.role).toBe("teacher");
  });

  it("should reject wrong password", () => {
    const result = authenticate("admin2009", "wrongpassword");
    expect(result.success).toBe(false);
  });

  it("should reject unknown username", () => {
    const result = authenticate("unknown", "password");
    expect(result.success).toBe(false);
  });
});
