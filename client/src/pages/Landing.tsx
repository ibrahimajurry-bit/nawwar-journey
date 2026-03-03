/*
 * Landing Page - Main portal with 3 category icons
 * Design: Clean, school-branded, 3 large icons linking to sub-pages
 */
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Wrench, Gamepad2, BookImage } from "lucide-react";

const SCHOOL_LOGO = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029980891/VGalWSshoNNhMYmE.png";

const categories = [
  {
    id: "apps",
    title: "تطبيقات قسم ASL",
    subtitle: "ASL Applications",
    icon: Wrench,
    href: "/apps",
    gradient: "from-[#1a6b3c] via-[#1e7a44] to-[#228B52]",
    hoverBorder: "hover:border-green-300",
    iconBg: "bg-white/20",
  },
  {
    id: "games",
    title: "ألعاب تعليمية",
    subtitle: "Educational Games",
    icon: Gamepad2,
    href: "/games",
    gradient: "from-orange-500 via-orange-400 to-amber-500",
    hoverBorder: "hover:border-orange-300",
    iconBg: "bg-white/20",
  },
  {
    id: "stories",
    title: "قصص مصورة",
    subtitle: "Illustrated Stories",
    icon: BookImage,
    href: "/stories",
    gradient: "from-[#1b5e8a] via-[#2980b9] to-[#3498db]",
    hoverBorder: "hover:border-blue-300",
    iconBg: "bg-white/20",
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
  return (
    <div dir="rtl" className="min-h-screen flex flex-col bg-gradient-to-b from-[#f0f7f0] via-white to-[#f0f4f8]">
      {/* Hero Header */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[#1a6b3c] via-[#1e7a44] to-[#1b5e8a] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-10 left-20 w-60 h-60 rounded-full bg-white/15 blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 py-8 flex flex-col items-center gap-3">
          <motion.img
            src={SCHOOL_LOGO}
            alt="School Logo"
            className="h-20 w-auto drop-shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
          <motion.h1
            className="text-2xl md:text-3xl font-bold text-center"
            style={{ fontFamily: "'Tajawal', sans-serif" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            مدرسة الإبداع العلمي الدولية - مويلح
          </motion.h1>
          <motion.p
            className="text-base text-white/80 text-center"
            style={{ fontFamily: "'Tajawal', sans-serif" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            قسم اللغة العربية للناطقين بغيرها - ASL
          </motion.p>
        </div>
      </header>

      {/* Main Content - 3 Category Icons */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-3xl w-full"
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
                      <p
                        className="text-xs text-gray-400 mt-1"
                      >
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
          مدرسة الإبداع العلمي الدولية - مويلح | قسم اللغة العربية للناطقين بغيرها
        </p>
      </footer>
    </div>
  );
}
