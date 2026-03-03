/*
 * Illustrated Stories Sub-page - Lists available illustrated stories
 * Currently: Coming Soon
 */
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, BookImage } from "lucide-react";

const SCHOOL_LOGO = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029980891/VGalWSshoNNhMYmE.png";

export default function StoriesPage() {
  return (
    <div dir="rtl" className="min-h-screen flex flex-col bg-gradient-to-b from-[#f0f7f0] via-white to-[#f0f4f8]">
      {/* Header */}
      <header className="bg-gradient-to-br from-[#1b5e8a] via-[#2980b9] to-[#3498db] text-white">
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
              <BookImage size={28} className="text-white" />
            </div>
            <h1
              className="text-2xl md:text-3xl font-bold"
              style={{ fontFamily: "'Tajawal', sans-serif" }}
            >
              قصص مصورة
            </h1>
            <p className="text-white/60 text-sm mt-1">Illustrated Stories</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 container mx-auto px-4 py-10 max-w-4xl flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-blue-50 mb-6">
            <BookImage size={48} className="text-[#1b5e8a] opacity-40" />
          </div>
          <h2
            className="text-2xl font-bold text-gray-700 mb-3"
            style={{ fontFamily: "'Tajawal', sans-serif" }}
          >
            قريبًا...
          </h2>
          <p
            className="text-gray-400 text-base max-w-md mx-auto"
            style={{ fontFamily: "'Tajawal', sans-serif" }}
          >
            نعمل على إضافة قصص مصورة تفاعلية قريبًا. ترقبوا!
          </p>
          <p className="text-gray-300 text-sm mt-2">Coming Soon</p>

          <Link href="/">
            <button
              className="mt-8 px-6 py-3 bg-[#1b5e8a] text-white rounded-xl font-medium hover:bg-[#164d73] transition-colors shadow-md"
              style={{ fontFamily: "'Tajawal', sans-serif" }}
            >
              العودة للرئيسية
            </button>
          </Link>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1b5e8a] text-white/70 py-4 text-center">
        <p className="text-sm" style={{ fontFamily: "'Tajawal', sans-serif" }}>
          مدرسة الإبداع العلمي الدولية - مويلح | قسم اللغة العربية للناطقين بغيرها
        </p>
      </footer>
    </div>
  );
}
