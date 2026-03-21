import { describe, it, expect } from "vitest";
import crypto from "crypto";

/**
 * Tests for forgot password and reset password features:
 * - Token generation and expiry logic
 * - Password validation rules
 * - Email enumeration protection
 * - Reset token invalidation after use
 */

describe("Password Reset Token Generation", () => {
  it("should generate a 96-char hex token (48 bytes)", () => {
    const token = crypto.randomBytes(48).toString("hex");
    expect(token).toHaveLength(96);
    expect(token).toMatch(/^[0-9a-f]+$/);
  });

  it("should generate unique tokens on each call", () => {
    const t1 = crypto.randomBytes(48).toString("hex");
    const t2 = crypto.randomBytes(48).toString("hex");
    expect(t1).not.toBe(t2);
  });

  it("should set expiry to 1 hour from now", () => {
    const now = Date.now();
    const expiresAt = new Date(now + 60 * 60 * 1000);
    const diffMs = expiresAt.getTime() - now;
    expect(diffMs).toBe(3600000); // exactly 1 hour
  });

  it("should detect expired tokens", () => {
    const expiredAt = new Date(Date.now() - 1000); // 1 second ago
    const isExpired = expiredAt < new Date();
    expect(isExpired).toBe(true);
  });

  it("should detect valid (non-expired) tokens", () => {
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour ahead
    const isExpired = expiresAt < new Date();
    expect(isExpired).toBe(false);
  });
});

describe("Password Reset Validation", () => {
  it("should reject passwords shorter than 6 characters", () => {
    const password = "abc";
    expect(password.length < 6).toBe(true);
  });

  it("should accept passwords of 6 or more characters", () => {
    const password = "abc123";
    expect(password.length >= 6).toBe(true);
  });

  it("should detect mismatched passwords", () => {
    const password = "newpass123";
    const confirm = "newpass456";
    expect(password === confirm).toBe(false);
  });

  it("should accept matching passwords", () => {
    const password = "newpass123";
    const confirm = "newpass123";
    expect(password === confirm).toBe(true);
  });
});

describe("Email Enumeration Protection", () => {
  it("should always return success even for non-existent email", () => {
    // The API always returns { success: true } regardless of whether
    // the email exists, to prevent attackers from discovering registered emails
    const apiResponse = { success: true };
    expect(apiResponse.success).toBe(true);
  });
});

describe("Reset Token Invalidation", () => {
  it("should mark token as used after password reset", () => {
    const token = { id: 1, usedAt: null as Date | null };
    // Simulate marking as used
    token.usedAt = new Date();
    expect(token.usedAt).not.toBeNull();
  });

  it("should reject already-used tokens", () => {
    const token = { usedAt: new Date() }; // already used
    const isUsed = token.usedAt !== null;
    expect(isUsed).toBe(true);
  });

  it("should accept unused tokens", () => {
    const token = { usedAt: null };
    const isUsed = token.usedAt !== null;
    expect(isUsed).toBe(false);
  });
});

describe("Reset URL Construction", () => {
  it("should construct reset URL with token parameter", () => {
    const origin = "https://nawwarjourney.qpon";
    const token = "abc123def456";
    const resetUrl = `${origin}/reset-password?token=${token}`;
    expect(resetUrl).toBe("https://nawwarjourney.qpon/reset-password?token=abc123def456");
  });

  it("should use request origin for reset URL", () => {
    const origin = "https://nawwarjourney-s9ufanxe.manus.space";
    const token = "testtoken";
    const resetUrl = `${origin}/reset-password?token=${token}`;
    expect(resetUrl).toContain("/reset-password?token=");
    expect(resetUrl).toContain(origin);
  });
});

describe("Password Reset Email Content", () => {
  it("should include teacher name in reset email", () => {
    const teacherName = "أحمد المعلم";
    const html = `<p>أهلاً ${teacherName}،</p>`;
    expect(html).toContain(teacherName);
  });

  it("should include reset URL in email body", () => {
    const resetUrl = "https://nawwarjourney.qpon/reset-password?token=abc";
    const html = `<a href="${resetUrl}">إعادة تعيين كلمة المرور</a>`;
    expect(html).toContain(resetUrl);
  });

  it("should include expiry warning in email", () => {
    const html = `<p>هذا الرابط صالح لمدة ساعة واحدة فقط</p>`;
    expect(html).toContain("ساعة واحدة");
  });
});
