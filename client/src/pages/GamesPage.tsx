/*
 * Educational Games Sub-page - Lists available educational games
 * Shows static games (Nawwar's Journey, Ishara Quiz) + dynamically saved quiz games from DB
 * Privacy: Teachers see only their own quizzes, Owner sees all
 */
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Gamepad2, BookOpen, Sparkles, Loader2, Trash2, Search, Filter } from "lucide-react";
import { useEffect, useState } from "react";



interface SavedQuiz {
  id: number;
  title: string;
  grade: string;
  subject?: string;
  storageUrl: string;
  createdBy: string | null;
  createdAt: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" as const },
  }),
};

// Gradient colors for generated quiz cards
const quizGradients = [
  "from-violet-500 via-purple-500 to-indigo-600",
  "from-rose-500 via-pink-500 to-fuchsia-600",
  "from-cyan-500 via-sky-500 to-blue-600",
  "from-lime-500 via-green-500 to-emerald-600",
  "from-amber-500 via-yellow-500 to-orange-500",
];

export default function GamesPage() {
  const [savedQuizzes, setSavedQuizzes] = useState<SavedQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");

  const SUBJECTS = [
    { value: "", label: "جميع المواد" },
    { value: "عربي", label: "عربي" },
    { value: "رياضيات", label: "رياضيات" },
    { value: "علوم", label: "علوم" },
    { value: "إنجليزي", label: "إنجليزي" },
    { value: "دينية", label: "دينية" },
    { value: "تاريخ", label: "تاريخ" },
    { value: "جغرافيا", label: "جغرافيا" },
    { value: "تربية وطنية", label: "تربية وطنية" },
    { value: "حاسوب", label: "حاسوب" },
    { value: "فنون", label: "فنون" },
    { value: "أخرى", label: "أخرى" },
  ];

  // Get current teacher info from localStorage
  const teacherName = localStorage.getItem("teacherName") || "";
  const isOwner = localStorage.getItem("isOwner") === "true" || teacherName === "admin2009";

  const loadQuizzes = () => {
    // Owner sees all quizzes, teachers see only their own
    const userParam = isOwner ? "__all__" : teacherName;
    fetch(`/api/quiz/list?user=${encodeURIComponent(userParam)}`)
      .then((res) => res.json())
      .then((data) => {
        setSavedQuizzes(data.quizzes || []);
      })
      .catch((err) => {
        console.error("Failed to load quizzes:", err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  const handleDelete = async (quizId: number, quizTitle: string) => {
    if (!confirm(`هل أنت متأكد من حذف "${quizTitle}"؟`)) return;
    setDeleting(quizId);
    try {
      const res = await fetch(`/api/quiz/${quizId}?user=${encodeURIComponent(teacherName)}`, { method: "DELETE" });
      if (res.ok) {
        setSavedQuizzes((prev) => prev.filter((q) => q.id !== quizId));
      } else {
        const data = await res.json();
        alert(data.error || "فشل الحذف");
      }
    } catch (err) {
      alert("فشل الاتصال بالسيرفر");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen flex flex-col bg-gradient-to-b from-[#f0f7f0] via-white to-[#f0f4f8]">
      {/* Header */}
      <header className="bg-gradient-to-br from-orange-500 via-orange-400 to-amber-500 text-white">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <Link href="/">
              <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm">
                <ArrowRight size={18} />
                <span style={{ fontFamily: "'Tajawal', sans-serif" }}>الرئيسية</span>
              </button>
            </Link>

          </div>
          <div className="text-center mt-4 pb-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 mb-3">
              <Gamepad2 size={28} className="text-white" />
            </div>
            <h1
              className="text-2xl md:text-3xl font-bold"
              style={{ fontFamily: "'Tajawal', sans-serif" }}
            >
              ألعاب تعليمية
            </h1>
            <p className="text-white/60 text-sm mt-1">Educational Games</p>
            {/* Show who is viewing */}
            {teacherName && (
              <p className="text-white/50 text-xs mt-2" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                {isOwner ? `👑 مرحباً ${teacherName} (المالك - تعرض جميع الألعاب)` : `مرحباً ${teacherName}`}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Search & Filter */}
      <div className="container mx-auto px-4 pt-6 pb-2 max-w-4xl">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث عن لعبة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
              style={{ fontFamily: "'Tajawal', sans-serif" }}
            />
          </div>
          {savedQuizzes.length > 0 && (
            <>
              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 text-gray-600"
                style={{ fontFamily: "'Tajawal', sans-serif" }}
              >
                <option value="">جميع الصفوف</option>
                {Array.from(new Set(savedQuizzes.map(q => q.grade).filter(Boolean))).map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 text-gray-600"
                style={{ fontFamily: "'Tajawal', sans-serif" }}
              >
                {SUBJECTS.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          viewport={{ once: true }}
        >
          {/* Nawwar's Journey Card */}
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
            <Link href="/games/nawwar">
              <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 hover:border-orange-200 hover:-translate-y-1">
                <div className="h-40 bg-gradient-to-br from-orange-400 via-orange-500 to-amber-500 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/20 blur-2xl" />
                    <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-white/15 blur-2xl" />
                  </div>
                  <div className="text-center relative z-10">
                    <div className="text-5xl mb-2">🗺️</div>
                    <p className="text-white font-bold text-lg" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                      رِحْلَةُ نَوَّارٍ
                    </p>
                    <p className="text-white/70 text-xs">Nawwar's Journey</p>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen size={16} className="text-orange-500" />
                    <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                      قصة جارنا السيد مهم
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                    لعبة تفاعلية عن قصة "جارنا السيد مهم" مع أسئلة ممتعة
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-orange-500 font-medium text-sm group-hover:gap-3 transition-all" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                    <span>ابدأ اللعب</span>
                    <span className="transform rotate-180">→</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Ishara Quiz Card */}
          <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
            <Link href="/games/ishara">
              <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 hover:border-orange-200 hover:-translate-y-1">
                <div className="h-40 bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-600 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/20 blur-2xl" />
                    <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-white/15 blur-2xl" />
                  </div>
                  <div className="text-center relative z-10">
                    <div className="text-5xl mb-2">🔤</div>
                    <p className="text-white font-bold text-lg" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                      أَسْمَاءُ الْإِشَارَةِ
                    </p>
                    <p className="text-white/70 text-xs">Demonstrative Pronouns Quiz</p>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen size={16} className="text-emerald-500" />
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                      اختبار تفاعلي
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                    اختبار تفاعلي عن أسماء الإشارة مع مؤقت وشهادة إتمام
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-emerald-500 font-medium text-sm group-hover:gap-3 transition-all" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                    <span>ابدأ الاختبار</span>
                    <span className="transform rotate-180">→</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Dynamically generated quiz games from database */}
          {savedQuizzes
            .filter(q => {
              const matchSearch = !searchQuery || q.title.toLowerCase().includes(searchQuery.toLowerCase()) || (q.grade && q.grade.toLowerCase().includes(searchQuery.toLowerCase()));
              const matchGrade = !gradeFilter || q.grade === gradeFilter;
              const matchSubject = !subjectFilter || (q.subject && q.subject === subjectFilter);
              return matchSearch && matchGrade && matchSubject;
            })
            .map((quiz, idx) => {
            const gradientClass = quizGradients[idx % quizGradients.length];
            return (
              <motion.div key={quiz.id} custom={idx + 2} variants={fadeUp} initial="hidden" animate="visible">
                <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-purple-200 hover:-translate-y-1">
                  <a href={quiz.storageUrl} target="_blank" rel="noopener noreferrer">
                    <div className={`h-40 bg-gradient-to-br ${gradientClass} flex items-center justify-center relative overflow-hidden`}>
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/20 blur-2xl" />
                        <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-white/15 blur-2xl" />
                      </div>
                      <div className="text-center relative z-10">
                        <div className="text-5xl mb-2">🎮</div>
                        <p className="text-white font-bold text-lg leading-tight px-4" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                          {quiz.title}
                        </p>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={16} className="text-purple-500" />
                        <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                          {quiz.grade}
                        </span>
                        {quiz.subject && (
                          <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                            {quiz.subject}
                          </span>
                        )}
                        {/* Show creator name for owner */}
                        {isOwner && quiz.createdBy && (
                          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                            👤 {quiz.createdBy}
                          </span>
                        )}
                        <span className="text-xs text-gray-400 mr-auto" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                          {new Date(quiz.createdAt).toLocaleDateString("ar-SA")}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                        لعبة تعليمية تفاعلية مع مؤقت وشهادة إتمام
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-purple-500 font-medium text-sm group-hover:gap-3 transition-all" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                        <span>ابدأ اللعب</span>
                        <span className="transform rotate-180">→</span>
                      </div>
                    </div>
                  </a>
                  {/* Delete button - owner can delete any, teacher can delete their own */}
                  {(isOwner || quiz.createdBy === teacherName) && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(quiz.id, quiz.title);
                      }}
                      disabled={deleting === quiz.id}
                      className="absolute top-3 left-3 z-20 bg-red-500/90 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100"
                      title="حذف اللعبة"
                    >
                      {deleting === quiz.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Loading indicator */}
          {loading && (
            <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
              <div className="relative bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden h-full min-h-[280px] flex items-center justify-center">
                <div className="text-center p-6">
                  <Loader2 className="animate-spin text-gray-400 mx-auto mb-3" size={32} />
                  <p className="text-gray-400 font-medium" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                    جارٍ التحميل...
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Placeholder - only show if no saved quizzes and not loading */}
          {!loading && savedQuizzes.length === 0 && (
            <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
              <div className="relative bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden h-full min-h-[280px] flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="text-4xl mb-3 opacity-40">🎮</div>
                  <p className="text-gray-400 font-medium" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                    لا توجد ألعاب بعد
                  </p>
                  <p className="text-gray-300 text-sm mt-1">أنشئ لعبة من مولّد الألعاب التعليمية</p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-orange-500 text-white/70 py-4 text-center">
        <p className="text-sm" style={{ fontFamily: "'Tajawal', sans-serif" }}>
          Nawwar Journey &mdash; منصة تعليمية للتطبيقات التفاعلية
        </p>
      </footer>
    </div>
  );
}
