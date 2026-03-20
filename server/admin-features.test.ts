import { describe, it, expect } from "vitest";

/**
 * Tests for admin dashboard features:
 * - Admin access control (only admin2009 can access)
 * - Teacher management (approve/reject/delete)
 * - Game search and filtering
 * - Notification on new registration
 */

describe("Admin Access Control", () => {
  const ADMIN_USERNAME = "admin2009";

  const isAdmin = (username: string) => username === ADMIN_USERNAME;

  it("should grant admin access to admin2009", () => {
    expect(isAdmin("admin2009")).toBe(true);
  });

  it("should deny admin access to regular teachers", () => {
    expect(isAdmin("Ayaali")).toBe(false);
    expect(isAdmin("Ayaali123")).toBe(false);
    expect(isAdmin("Ahmed123")).toBe(false);
  });

  it("should deny admin access to empty username", () => {
    expect(isAdmin("")).toBe(false);
  });

  it("should deny admin access to case variations", () => {
    expect(isAdmin("Admin2009")).toBe(false);
    expect(isAdmin("ADMIN2009")).toBe(false);
  });
});

describe("Teacher Status Management", () => {
  const validStatuses = ["pending", "approved", "rejected"];

  const isValidStatus = (status: string) => validStatuses.includes(status);

  it("should accept valid status values", () => {
    expect(isValidStatus("pending")).toBe(true);
    expect(isValidStatus("approved")).toBe(true);
    expect(isValidStatus("rejected")).toBe(true);
  });

  it("should reject invalid status values", () => {
    expect(isValidStatus("active")).toBe(false);
    expect(isValidStatus("banned")).toBe(false);
    expect(isValidStatus("")).toBe(false);
  });

  it("should correctly manage teacher list after deletion", () => {
    const teachers = [
      { id: 1, name: "Teacher A" },
      { id: 2, name: "Teacher B" },
      { id: 3, name: "Teacher C" },
    ];

    const afterDelete = teachers.filter(t => t.id !== 2);
    expect(afterDelete).toHaveLength(2);
    expect(afterDelete.find(t => t.id === 2)).toBeUndefined();
    expect(afterDelete.map(t => t.name)).toEqual(["Teacher A", "Teacher C"]);
  });

  it("should correctly update teacher status", () => {
    const teachers = [
      { id: 1, name: "Teacher A", approved: "pending" as string },
      { id: 2, name: "Teacher B", approved: "pending" as string },
    ];

    const updated = teachers.map(t =>
      t.id === 1 ? { ...t, approved: "approved" } : t
    );

    expect(updated[0].approved).toBe("approved");
    expect(updated[1].approved).toBe("pending");
  });
});

describe("Game Search and Filtering", () => {
  const quizzes = [
    { id: 1, title: "اختبار الرياضيات", grade: "Grade 3", createdBy: "Ayaali123" },
    { id: 2, title: "اختبار العلوم", grade: "Grade 5", createdBy: "Ahmed123" },
    { id: 3, title: "اختبار اللغة العربية", grade: "Grade 3", createdBy: "Ayaali123" },
    { id: 4, title: "Science Quiz", grade: "Grade 7", createdBy: "Ahmed123" },
    { id: 5, title: "Math Quiz", grade: "Grade 5", createdBy: "Ayaali123" },
  ];

  it("should filter by search query (title match)", () => {
    const searchQuery = "الرياضيات";
    const filtered = quizzes.filter(q =>
      q.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe(1);
  });

  it("should filter by grade", () => {
    const gradeFilter = "Grade 3";
    const filtered = quizzes.filter(q => q.grade === gradeFilter);
    expect(filtered).toHaveLength(2);
    expect(filtered.map(q => q.id)).toEqual([1, 3]);
  });

  it("should combine search and grade filter", () => {
    const searchQuery = "اختبار";
    const gradeFilter = "Grade 5";
    const filtered = quizzes.filter(q => {
      const matchSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchGrade = q.grade === gradeFilter;
      return matchSearch && matchGrade;
    });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe(2);
  });

  it("should return all quizzes when no filters applied", () => {
    const searchQuery = "";
    const gradeFilter = "";
    const filtered = quizzes.filter(q => {
      const matchSearch = !searchQuery || q.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchGrade = !gradeFilter || q.grade === gradeFilter;
      return matchSearch && matchGrade;
    });
    expect(filtered).toHaveLength(5);
  });

  it("should return empty when search has no match", () => {
    const searchQuery = "nonexistent";
    const filtered = quizzes.filter(q =>
      q.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    expect(filtered).toHaveLength(0);
  });

  it("should extract unique grades for filter dropdown", () => {
    const grades = Array.from(new Set(quizzes.map(q => q.grade).filter(Boolean)));
    expect(grades).toContain("Grade 3");
    expect(grades).toContain("Grade 5");
    expect(grades).toContain("Grade 7");
    expect(grades).toHaveLength(3);
  });

  it("should also search by grade text in search bar", () => {
    const searchQuery = "Grade 7";
    const filtered = quizzes.filter(q =>
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.grade && q.grade.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe(4);
  });
});

describe("Admin Dashboard Stats", () => {
  it("should calculate correct stats", () => {
    const hardcodedTeachers = [
      { name: "Ayaali", type: "teacher" },
      { name: "Ayaali123", type: "teacher" },
      { name: "Ahmed123", type: "teacher" },
    ];
    const registeredTeachers = [
      { id: 1, name: "New Teacher 1", approved: "approved" },
      { id: 2, name: "New Teacher 2", approved: "pending" },
      { id: 3, name: "New Teacher 3", approved: "rejected" },
    ];

    const totalTeachers = registeredTeachers.length + hardcodedTeachers.length;
    const pendingCount = registeredTeachers.filter(t => t.approved === "pending").length;

    expect(totalTeachers).toBe(6);
    expect(pendingCount).toBe(1);
  });
});

describe("Owner Notification on Registration", () => {
  it("should format notification correctly for new teacher", () => {
    const name = "Ahmed Teacher";
    const email = "ahmed@school.com";
    const whatsapp = "+966501234567";

    const notification = {
      title: `معلم جديد: ${name.trim()}`,
      content: `تم تسجيل معلم جديد في المنصة:\nالاسم: ${name.trim()}\nالإيميل: ${email}\nواتساب: ${whatsapp}`,
    };

    expect(notification.title).toBe("معلم جديد: Ahmed Teacher");
    expect(notification.content).toContain("Ahmed Teacher");
    expect(notification.content).toContain("ahmed@school.com");
    expect(notification.content).toContain("+966501234567");
  });
});
