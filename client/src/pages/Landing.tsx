/*
 * Landing Page - Nawwar Journey educational platform
 * Two main sections: QR Code Generator + Educational Games
 */
import { Link } from "wouter";
import { motion } from "framer-motion";
import { QrCode, Gamepad2, LogOut, Wand2 } from "lucide-react";

const categories = [
  {
    id: "qr",
    title: "مولّد أكواد QR",
    subtitle: "QR Code Generator",
    icon: QrCode,
    href: "/apps/qr-generator",
    gradient: "from-[#1a6b3c] via-[#1e7a44] to-[#228B52]",
    hoverBorder: "hover:border-green-300",
  },
  {
    id: "quiz-generator",
    title: "منشئ الألعاب التعليمية",
    subtitle: "AI Quiz Generator",
    icon: Wand2,
    href: "/apps/quiz-generator",
    gradient: "from-purple-600 via-purple-500 to-indigo-500",
    hoverBorder: "hover:border-purple-300",
  },
  {
    id: "games",
    title: "الألعاب التعليمية",
    subtitle: "Educational Games",
    icon: Gamepad2,
    href: "/games",
    gradient: "from-orange-500 via-orange-400 to-amber-500",
    hoverBorder: "hover:border-orange-300",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Landing() {
  const teacherName = localStorage.getItem("teacherName") || "";

  const handleLogout = () => {
    localStorage.removeItem("teacherLoggedIn");
    localStorage.removeItem("teacherName");
    localStorage.removeItem("isOwner");
    window.location.reload();
  };

  return (
    <div dir="rtl" className="min-h-screen flex flex-col bg-gradient-to-b from-[#f0f7f0] via-white to-[#f0f4f8]">
      {/* Hero Header */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[#1a6b3c] via-[#1e7a44] to-[#1b5e8a] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-10 left-20 w-60 h-60 rounded-full bg-white/15 blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 py-8 flex flex-col items-center gap-3">
          {/* Logout button */}
          {teacherName && (
            <motion.div
              className="absolute top-4 left-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs transition-colors bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full"
                style={{ fontFamily: "'Tajawal', sans-serif" }}
              >
                <LogOut size={14} />
                <span>خروج</span>
              </button>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310419663029980891/S9UfAnxEfs6upsP98hCzwU/nawwar-logo-AWuZdjrAyTDDSJocatLxwi.png"
              alt="Nawar Logo"
              className="w-20 h-20 rounded-2xl shadow-lg"
            />
          </motion.div>
          <motion.h1
            className="text-2xl md:text-3xl font-bold text-center"
            style={{ fontFamily: "'Tajawal', sans-serif" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Nawwar Journey
          </motion.h1>
          <motion.p
            className="text-base text-white/80 text-center"
            style={{ fontFamily: "'Tajawal', sans-serif" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            منصة تعليمية للتطبيقات والألعاب التفاعلية
          </motion.p>
          {teacherName && (
            <motion.p
              className="text-sm text-white/50"
              style={{ fontFamily: "'Tajawal', sans-serif" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              مرحباً، {teacherName}
            </motion.p>
          )}
        </div>
      </header>

      {/* Section Title */}
      <div className="container mx-auto px-4 pt-10 pb-2 max-w-3xl">
        <h2
          className="text-lg font-bold text-gray-700 text-center"
          style={{ fontFamily: "'Tajawal', sans-serif" }}
        >
          تطبيقات الموقع
        </h2>
        <p className="text-xs text-gray-400 text-center mt-1">Site Applications</p>
      </div>

      {/* Main Content - 2 Category Icons */}
      <main className="flex-1 flex items-start justify-center px-4 py-6">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6 max-w-3xl w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <motion.div key={cat.id} variants={itemVariants}>
                <Link href={cat.href}>
                  <div
                    className={`group cursor-pointer flex flex-col items-center gap-4 p-6 md:p-8 rounded-3xl bg-white border-2 border-gray-100 ${cat.hoverBorder} shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                  >
                    {/* Icon Circle */}
                    <div
                      className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}
                    >
                      <Icon size={36} className="text-white md:w-10 md:h-10" />
                    </div>

                    {/* Text */}
                    <div className="text-center">
                      <h2
                        className="text-lg md:text-xl font-bold text-gray-800"
                        style={{ fontFamily: "'Tajawal', sans-serif" }}
                      >
                        {cat.title}
                      </h2>
                      <p className="text-xs text-gray-400 mt-1">
                        {cat.subtitle}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1a6b3c] text-white/70 py-4 text-center">
        <p className="text-sm" style={{ fontFamily: "'Tajawal', sans-serif" }}>
          Nawwar Journey &mdash; منصة تعليمية للتطبيقات التفاعلية
        </p>
      </footer>
    </div>
  );
}
