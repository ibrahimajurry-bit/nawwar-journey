/**
 * Landing Page - Nawwar Journey educational platform
 * Premium redesign: asymmetric layout, refined typography, editorial feel
 */
import { Link } from "wouter";
import { motion } from "framer-motion";
import { QrCode, Gamepad2, LogOut, Wand2, Settings, MessageCircle, Send, ArrowLeft } from "lucide-react";
import { useState } from "react";

const categories = [
  {
    id: "quiz-generator",
    title: "منشئ الألعاب التعليمية",
    subtitle: "AI Quiz Generator",
    description: "أنشئ ألعاباً تفاعلية بالذكاء الاصطناعي في ثوانٍ",
    icon: Wand2,
    href: "/apps/quiz-generator",
    accent: "#7c3aed",
    bg: "oklch(0.97 0.02 290)",
    border: "oklch(0.88 0.06 290)",
  },
  {
    id: "qr",
    title: "مولّد أكواد QR",
    subtitle: "QR Code Generator",
    description: "أنشئ أكواد QR مخصصة لدروسك ومحتواك",
    icon: QrCode,
    href: "/apps/qr-generator",
    accent: "#1a6b3c",
    bg: "oklch(0.97 0.02 155)",
    border: "oklch(0.88 0.06 155)",
  },
  {
    id: "games",
    title: "الألعاب التعليمية",
    subtitle: "Educational Games",
    description: "تصفّح مكتبة ألعابك وشاركها مع طلابك",
    icon: Gamepad2,
    href: "/games",
    accent: "#ea580c",
    bg: "oklch(0.97 0.03 55)",
    border: "oklch(0.88 0.07 55)",
  },
];

