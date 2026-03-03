/*
 * Ishara Quiz Page - Embeds the أسماء الإشارة quiz game
 * The quiz is a complete standalone HTML app embedded via iframe
 */
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

const QUIZ_URL = "/quiz_ishara.html";

export default function IsharaQuiz() {
  return (
    <div dir="rtl" className="min-h-screen flex flex-col bg-[#f3f7f5]">
      {/* Minimal header with back button */}
      <header className="bg-gradient-to-br from-[#1a6b3c] via-[#1e7a44] to-[#1b5e8a] text-white py-3 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/games">
            <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm">
              <ArrowRight size={18} />
              <span style={{ fontFamily: "'Tajawal', sans-serif" }}>الألعاب التعليمية</span>
            </button>
          </Link>
          <h1
            className="text-lg font-bold"
            style={{ fontFamily: "'Tajawal', sans-serif" }}
          >
            🔤 أَسْمَاءُ الْإِشَارَةِ
          </h1>
        </div>
      </header>

      {/* Quiz iframe - full width and height */}
      <main className="flex-1 flex flex-col">
        <iframe
          src={QUIZ_URL}
          className="flex-1 w-full border-0"
          style={{ minHeight: "calc(100vh - 56px)" }}
          title="اختبار أسماء الإشارة"
          allow="autoplay"
        />
      </main>
    </div>
  );
}
