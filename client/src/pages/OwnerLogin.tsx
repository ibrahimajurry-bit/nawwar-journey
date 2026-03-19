import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lock, Zap, BookOpen, QrCode, Gamepad2 } from "lucide-react";

export default function OwnerLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (username === "Ayaali" && password === "aya1234") {
      localStorage.setItem("owner_auth", "true");
      setLocation("/");
    } else {
      setError("بيانات الدخول غير صحيحة | Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Features showcase */}
          <div className="text-white space-y-8">
            <div>
              <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Nawwar Journey
              </h1>
              <p className="text-3xl font-semibold text-blue-200">رحلة نوّار</p>
              <p className="text-sm text-blue-300 mt-2">
                منصة تعليمية متقدمة | Advanced Educational Platform
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Gamepad2 className="w-6 h-6 text-slate-900" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white">
                    ألعاب تعليمية | Educational Games
                  </h3>
                  <p className="text-sm text-blue-200">
                    ألعاب تفاعلية مصممة لتحسين المهارات التعليمية
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <QrCode className="w-6 h-6 text-slate-900" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white">
                    مولد QR متقدم | Advanced QR Generator
                  </h3>
                  <p className="text-sm text-blue-200">
                    إنشاء رموز QR احترافية مخصصة
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6 text-slate-900" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white">
                    قصص مصورة | Illustrated Stories
                  </h3>
                  <p className="text-sm text-blue-200">
                    محتوى غني بالصور والرسومات التعليمية
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-slate-900" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white">
                    تطبيقات ASL | ASL Applications
                  </h3>
                  <p className="text-sm text-blue-200">
                    تطبيقات لغة الإشارة الأمريكية المتقدمة
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp QR Code */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
              <p className="text-sm text-blue-200 mb-4 text-center font-semibold">
                للاشتراك | To Subscribe
              </p>
              <div className="flex justify-center mb-3">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310419663029980891/S9UfAnxEfs6upsP98hCzwU/whatsapp-qr_ac4b22f9.png"
                  alt="WhatsApp QR Code"
                  className="w-32 h-32 rounded-lg border-2 border-green-400"
                />
              </div>
              <p className="text-xs text-center text-blue-300">
                امسح الكود بكاميرتك | Scan with your camera
              </p>
            </div>
          </div>

          {/* Right side - Login form */}
          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md bg-white/95 backdrop-blur-md border-0 shadow-2xl">
              <div className="p-8">
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-4 rounded-full">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">
                  تسجيل الدخول
                </h2>
                <p className="text-center text-sm text-slate-600 mb-6">
                  Login
                </p>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      اسم المستخدم | Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="أدخل اسم المستخدم"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      كلمة المرور | Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="أدخل كلمة المرور"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-105"
                  >
                    دخول | Login
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-slate-200">
                  <p className="text-xs text-center text-slate-500">
                    منصة آمنة للمستخدمين المصرح لهم فقط
                  </p>
                  <p className="text-xs text-center text-slate-500 mt-1">
                    Secure platform for authorized users only
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
