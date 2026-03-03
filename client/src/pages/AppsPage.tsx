/*
 * ASL Apps Sub-page - Lists available ASL applications
 * Currently: QR Code Generator
 */
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, QrCode, Wrench } from "lucide-react";

const SCHOOL_LOGO = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029980891/VGalWSshoNNhMYmE.png";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function AppsPage() {
  return (
    <div dir="rtl" className="min-h-screen flex flex-col bg-gradient-to-b from-[#f0f7f0] via-white to-[#f0f4f8]">
      {/* Header */}
      <header className="bg-gradient-to-br from-[#1a6b3c] via-[#1e7a44] to-[#228B52] text-white">
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
              <Wrench size={28} className="text-white" />
            </div>
            <h1
              className="text-2xl md:text-3xl font-bold"
              style={{ fontFamily: "'Tajawal', sans-serif" }}
            >
              تطبيقات قسم ASL
            </h1>
            <p className="text-white/60 text-sm mt-1">ASL Applications</p>
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
          {/* QR Code Generator Card */}
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
            <Link href="/apps/qr-generator">
              <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 hover:border-green-200 hover:-translate-y-1">
                <div className="h-40 bg-gradient-to-br from-[#1a6b3c] via-[#1e7a44] to-[#1b5e8a] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/20 blur-2xl" />
                    <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-white/15 blur-2xl" />
                  </div>
                  <div className="text-center relative z-10">
                    <QrCode size={48} className="text-white mx-auto mb-2" />
                    <p className="text-white font-bold text-lg" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                      مولد أكواد QR
                    </p>
                    <p className="text-white/70 text-xs">QR Code Generator</p>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-gray-600 text-sm leading-relaxed" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                    أنشئ رمز QR احترافيًا مع لوجو المدرسة
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-green-600 font-medium text-sm group-hover:gap-3 transition-all" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                    <span>افتح الأداة</span>
                    <span className="transform rotate-180">→</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Placeholder */}
          <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible">
            <div className="relative bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden h-full min-h-[280px] flex items-center justify-center">
              <div className="text-center p-6">
                <div className="text-4xl mb-3 opacity-40">🛠️</div>
                <p className="text-gray-400 font-medium" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                  قريبًا...
                </p>
                <p className="text-gray-300 text-sm mt-1">Coming Soon</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1a6b3c] text-white/70 py-4 text-center">
        <p className="text-sm" style={{ fontFamily: "'Tajawal', sans-serif" }}>
          مدرسة الإبداع العلمي الدولية - مويلح | قسم اللغة العربية للناطقين بغيرها
        </p>
      </footer>
    </div>
  );
}
