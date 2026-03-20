import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Trash2, Users, Gamepad2, CheckCircle, XCircle, Clock } from "lucide-react";

interface Teacher {
  id: number;
  name: string;
  email: string;
  whatsapp: string;
  approved: string;
  createdAt: string;
}

interface Quiz {
  id: number;
  title: string;
  grade: string;
  createdBy: string | null;
  createdAt: string;
  storageUrl: string;
}

export default function AdminDashboard() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [activeTab, setActiveTab] = useState<"teachers" | "games">("teachers");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const teacherName = localStorage.getItem("teacherName") || "";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [teachersRes, quizzesRes] = await Promise.all([
        fetch(`/api/admin/teachers?user=${teacherName}`),
        fetch(`/api/quiz/list?user=__all__`),
      ]);
      if (teachersRes.ok) {
        const data = await teachersRes.json();
        setTeachers(data.teachers || []);
      }
      if (quizzesRes.ok) {
        const data = await quizzesRes.json();
        setQuizzes(data.quizzes || []);
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteTeacher = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا المعلم؟")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/teachers/${id}?user=${teacherName}`, { method: "DELETE" });
      if (res.ok) {
        setTeachers((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete teacher:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const updateTeacherStatus = async (id: number, approved: string) => {
    try {
      const res = await fetch(`/api/admin/teachers/${id}?user=${teacherName}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
      });
      if (res.ok) {
        setTeachers((prev) => prev.map((t) => (t.id === id ? { ...t, approved } : t)));
      }
    } catch (err) {
      console.error("Failed to update teacher:", err);
    }
  };

  const deleteQuiz = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذه اللعبة؟")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/quiz/${id}?user=${teacherName}`, { method: "DELETE" });
      if (res.ok) {
        setQuizzes((prev) => prev.filter((q) => q.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete quiz:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"><CheckCircle size={12} /> مفعّل</span>;
      case "rejected":
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"><XCircle size={12} /> مرفوض</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700"><Clock size={12} /> معلّق</span>;
    }
  };

  const hardcodedTeachers = [
    { name: "Ayaali", type: "معلمة" },
    { name: "Ayaali123", type: "معلمة" },
    { name: "Ahmed123", type: "معلم" },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-[#f8fafc] to-[#eff6ff]" style={{ fontFamily: "'Tajawal', sans-serif" }}>
      {/* Header */}
      <header className="bg-gradient-to-r from-[#1a6b3c] to-[#1b5e8a] text-white px-4 py-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => window.location.href = "/"} className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
              <ArrowRight size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold">لوحة تحكم المالك</h1>
              <p className="text-white/70 text-xs">إدارة المعلمين والألعاب التعليمية</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">{teacherName}</span>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-[#1a6b3c]">{teachers.length + hardcodedTeachers.length}</div>
            <div className="text-sm text-gray-500">إجمالي المعلمين</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-blue-600">{teachers.length}</div>
            <div className="text-sm text-gray-500">مسجلين ذاتياً</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-purple-600">{quizzes.length}</div>
            <div className="text-sm text-gray-500">إجمالي الألعاب</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-amber-600">{teachers.filter(t => t.approved === "pending").length}</div>
            <div className="text-sm text-gray-500">بانتظار الموافقة</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("teachers")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === "teachers" ? "bg-[#1a6b3c] text-white shadow-md" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}
          >
            <Users size={16} /> المعلمون
          </button>
          <button
            onClick={() => setActiveTab("games")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === "games" ? "bg-[#1a6b3c] text-white shadow-md" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}
          >
            <Gamepad2 size={16} /> الألعاب التعليمية
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#1a6b3c] border-t-transparent"></div>
          </div>
        ) : (
          <>
            {/* Teachers Tab */}
            {activeTab === "teachers" && (
              <div className="space-y-4">
                {/* Hardcoded accounts */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                    <h3 className="font-bold text-gray-700 text-sm">حسابات مسبقة التعيين</h3>
                  </div>
                  {hardcodedTeachers.map((t, i) => (
                    <div key={i} className="flex items-center justify-between px-5 py-3 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#1a6b3c]/10 flex items-center justify-center text-[#1a6b3c] font-bold text-sm">
                          {t.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800 text-sm">{t.name}</div>
                          <div className="text-xs text-gray-400">{t.type} - حساب ثابت</div>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <CheckCircle size={12} /> مفعّل
                      </span>
                    </div>
                  ))}
                </div>

                {/* Registered teachers */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                    <h3 className="font-bold text-gray-700 text-sm">المعلمون المسجلون ذاتياً ({teachers.length})</h3>
                  </div>
                  {teachers.length === 0 ? (
                    <div className="px-5 py-10 text-center text-gray-400 text-sm">لا يوجد معلمون مسجلون بعد</div>
                  ) : (
                    teachers.map((t) => (
                      <div key={t.id} className="flex items-center justify-between px-5 py-3 border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                            {t.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800 text-sm">{t.name}</div>
                            <div className="text-xs text-gray-400">{t.email} | {t.whatsapp}</div>
                            <div className="text-xs text-gray-300">{new Date(t.createdAt).toLocaleDateString("ar-SA")}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {statusBadge(t.approved)}
                          {t.approved !== "approved" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 border-green-200 hover:bg-green-50 text-xs px-2 py-1 h-auto"
                              onClick={() => updateTeacherStatus(t.id, "approved")}
                            >
                              قبول
                            </Button>
                          )}
                          {t.approved !== "rejected" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-orange-600 border-orange-200 hover:bg-orange-50 text-xs px-2 py-1 h-auto"
                              onClick={() => updateTeacherStatus(t.id, "rejected")}
                            >
                              رفض
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-500 border-red-200 hover:bg-red-50 text-xs px-2 py-1 h-auto"
                            onClick={() => deleteTeacher(t.id)}
                            disabled={deletingId === t.id}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Games Tab */}
            {activeTab === "games" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                  <h3 className="font-bold text-gray-700 text-sm">جميع الألعاب التعليمية ({quizzes.length})</h3>
                </div>
                {quizzes.length === 0 ? (
                  <div className="px-5 py-10 text-center text-gray-400 text-sm">لا توجد ألعاب بعد</div>
                ) : (
                  quizzes.map((q) => (
                    <div key={q.id} className="flex items-center justify-between px-5 py-3 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center">
                          <Gamepad2 size={18} className="text-purple-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800 text-sm">{q.title}</div>
                          <div className="text-xs text-gray-400">
                            {q.grade} | {q.createdBy ? `بواسطة: ${q.createdBy}` : "غير محدد"} | {new Date(q.createdAt).toLocaleDateString("ar-SA")}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={q.storageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          فتح
                        </a>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-500 border-red-200 hover:bg-red-50 text-xs px-2 py-1 h-auto"
                          onClick={() => deleteQuiz(q.id)}
                          disabled={deletingId === q.id}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
