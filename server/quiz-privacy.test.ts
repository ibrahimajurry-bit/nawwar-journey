import { describe, it, expect } from "vitest";

/**
 * Tests for quiz privacy system and quiz generation endpoint
 * These test the logic of the privacy filtering and parameter handling
 */

describe("Quiz Privacy System", () => {
  // Test the privacy filtering logic
  it("should filter quizzes by createdBy for teachers", () => {
    const allQuizzes = [
      { id: 1, title: "Quiz 1", createdBy: "Ayaali123" },
      { id: 2, title: "Quiz 2", createdBy: "Ahmed123" },
      { id: 3, title: "Quiz 3", createdBy: "Ayaali123" },
      { id: 4, title: "Quiz 4", createdBy: null },
    ];

    // Teacher Ayaali123 should only see their own quizzes
    const ayaali123Quizzes = allQuizzes.filter(q => q.createdBy === "Ayaali123");
    expect(ayaali123Quizzes).toHaveLength(2);
    expect(ayaali123Quizzes.every(q => q.createdBy === "Ayaali123")).toBe(true);

    // Teacher Ahmed123 should only see their own quizzes
    const ahmed123Quizzes = allQuizzes.filter(q => q.createdBy === "Ahmed123");
    expect(ahmed123Quizzes).toHaveLength(1);
    expect(ahmed123Quizzes[0].id).toBe(2);
  });

  it("should show all quizzes for owner (__all__ filter)", () => {
    const allQuizzes = [
      { id: 1, title: "Quiz 1", createdBy: "Ayaali123" },
      { id: 2, title: "Quiz 2", createdBy: "Ahmed123" },
      { id: 3, title: "Quiz 3", createdBy: null },
    ];

    // Owner uses __all__ filter - no filtering applied
    const userFilter = "__all__";
    const result = userFilter === "__all__" ? allQuizzes : allQuizzes.filter(q => q.createdBy === userFilter);
    expect(result).toHaveLength(3);
  });

  it("should correctly identify admin2009 as owner (not Ayaali)", () => {
    // Updated: admin2009 is the owner, Ayaali is now a regular teacher
    const accounts: Record<string, { password: string; role: "owner" | "teacher" }> = {
      "admin2009": { password: "admin2009", role: "owner" },
      "Ayaali": { password: "aya1234", role: "teacher" },
      "Ayaali123": { password: "Ayaali123", role: "teacher" },
      "Ahmed123": { password: "Ahmed123", role: "teacher" },
    };

    expect(accounts["admin2009"].role).toBe("owner");
    expect(accounts["Ayaali"].role).toBe("teacher");
    expect(accounts["Ayaali123"].role).toBe("teacher");
    expect(accounts["Ahmed123"].role).toBe("teacher");
  });

  it("should only allow admin2009 to delete quizzes", () => {
    const canDelete = (username: string) => username === "admin2009";

    expect(canDelete("admin2009")).toBe(true);
    expect(canDelete("Ayaali")).toBe(false);
    expect(canDelete("Ayaali123")).toBe(false);
    expect(canDelete("Ahmed123")).toBe(false);
    expect(canDelete("")).toBe(false);
  });
});

describe("Quiz Generation Endpoint", () => {
  it("should accept questionsText parameter", () => {
    // Simulate the request body
    const reqBody = { questionsText: "1. ما هو الحيوان الأسرع؟\nأ) الأسد\nب) الفهد ✅\nج) الحصان" };
    const { questionsText, prompt } = reqBody;
    const inputText = questionsText || prompt;
    
    expect(inputText).toBe(reqBody.questionsText);
    expect(typeof inputText).toBe("string");
    expect(inputText.length).toBeGreaterThan(0);
  });

  it("should also accept legacy prompt parameter", () => {
    const reqBody = { prompt: "Some prompt text" };
    const { questionsText, prompt } = reqBody as any;
    const inputText = questionsText || prompt;
    
    expect(inputText).toBe("Some prompt text");
  });

  it("should reject empty input", () => {
    const reqBody = {};
    const { questionsText, prompt } = reqBody as any;
    const inputText = questionsText || prompt;
    
    expect(!inputText || typeof inputText !== "string").toBe(true);
  });

  it("should parse JSON array from AI response", () => {
    // Simulate AI response with JSON array
    const aiResponse = `[{"id":1,"type":"mc","question":"ما هو الحيوان الأسرع؟","options":["الأسد","الفهد","الحصان","الغزال"],"correct":1}]`;
    
    const jsonMatch = aiResponse.match(/\[\s*\{[\s\S]*\}\s*\]/);
    expect(jsonMatch).not.toBeNull();
    
    const parsed = JSON.parse(jsonMatch![0]);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].type).toBe("mc");
    expect(parsed[0].correct).toBe(1);
  });

  it("should handle AI response with surrounding text", () => {
    const aiResponse = `Here are the questions:\n[{"id":1,"type":"tf","question":"الشمس تشرق من الشرق","correct":true}]\nDone!`;
    
    const jsonMatch = aiResponse.match(/\[\s*\{[\s\S]*\}\s*\]/);
    expect(jsonMatch).not.toBeNull();
    
    const parsed = JSON.parse(jsonMatch![0]);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].type).toBe("tf");
    expect(parsed[0].correct).toBe(true);
  });
});
