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
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-[#1a6b3c] via-[#1e7a44] to-[#1b5e8a] flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310419663029980891/S9UfAnxEfs6upsP98hCzwU/nawwar-logo-AWuZdjrAyTDDSJocatLxwi.png"
            alt="Nawar Logo"
            className="w-20 h-20 rounded-2xl shadow-lg"
          />
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-[#1a6b3c] to-[#1b5e8a] px-6 py-6 text-center text-white">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mb-3">
              {mode === "register" ? <UserPlus className="w-6 h-6 text-white" /> : <Lock className="w-6 h-6 text-white" />}
            </div>
            <h1 className="text-xl font-bold" style={{ fontFamily: "'Tajawal', sans-serif" }}>
              {mode === "register" ? "إنشاء حساب جديد" : "تسجيل الدخول"}
            </h1>
            <p className="text-white/70 text-xs mt-1">
              {mode === "register" ? "Create a new teacher account" : "Nawwar Journey Platform"}
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => { setMode("login"); setError(""); setSuccessMsg(""); }}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${mode === "login" ? "text-[#1a6b3c] border-b-2 border-[#1a6b3c]" : "text-gray-400 hover:text-gray-600"}`}
              style={{ fontFamily: "'Tajawal', sans-serif" }}
            >
              تسجيل الدخول
            </button>
            <button
              onClick={() => { setMode("register"); setError(""); setSuccessMsg(""); }}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${mode === "register" ? "text-[#1a6b3c] border-b-2 border-[#1a6b3c]" : "text-gray-400 hover:text-gray-600"}`}
              style={{ fontFamily: "'Tajawal', sans-serif" }}
            >
              حساب جديد
            </button>
          </div>

          <div className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm text-center" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                {error}
              </div>
            )}
            {successMsg && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 text-sm text-center" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                {successMsg}
              </div>
            )}

            {/* LOGIN MODE */}
            {mode === "login" && (
              <>
                {/* Login Tab Switcher */}
                <div className="flex gap-2 mb-5">
                  <button
                    onClick={() => { setLoginTab("username"); setError(""); }}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium transition-all ${loginTab === "username" ? "bg-[#1a6b3c] text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                    style={{ fontFamily: "'Tajawal', sans-serif" }}
                  >
                    <User size={14} />
                    اسم المستخدم
                  </button>
                  <button
                    onClick={() => { setLoginTab("email"); setError(""); }}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium transition-all ${loginTab === "email" ? "bg-[#1a6b3c] text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                    style={{ fontFamily: "'Tajawal', sans-serif" }}
                  >
                    <Mail size={14} />
                    الإيميل
                  </button>
                </div>

                {/* Username Login */}
                {loginTab === "username" && (
                  <form onSubmit={handleUsernameLogin} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                        اسم المستخدم
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="أدخل اسم المستخدم"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1a6b3c] transition-colors"
                        style={{ fontFamily: "'Tajawal', sans-serif" }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                        كلمة المرور
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="أدخل كلمة المرور"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1a6b3c] transition-colors"
                        style={{ fontFamily: "'Tajawal', sans-serif" }}
                      />
                    </div>
                    <Button type="submit" className="w-full bg-gradient-to-r from-[#1a6b3c] to-[#1b5e8a] text-white font-semibold py-3 rounded-xl text-base" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                      دخول
                    </Button>
                  </form>
                )}

                {/* Email Login */}
                {loginTab === "email" && (
                  <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                        البريد الإلكتروني
                      </label>
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="example@email.com"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1a6b3c] transition-colors text-left"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                        كلمة المرور
                      </label>
                      <input
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="أدخل كلمة المرور"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1a6b3c] transition-colors"
                        style={{ fontFamily: "'Tajawal', sans-serif" }}
                      />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-[#1a6b3c] to-[#1b5e8a] text-white font-semibold py-3 rounded-xl text-base" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                      {loading ? "جاري الدخول..." : "دخول"}
                    </Button>
                    <div className="text-center pt-1">
                      <a
                        href="/forgot-password"
                        className="text-sm text-blue-600 hover:underline"
                        style={{ fontFamily: "'Tajawal', sans-serif" }}
                      >
                        نسيت كلمة المرور؟
                      </a>
                    </div>
                  </form>
                )}
              </>
            )}

            {/* REGISTER MODE */}
            {mode === "register" && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                    الاسم (بالإنجليزية) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Your Name in English"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1a6b3c] transition-colors text-left"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                    البريد الإلكتروني <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1a6b3c] transition-colors text-left"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                    رقم الواتساب <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    value={regWhatsapp}
                    onChange={(e) => setRegWhatsapp(e.target.value)}
                    placeholder="+966XXXXXXXXX"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1a6b3c] transition-colors text-left"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                    كلمة المرور <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="6 أحرف على الأقل"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1a6b3c] transition-colors"
                    style={{ fontFamily: "'Tajawal', sans-serif" }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                    تأكيد كلمة المرور <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="password"
                    value={regPassword2}
                    onChange={(e) => setRegPassword2(e.target.value)}
                    placeholder="أعد كتابة كلمة المرور"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1a6b3c] transition-colors"
                    style={{ fontFamily: "'Tajawal', sans-serif" }}
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-[#1a6b3c] to-[#1b5e8a] text-white font-semibold py-3 rounded-xl text-base" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                  {loading ? "جاري التسجيل..." : "إنشاء الحساب"}
                </Button>
              </form>
            )}

            {/* WhatsApp Section - only in login mode */}
            {mode === "login" && (
              <div className="mt-5 pt-5 border-t border-gray-200">
                <p className="text-center text-xs text-gray-500 mb-3" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                  للحصول على بيانات دخول مخصصة، تواصل معنا
                </p>
                <div className="flex flex-col items-center gap-2">
                  <img
                    src="https://d2xsxph8kpxj0f.cloudfront.net/310419663029980891/S9UfAnxEfs6upsP98hCzwU/whatsapp_qr_cb063965.png"
                    alt="WhatsApp QR Code"
                    className="w-28 h-28 rounded-xl border-2 border-green-200 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => window.open('https://wa.me/201120500602?text=مرحباً، أريد الحصول على بيانات الدخول لمنصة رحلة نوّار', '_blank')}
                  />
                  <button
                    type="button"
                    onClick={() => window.open('https://wa.me/201120500602?text=مرحباً، أريد الحصول على بيانات الدخول لمنصة رحلة نوّار', '_blank')}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                    style={{ fontFamily: "'Tajawal', sans-serif" }}
                  >
                    <MessageCircle size={16} />
                    تواصل عبر الواتساب
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