export default function Landing() {
  const teacherName = localStorage.getItem("teacherName") || "";
  const [contactName, setContactName] = useState(teacherName);
  const [contactEmail, setContactEmail] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [contactSent, setContactSent] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactMsg.trim()) return;
    setContactLoading(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: contactName, email: contactEmail, message: contactMsg }),
      });
      setContactSent(true);
      setContactMsg("");
    } catch {
      setContactSent(true);
    } finally {
      setContactLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("teacherLoggedIn");
    localStorage.removeItem("teacherName");
    localStorage.removeItem("isOwner");
    window.location.reload();
  };

  return (
    <div dir="rtl" className="min-h-screen flex flex-col" style={{ background: 'oklch(0.985 0.004 80)', fontFamily: "'Tajawal', sans-serif" }}>

      {/* ── Top Nav ── */}
      <nav className="sticky top-0 z-50 border-b" style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', borderColor: 'oklch(0.92 0.01 260)' }}>
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310419663029980891/S9UfAnxEfs6upsP98hCzwU/nawwar-logo-AWuZdjrAyTDDSJocatLxwi.png"
              alt="Nawwar Logo"
              className="w-8 h-8 rounded-lg"
            />
            <span className="font-bold text-gray-900 text-sm tracking-tight">Nawwar Journey</span>
          </div>
          <div className="flex items-center gap-2">
            {teacherName === "admin2009" && (
              <Link href="/admin">
                <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all" style={{ background: 'oklch(0.94 0.02 155)', color: '#1a6b3c' }}>
                  <Settings size={13} />
                  لوحة التحكم
                </button>
              </Link>
            )}
            {teacherName && (
              <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all text-gray-500 hover:text-gray-800" style={{ background: 'oklch(0.94 0.005 260)' }}>
                <LogOut size={13} />
                خروج
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <header className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #0f4a2a 0%, #1a6b3c 50%, #1b4e7a 100%)' }}>
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-60px] right-[-60px] w-80 h-80 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #4ade80, transparent 70%)' }} />
          <div className="absolute bottom-[-40px] left-[-40px] w-64 h-64 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #60a5fa, transparent 70%)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, white, transparent 70%)' }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-5 py-14 md:py-20 flex flex-col md:flex-row items-center gap-8 md:gap-16">
          {/* Text side */}
          <motion.div className="flex-1 text-center md:text-right" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            {teacherName && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-5" style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                مرحباً، {teacherName}
              </div>
            )}
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
              منصة رحلة نوّار
              <span className="block text-lg md:text-2xl font-medium mt-2" style={{ color: 'rgba(255,255,255,0.65)' }}>Nawwar Journey Platform</span>
            </h1>
            <p className="text-white/60 text-sm md:text-base max-w-md mx-auto md:mx-0">
              أدوات تعليمية ذكية تساعدك على إنشاء تجارب تفاعلية ممتعة لطلابك
            </p>
          </motion.div>

          {/* Logo side */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }}>
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl blur-2xl opacity-40" style={{ background: 'linear-gradient(135deg, #4ade80, #60a5fa)' }} />
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310419663029980891/S9UfAnxEfs6upsP98hCzwU/nawwar-logo-AWuZdjrAyTDDSJocatLxwi.png"
                alt="Nawwar Logo"
                className="relative w-28 h-28 md:w-36 md:h-36 rounded-3xl"
                style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}
              />
            </div>
          </motion.div>
        </div>
      </header>

      {/* ── Tools Grid ── */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-5 py-12">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">أدوات المنصة</h2>
          <p className="text-sm text-gray-400">اختر الأداة التي تريد استخدامها</p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          initial="hidden"
          animate="visible"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } } }}
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <motion.div key={cat.id} variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
                <Link href={cat.href}>
                  <div
                    className="group cursor-pointer h-full flex flex-col p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                    style={{ background: 'white', border: `1.5px solid ${cat.border}`, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px ${cat.border}`; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; }}
                  >
                    <div className="flex items-start justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: cat.bg }}>
                        <Icon size={22} style={{ color: cat.accent }} />
                      </div>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: cat.bg }}>
                        <ArrowLeft size={14} style={{ color: cat.accent }} />
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">{cat.title}</h3>
                    <p className="text-xs font-medium mb-2" style={{ color: cat.accent }}>{cat.subtitle}</p>
                    <p className="text-xs text-gray-400 leading-relaxed mt-auto">{cat.description}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </main>

      {/* ── Contact Section ── */}
      <section className="max-w-5xl mx-auto w-full px-5 pb-16" dir="rtl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start p-8 rounded-2xl" style={{ background: 'white', border: '1.5px solid oklch(0.91 0.01 260)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
          {/* Left: info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'oklch(0.97 0.02 155)' }}>
                <MessageCircle size={18} style={{ color: '#1a6b3c' }} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">تواصل معنا</h3>
                <p className="text-xs text-gray-400">استفسارات، شكاوى، واقتراحات</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              نحن هنا لمساعدتك في أي وقت. يمكنك إرسال رسالتك عبر النموذج أو التواصل معنا مباشرةً عبر الواتساب.
            </p>
            <a
              href="https://wa.me/201120500602?text=مرحباً، أريد الاستفسار عن منصة رحلة نوّار"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white transition-all"
              style={{ background: '#22c55e', boxShadow: '0 4px 16px rgba(34,197,94,0.3)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              واتساب مباشر
            </a>
          </div>

          {/* Right: form */}
          <div>
            {contactSent ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'oklch(0.97 0.03 155)' }}>
                  <span className="text-2xl">✓</span>
                </div>
                <p className="font-bold text-gray-900 text-lg mb-1">تم إرسال رسالتك!</p>
                <p className="text-sm text-gray-400 mb-4">سنتواصل معك قريباً</p>
                <button onClick={() => setContactSent(false)} className="text-sm font-medium" style={{ color: '#1a6b3c' }}>إرسال رسالة أخرى</button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">الاسم</label>
                  <input type="text" value={contactName} onChange={e => setContactName(e.target.value)} required placeholder="اسمك" className="input-premium" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">الإيميل <span className="text-gray-400 font-normal text-xs">(اختياري)</span></label>
                  <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="example@email.com" className="input-premium text-left" dir="ltr" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">الرسالة</label>
                  <textarea value={contactMsg} onChange={e => setContactMsg(e.target.value)} required rows={3} placeholder="اكتب رسالتك هنا..." className="input-premium resize-none" />
                </div>
                <button type="submit" disabled={contactLoading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                  <Send size={15} />
                  {contactLoading ? "جاري الإرسال..." : "إرسال الرسالة"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t py-6" style={{ borderColor: 'oklch(0.91 0.01 260)' }}>
        <div className="max-w-5xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310419663029980891/S9UfAnxEfs6upsP98hCzwU/nawwar-logo-AWuZdjrAyTDDSJocatLxwi.png" alt="Logo" className="w-6 h-6 rounded-md" />
            <span className="text-sm font-semibold text-gray-600">Nawwar Journey</span>
          </div>
          <p className="text-xs text-gray-400">© 2025 منصة رحلة نوّار — جميع الحقوق محفوظة</p>
          <a href="https://wa.me/201120500602" target="_blank" rel="noopener noreferrer" className="text-xs font-medium" style={{ color: '#22c55e' }}>تواصل معنا</a>
        </div>
      </footer>
    </div>
  );
}
