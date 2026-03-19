import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Lock, MessageCircle } from "lucide-react";

interface TeacherLoginProps {
  onLogin: (username: string) => void;
}

export default function TeacherLogin({ onLogin }: TeacherLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("يرجى إدخال اسم المستخدم وكلمة المرور");
      return;
    }

    // Simple validation - check against localStorage stored credentials
    const storedUsers = JSON.parse(localStorage.getItem("teacherUsers") || "{}");
    
    if (storedUsers[username] && storedUsers[username] === password) {
      localStorage.setItem("teacherLoggedIn", "true");
      localStorage.setItem("teacherName", username);
      onLogin(username);
    } else if (username === "Ayaali" && password === "aya1234") {
      // Owner login
      localStorage.setItem("teacherLoggedIn", "true");
      localStorage.setItem("teacherName", username);
      localStorage.setItem("isOwner", "true");
      onLogin(username);
    } else {
      setError("بيانات الدخول غير صحيحة | Invalid credentials");
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-[#1a6b3c] via-[#1e7a44] to-[#1b5e8a] flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-[#1a6b3c] to-[#1b5e8a] px-6 py-8 text-center text-white">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "'Tajawal', sans-serif" }}>
              تسجيل الدخول
            </h1>
            <p className="text-white/70 text-sm mt-1">Login to access the platform</p>
          </div>

          {/* Form */}
          <div className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                  اسم المستخدم
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="أدخل اسم المستخدم"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1a6b3c] transition-colors text-right"
                  style={{ fontFamily: "'Tajawal', sans-serif" }}
                  required
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1a6b3c] transition-colors text-right"
                  style={{ fontFamily: "'Tajawal', sans-serif" }}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#1a6b3c] to-[#1b5e8a] hover:from-[#155a32] hover:to-[#164d73] text-white font-semibold py-3 rounded-xl text-base"
                style={{ fontFamily: "'Tajawal', sans-serif" }}
              >
                دخول
              </Button>
            </form>

            {/* WhatsApp Section */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600 mb-4" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                للحصول على بيانات الدخول، تواصل معنا عبر الواتساب
              </p>
              <div className="flex flex-col items-center gap-3">
                {/* WhatsApp QR Code */}
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310419663029980891/S9UfAnxEfs6upsP98hCzwU/whatsapp_qr_cb063965.png"
                  alt="WhatsApp QR Code"
                  className="w-36 h-36 rounded-xl border-2 border-green-200 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => window.open('https://wa.me/201120500602?text=مرحباً، أريد الحصول على بيانات الدخول لمنصة رحلة نوّار', '_blank')}
                />
                <p className="text-xs text-gray-400 text-center" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                  امسح الكود بكاميرتك أو اضغط عليه
                </p>
                {/* Direct WhatsApp Link */}
                <button
                  type="button"
                  onClick={() => window.open('https://wa.me/201120500602?text=مرحباً، أريد الحصول على بيانات الدخول لمنصة رحلة نوّار', '_blank')}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  style={{ fontFamily: "'Tajawal', sans-serif" }}
                >
                  <MessageCircle size={18} />
                  تواصل عبر الواتساب
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
