/*
 * Landing Page - Main portal for educational games and ASL applications
 * Design: School-branded with green/blue from logo, warm and professional
 * Layout: Hero header with logo, two sections with cards
 */
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Gamepad2, Wrench, QrCode, BookOpen } from "lucide-react";

const SCHOOL_LOGO_SVG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029980891/S9UfAnxEfs6upsP98hCzwU/لوجومدرسةمويلح_504ef8b0.svg";
const SCHOOL_LOGO = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029980891/VGalWSshoNNhMYmE.png";
const BIRD_MASCOT = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029980891/gwfAUXMSiAbMjjkq.png";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function Landing() {
  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-[#f0f7f0] via-white to-[#f0f4f8]">
      {/* Hero Header */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[#1a6b3c] via-[#1e7a44] to-[#1b5e8a] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-10 left-20 w-60 h-60 rounded-full bg-white/15 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 py-10 flex flex-col items-center gap-4">
          <motion.img
            src={SCHOOL_LOGO}
            alt="School Logo"
            className="h-24 w-auto drop-shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-center"
            style={{ fontFamily: "'Tajawal', sans-serif" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            مدرسة الإبداع العلمي الدولية - مويلح
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-white/80 text-center"
            style={{ fontFamily: "'Tajawal', sans-serif" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            قسم اللغة العربية للناطقين بغيرها - ASL
          </motion.p>
          <motion.img
            src={BIRD_MASCOT}
            alt="Bird Mascot"
            className="h-16 w-auto mt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Section 1: Educational Games */}
        <motion.section
          className="mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div className="flex items-center gap-3 mb-8" custom={0} variants={fadeUp}>
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg">
              <Gamepad2 size={24} />
            </div>
            <div>
              <h2
                className="text-2xl md:text-3xl font-bold text-[#1a6b3c]"
                style={{ fontFamily: "'Tajawal', sans-serif" }}
              >
                الألعاب التعليمية
              </h2>
              <p className="text-sm text-gray-500" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                Educational Games
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Game Card: Nawwar's Journey */}
            <motion.div custom={1} variants={fadeUp}>
              <Link href="/games/nawwar">
                <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 hover:border-orange-200">
                  <div className="h-44 bg-gradient-to-br from-orange-400 via-orange-500 to-amber-500 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyIiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-50" />
                    <div className="text-center relative z-10">
                      <div className="text-5xl mb-2">🗺️</div>
                      <p className="text-white font-bold text-lg" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                        رِحْلَةُ نَوَّارٍ
                      </p>
                      <p className="text-white/80 text-sm">Nawwar's Journey</p>
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
                      لعبة تفاعلية عن قصة "جارنا السيد مهم" مع أسئلة عن القصة وأسماء الإشارة والضمائر
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-orange-500 font-medium text-sm group-hover:gap-3 transition-all" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                      <span>ابدأ اللعب</span>
                      <span className="transform rotate-180">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Placeholder for future games */}
            <motion.div custom={2} variants={fadeUp}>
              <div className="relative bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden h-full min-h-[320px] flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="text-4xl mb-3 opacity-40">🎮</div>
                  <p className="text-gray-400 font-medium" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                    قريبًا...
                  </p>
                  <p className="text-gray-300 text-sm mt-1">Coming Soon</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Section 2: ASL Applications */}
        <motion.section
          className="mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div className="flex items-center gap-3 mb-8" custom={0} variants={fadeUp}>
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#1a6b3c] to-[#1b5e8a] text-white shadow-lg">
              <Wrench size={24} />
            </div>
            <div>
              <h2
                className="text-2xl md:text-3xl font-bold text-[#1a6b3c]"
                style={{ fontFamily: "'Tajawal', sans-serif" }}
              >
                تطبيقات ASL
              </h2>
              <p className="text-sm text-gray-500" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                ASL Applications
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* App Card: QR Code Generator */}
            <motion.div custom={1} variants={fadeUp}>
              <Link href="/apps/qr-generator">
                <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 hover:border-green-200">
                  <div className="h-44 bg-gradient-to-br from-[#1a6b3c] via-[#1e7a44] to-[#1b5e8a] flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyIiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-50" />
                    <div className="text-center relative z-10">
                      <QrCode size={56} className="text-white mx-auto mb-2" />
                      <p className="text-white font-bold text-lg" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                        مولد أكواد QR
                      </p>
                      <p className="text-white/80 text-sm">QR Code Generator</p>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <QrCode size={16} className="text-green-600" />
                      <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                        أداة احترافية
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                      أنشئ رمز QR احترافيًا مع لوجو المدرسة - أدخل الرابط وحمّل الكود فورًا
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-green-600 font-medium text-sm group-hover:gap-3 transition-all" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                      <span>افتح الأداة</span>
                      <span className="transform rotate-180">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Placeholder for future apps */}
            <motion.div custom={2} variants={fadeUp}>
              <div className="relative bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden h-full min-h-[320px] flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="text-4xl mb-3 opacity-40">🛠️</div>
                  <p className="text-gray-400 font-medium" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                    قريبًا...
                  </p>
                  <p className="text-gray-300 text-sm mt-1">Coming Soon</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="bg-[#1a6b3c] text-white/70 py-6 text-center">
        <p className="text-sm" style={{ fontFamily: "'Tajawal', sans-serif" }}>
          مدرسة الإبداع العلمي الدولية - مويلح | قسم اللغة العربية للناطقين بغيرها
        </p>
      </footer>
    </div>
  );
}
