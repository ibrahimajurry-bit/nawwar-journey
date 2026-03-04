/*
 * Educational Games Sub-page - Lists available educational games
 * Shows static games (Nawwar's Journey, Ishara Quiz) + dynamically saved quiz games from DB
 * Owner can delete saved quizzes
 */
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Gamepad2, BookOpen, Sparkles, Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";

const SCHOOL_LOGO = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029980891/VGalWSshoNNhMYmE.png";

interface SavedQuiz {
  id: number;
  title: string;
  grade: string;
  storageUrl: string;
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
  const { user } = useAuth();

  // Check if current user is the owner
  const isOwner = user?.openId === import.meta.env.VITE_APP_ID
    ? true
    : (user?.role === "admin");

  const loadQuizzes = () => {
    fetch("/api/quiz/list")
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
      const res = await fetch(`/api/quiz/${quizId}`, { method: "DELETE" });
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
            <img src={SCHOOL_LOGO} alt="Logo" className="h-10 w-auto" />
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
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 container mx-auto px-4 py-10 max-w-4xl">
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
          {savedQuizzes.map((quiz, idx) => {
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
                  {/* Delete button - owner only */}
                  {isOwner && (
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
                    قريبًا...
                  </p>
                  <p className="text-gray-300 text-sm mt-1">Coming Soon</p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-orange-500 text-white/70 py-4 text-center">
        <p className="text-sm" style={{ fontFamily: "'Tajawal', sans-serif" }}>
          مدرسة الإبداع العلمي الدولية - مويلح | قسم اللغة العربية للناطقين بغيرها
        </p>
      </footer>
    </div>
  );
}
