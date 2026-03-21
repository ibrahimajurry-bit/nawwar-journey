import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Lock, MessageCircle, UserPlus, Mail, User, PartyPopper, Sparkles, Gamepad2, QrCode, BookOpen } from "lucide-react";

interface TeacherLoginProps {
  onLogin: (username: string) => void;
}

type Mode = "login" | "register";
type LoginTab = "username" | "email";

export default function TeacherLogin({ onLogin }: TeacherLoginProps) {
  const [mode, setMode] = useState<Mode>("login");
  const [loginTab, setLoginTab] = useState<LoginTab>("username");

  // Username login state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Email login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Registration state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regWhatsapp, setRegWhatsapp] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPassword2, setRegPassword2] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeName, setWelcomeName] = useState("");

  // Hardcoded accounts (owner + pre-assigned teachers)
  const hardcodedAccounts: Record<string, { password: string; role: "owner" | "teacher" }> = {
    "admin2009": { password: "admin2009", role: "owner" },
    "Ayaali": { password: "aya1234", role: "teacher" },
    "Ayaali123": { password: "Ayaali123", role: "teacher" },
    "Ahmed123": { password: "Ahmed123", role: "teacher" },
    "dr.asem": { password: "asem2025", role: "teacher" },
    "prof.ahmed": { password: "ahmed2025", role: "teacher" },
    "prof.iman": { password: "iman2025", role: "teacher" },
    "prof.jumana": { password: "jumana2025", role: "teacher" },
  };

  const handleUsernameLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("يرجى إدخال اسم المستخدم وكلمة المرور");
      return;
    }
    const account = hardcodedAccounts[username];
    if (account && account.password === password) {
      localStorage.setItem("teacherLoggedIn", "true");
      localStorage.setItem("teacherName", username);
      if (account.role === "owner") {
        localStorage.setItem("isOwner", "true");
      }
      onLogin(username);
    } else {
      setError("بيانات الدخول غير صحيحة | Invalid credentials");
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setError("يرجى إدخال الإيميل وكلمة المرور");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/teacher/login-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail.trim(), password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "بيانات الدخول غير صحيحة");
      } else {
        localStorage.setItem("teacherLoggedIn", "true");
        localStorage.setItem("teacherName", data.name);
        onLogin(data.name);
      }
    } catch {
      setError("حدث خطأ في الاتصال، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    if (!regName.trim() || !regEmail.trim() || !regWhatsapp.trim() || !regPassword || !regPassword2) {
      setError("يرجى ملء جميع الحقول");
      return;
    }
    if (regPassword !== regPassword2) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }
    if (regPassword.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/teacher/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName.trim(),
          email: regEmail.trim(),
          whatsapp: regWhatsapp.trim(),
          password: regPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          setError("هذا الإيميل مسجل مسبقاً | Email already registered");
        } else {
          setError(data.error || "حدث خطأ في التسجيل");
        }
      } else {
        // Show welcome screen before auto-login
        setWelcomeName(data.name);
        setShowWelcome(true);
        localStorage.setItem("teacherLoggedIn", "true");
        localStorage.setItem("teacherName", data.name);
      }
    } catch {
      setError("حدث خطأ في الاتصال، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  // Welcome screen after successful registration
  if (showWelcome) {
    return (
      <div dir="rtl" className="min-h-screen bg-gradient-to-br from-[#1a6b3c] via-[#1e7a44] to-[#1b5e8a] flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
        </div>
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Celebration Header */}
            <div className="bg-gradient-to-br from-[#1a6b3c] to-[#1b5e8a] px-6 py-8 text-center text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-4 right-8 w-16 h-16 rounded-full bg-yellow-300/40 blur-2xl" />
                <div className="absolute bottom-4 left-8 w-20 h-20 rounded-full bg-green-300/30 blur-2xl" />
              </div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
                  <PartyPopper className="w-8 h-8 text-yellow-300" />
                </div>
                <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                  أهلاً وسهلاً {welcomeName}! 🎉
                </h1>
                <p className="text-white/80 text-sm" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                  تم إنشاء حسابك بنجاح في رحلة نوّار
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="p-6">
              <p className="text-gray-600 text-sm text-center mb-5" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                يمكنك الآن استخدام جميع أدوات المنصة:
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 border border-purple-100">
                  <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0">
                    <Sparkles size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm" style={{ fontFamily: "'Tajawal', sans-serif" }}>منشئ الألعاب التعليمية</p>
                    <p className="text-gray-400 text-xs">أنشئ ألعاب تفاعلية بالذكاء الاصطناعي</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-100">
                  <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center flex-shrink-0">
                    <QrCode size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm" style={{ fontFamily: "'Tajawal', sans-serif" }}>مولّد أكواد QR</p>
                    <p className="text-gray-400 text-xs">أنشئ أكواد QR مخصصة لدروسك</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 border border-orange-100">
                  <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <Gamepad2 size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm" style={{ fontFamily: "'Tajawal', sans-serif" }}>مكتبة الألعاب</p>
                    <p className="text-gray-400 text-xs">تصفّح وشارك ألعابك التعليمية</p>
                  </div>
                </div>
              </div>

              <p className="text-center text-xs text-gray-400 mb-4" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                📧 تم إرسال رسالة ترحيبية إلى بريدك الإلكتروني
              </p>

              <Button
                onClick={() => onLogin(welcomeName)}
                className="w-full bg-gradient-to-r from-[#1a6b3c] to-[#1b5e8a] text-white font-semibold py-3 rounded-xl text-base"
                style={{ fontFamily: "'Tajawal', sans-serif" }}
              >
                ابدأ الاستكشاف →
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen flex" style={{ background: 'oklch(0.985 0.005 80)' }}>
      {/* Left decorative panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-96 flex-shrink-0 relative overflow-hidden p-10"
        style={{ background: 'linear-gradient(160deg, #0f4a2a 0%, #1a6b3c 45%, #1b4e7a 100%)' }}
      >
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #4ade80 0%, transparent 70%)' }} />
        <div className="absolute bottom-20 left-5 w-48 h-48 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #60a5fa 0%, transparent 70%)' }} />
        <div className="relative z-10">
          <img src="https://d2xsxph8kpxj0f.cloudfront.net/310419663029980891/S9UfAnxEfs6upsP98hCzwU/nawwar-logo-AWuZdjrAyTDDSJocatLxwi.png" alt="Nawwar Logo" className="w-16 h-16 rounded-2xl mb-8" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }} />
          <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Tajawal', sans-serif", lineHeight: 1.3 }}>رحلة نوّار</h2>
          <p className="text-white/60 text-sm mb-10" style={{ fontFamily: "'Tajawal', sans-serif" }}>منصة تعليمية للمعلمين المبدعين</p>
          <div className="space-y-4">
            {[
              { label: 'منشئ الألعاب التعليمية بالذكاء الاصطناعي' },
              { label: 'مولّد أكواد QR مخصصة للدروس' },
              { label: 'مكتبة ألعاب تفاعلية قابلة للمشاركة' },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-green-400 text-xs mt-1 flex-shrink-0">✦</span>
                <span className="text-white/75 text-sm" style={{ fontFamily: "'Tajawal', sans-serif" }}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-white/30 text-xs" style={{ fontFamily: "'Tajawal', sans-serif" }}>© 2025 Nawwar Journey</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-sm" dir="rtl">
          <div className="flex justify-center mb-8 lg:hidden">
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310419663029980891/S9UfAnxEfs6upsP98hCzwU/nawwar-logo-AWuZdjrAyTDDSJocatLxwi.png" alt="Nawwar Logo" className="w-16 h-16 rounded-2xl" style={{ boxShadow: '0 4px 20px rgba(26,107,60,0.25)' }} />
          </div>
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: "'Tajawal', sans-serif" }}>{mode === "register" ? "إنشاء حساب جديد" : "مرحباً بعودتك"}</h1>
            <p className="text-sm text-gray-400" style={{ fontFamily: "'Tajawal', sans-serif" }}>{mode === "register" ? "أنشئ حسابك للوصول إلى منصة رحلة نوّار" : "سجّل دخولك للمتابعة"}</p>
          </div>
          <div className="flex gap-1 p-1 rounded-xl mb-6" style={{ background: 'oklch(0.94 0.005 260)' }}>
            <button onClick={() => { setMode("login"); setError(""); setSuccessMsg(""); }} className="flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all" style={mode === "login" ? { background: 'white', color: '#1a6b3c', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', fontFamily: "'Tajawal', sans-serif" } : { color: '#6b7280', fontFamily: "'Tajawal', sans-serif" }}>تسجيل الدخول</button>
            <button onClick={() => { setMode("register"); setError(""); setSuccessMsg(""); }} className="flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all" style={mode === "register" ? { background: 'white', color: '#1a6b3c', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', fontFamily: "'Tajawal', sans-serif" } : { color: '#6b7280', fontFamily: "'Tajawal', sans-serif" }}>حساب جديد</button>
          </div>
          {error && (<div className="rounded-xl px-4 py-3 mb-5 text-sm text-center" style={{ background: 'oklch(0.97 0.02 25)', color: 'oklch(0.5 0.18 25)', border: '1px solid oklch(0.9 0.06 25)', fontFamily: "'Tajawal', sans-serif" }}>{error}</div>)}
          {successMsg && (<div className="rounded-xl px-4 py-3 mb-5 text-sm text-center" style={{ background: 'oklch(0.97 0.03 155)', color: 'oklch(0.35 0.12 155)', border: '1px solid oklch(0.88 0.06 155)', fontFamily: "'Tajawal', sans-serif" }}>{successMsg}</div>)}

          {mode === "login" && (
            <>
              <div className="flex gap-2 mb-5">
                <button onClick={() => { setLoginTab("username"); setError(""); }} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all" style={loginTab === "username" ? { background: 'linear-gradient(135deg, #1a6b3c, #1b4e7a)', color: 'white', fontFamily: "'Tajawal', sans-serif", boxShadow: '0 4px 12px rgba(26,107,60,0.3)' } : { background: 'oklch(0.94 0.005 260)', color: '#6b7280', fontFamily: "'Tajawal', sans-serif" }}>
                  <User size={14} />اسم المستخدم
                </button>
                <button onClick={() => { setLoginTab("email"); setError(""); }} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all" style={loginTab === "email" ? { background: 'linear-gradient(135deg, #1a6b3c, #1b4e7a)', color: 'white', fontFamily: "'Tajawal', sans-serif", boxShadow: '0 4px 12px rgba(26,107,60,0.3)' } : { background: 'oklch(0.94 0.005 260)', color: '#6b7280', fontFamily: "'Tajawal', sans-serif" }}>
                  <Mail size={14} />الإيميل
                </button>
              </div>
              {loginTab === "username" && (
                <form onSubmit={handleUsernameLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Tajawal', sans-serif" }}>اسم المستخدم</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="أدخل اسم المستخدم" className="input-premium" style={{ fontFamily: "'Tajawal', sans-serif" }} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Tajawal', sans-serif" }}>كلمة المرور</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="أدخل كلمة المرور" className="input-premium" style={{ fontFamily: "'Tajawal', sans-serif" }} />
                  </div>
                  <button type="submit" className="btn-primary w-full py-3" style={{ fontFamily: "'Tajawal', sans-serif" }}>دخول</button>
                </form>
              )}
              {loginTab === "email" && (
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Tajawal', sans-serif" }}>البريد الإلكتروني</label>
                    <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="example@email.com" className="input-premium text-left" dir="ltr" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Tajawal', sans-serif" }}>كلمة المرور</label>
                    <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="أدخل كلمة المرور" className="input-premium" style={{ fontFamily: "'Tajawal', sans-serif" }} />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full py-3" style={{ fontFamily: "'Tajawal', sans-serif" }}>{loading ? "جاري الدخول..." : "دخول"}</button>
                  <div className="text-center pt-1">
                    <a href="/forgot-password" className="text-sm font-medium" style={{ color: '#1a6b3c', fontFamily: "'Tajawal', sans-serif" }}>نسيت كلمة المرور؟</a>
                  </div>
                </form>
              )}
            </>
          )}

          {mode === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Tajawal', sans-serif" }}>الاسم (بالإنجليزية) <span className="text-red-400">*</span></label>
                <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="Your Name in English" className="input-premium text-left" dir="ltr" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Tajawal', sans-serif" }}>البريد الإلكتروني <span className="text-red-400">*</span></label>
                <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="example@email.com" className="input-premium text-left" dir="ltr" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Tajawal', sans-serif" }}>رقم الواتساب <span className="text-red-400">*</span></label>
                <input type="tel" value={regWhatsapp} onChange={(e) => setRegWhatsapp(e.target.value)} placeholder="+966XXXXXXXXX" className="input-premium text-left" dir="ltr" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Tajawal', sans-serif" }}>كلمة المرور <span className="text-red-400">*</span></label>
                <input type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} placeholder="6 أحرف على الأقل" className="input-premium" style={{ fontFamily: "'Tajawal', sans-serif" }} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Tajawal', sans-serif" }}>تأكيد كلمة المرور <span className="text-red-400">*</span></label>
                <input type="password" value={regPassword2} onChange={(e) => setRegPassword2(e.target.value)} placeholder="أعد كتابة كلمة المرور" className="input-premium" style={{ fontFamily: "'Tajawal', sans-serif" }} />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3" style={{ fontFamily: "'Tajawal', sans-serif" }}>{loading ? "جاري التسجيل..." : "إنشاء الحساب"}</button>
            </form>
          )}

          {mode === "login" && (
            <div className="mt-8 pt-6" style={{ borderTop: '1px solid oklch(0.91 0.01 260)' }}>
              <p className="text-center text-xs text-gray-400 mb-4" style={{ fontFamily: "'Tajawal', sans-serif" }}>للحصول على بيانات دخول مخصصة، تواصل معنا</p>
              <div className="flex flex-col items-center gap-3">
                <img src="https://d2xsxph8kpxj0f.cloudfront.net/310419663029980891/S9UfAnxEfs6upsP98hCzwU/whatsapp_qr_cb063965.png" alt="WhatsApp QR Code" className="w-24 h-24 rounded-xl cursor-pointer hover:opacity-80 transition-opacity" style={{ border: '1.5px solid oklch(0.88 0.08 155)' }} onClick={() => window.open('https://wa.me/201120500602?text=مرحباً، أريد الحصول على بيانات الدخول لمنصة رحلة نوّار', '_blank')} />
                <button type="button" onClick={() => window.open('https://wa.me/201120500602?text=مرحباً، أريد الحصول على بيانات الدخول لمنصة رحلة نوّار', '_blank')} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all" style={{ background: '#22c55e', color: 'white', fontFamily: "'Tajawal', sans-serif", boxShadow: '0 4px 12px rgba(34,197,94,0.3)' }}>
                  <MessageCircle size={16} />تواصل عبر الواتساب
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}