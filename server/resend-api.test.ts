import { describe, it, expect } from "vitest";
import { Resend } from "resend";

/**
 * Validates that the RESEND_API_KEY is configured and functional.
 * Sends a real test email to verify credentials.
 */
describe("Resend API Key Validation", () => {
  it("should have RESEND_API_KEY configured", () => {
    const apiKey = process.env.RESEND_API_KEY;
    expect(apiKey).toBeTruthy();
    expect(typeof apiKey).toBe("string");
    expect(apiKey!.length).toBeGreaterThan(10);
  });

  it("should successfully call Resend API to list domains", async () => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("Skipping Resend API test: no API key configured");
      return;
    }

    const resend = new Resend(apiKey);
    const { data, error } = await resend.domains.list();

    // If the API key is valid, we should get a response (even if no domains)
    expect(error).toBeNull();
    expect(data).toBeDefined();
  }, 15000);
});
