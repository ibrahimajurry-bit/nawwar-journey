import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function QuizGeneratorApp() {
  const teacherName = localStorage.getItem("teacherName") || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9f2] to-[#e8f4fd]">
      {/* Back button + greeting */}
      <div className="p-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#1b6b2f] hover:text-[#0d3d1a] font-medium transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
          <span>العودة للصفحة الرئيسية</span>
        </Link>
        {teacherName && (
          <span className="text-sm text-gray-500" style={{ fontFamily: "'Tajawal', sans-serif" }}>
            مرحباً، {teacherName}
          </span>
        )}
      </div>

      {/* Iframe */}
      <iframe
        src="/quiz_generator.html"
        className="w-full border-0"
        style={{ height: "calc(100vh - 60px)" }}
        title="مولّد الألعاب التعليمية"
      />
    </div>
  );
}
