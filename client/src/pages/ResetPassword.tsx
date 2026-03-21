import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function ResetPassword() {
  const [location] = useLocation();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (t) setToken(t);
    else setError("رابط إعادة التعيين غير صالح أو منتهي الصلاحية.");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password || password.length < 6) {
      setError("يجب أن تكون كلمة المرور 6 أحرف على الأقل");
      return;
    }
    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/teacher/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || "حدث خطأ، يرجى المحاولة مجدداً");
      }
    } catch {
      setError("تعذّر الاتصال بالخادم، يرجى المحاولة لاحقاً");
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    if (!password) return null;
    if (password.length < 6) return { label: "ضعيفة جداً", color: "bg-red-400", width: "w-1/4" };
    if (password.length < 8) return { label: "مقبولة", color: "bg-amber-400", width: "w-2/4" };
    if (password.length < 12) return { label: "جيدة", color: "bg-blue-500", width: "w-3/4" };
    return { label: "قوية", color: "bg-green-500", width: "w-full" };
  };

  const strength = passwordStrength();

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #0f3d2e 0%, #1a6b3c 50%, #1b5e8a 100%)" }}
      dir="rtl"
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310419663029980891/S9UfAnxEfs6upsP98hCzwU/nawwar-logo-AWuZdjrAyTDDSJocatLxwi.png"
            alt="Nawwar Journey"
            className="w-16 h-16 rounded-2xl mx-auto mb-3 shadow-lg"
          />
          <h1 className="text-white text-xl font-bold">رحلة نوّار</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-l from-green-900 to-green-700 px-6 py-5 text-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-white text-lg font-bold">إعادة تعيين كلمة المرور</h2>
            <p className="text-green-200 text-sm mt-1">أنشئ كلمة مرور جديدة لحسابك</p>
          </div>

          <div className="p-6">
            {success ? (
              /* Success State */
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-9 h-9 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">تم تغيير كلمة المرور!</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  تم تحديث كلمة مرورك بنجاح. يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.
                </p>
                <Link href="/teacher-login">
                  <Button className="w-full" style={{ background: "linear-gradient(135deg, #1a6b3c, #1b5e8a)" }}>
                    تسجيل الدخول الآن
                  </Button>
                </Link>
              </div>
            ) : error && !token ? (
              /* Invalid Token State */
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-9 h-9 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">رابط غير صالح</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  هذا الرابط غير صالح أو انتهت صلاحيته. يرجى طلب رابط جديد.
                </p>
                <Link href="/forgot-password">
                  <Button className="w-full" style={{ background: "linear-gradient(135deg, #1b5e8a, #1a3a6b)" }}>
                    طلب رابط جديد
                  </Button>
                </Link>
              </div>
            ) : (
              /* Form State */
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-gray-600 text-sm leading-relaxed mb-2">
                  أدخل كلمة المرور الجديدة لحسابك. تأكد من أنها قوية وسهلة الحفظ.
                </p>

                {/* New Password */}
                <div className="space-y-1">
                  <Label htmlFor="password" className="text-gray-700 font-medium text-sm">
                    كلمة المرور الجديدة
                  </Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="6 أحرف على الأقل"
                      className="pr-9 pl-9"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Strength Indicator */}
                  {strength && (
                    <div className="mt-1">
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${strength.color} ${strength.width}`} />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">قوة كلمة المرور: <span className="font-medium">{strength.label}</span></p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <Label htmlFor="confirm" className="text-gray-700 font-medium text-sm">
                    تأكيد كلمة المرور
                  </Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="confirm"
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="أعد إدخال كلمة المرور"
                      className="pr-9 pl-9"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">كلمتا المرور غير متطابقتين</p>
                  )}
                  {confirmPassword && password === confirmPassword && password.length >= 6 && (
                    <p className="text-xs text-green-600 mt-1">✓ كلمتا المرور متطابقتان</p>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 font-bold text-base"
                  style={{ background: "linear-gradient(135deg, #1a6b3c, #1b5e8a)" }}
                  disabled={loading || !token}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin ml-2" />
                      جارٍ الحفظ...
                    </>
                  ) : (
                    "حفظ كلمة المرور الجديدة"
                  )}
                </Button>

                <div className="text-center pt-1">
                  <Link href="/teacher-login">
                    <span className="text-sm text-blue-700 hover:underline cursor-pointer">
                      ← العودة لتسجيل الدخول
                    </span>
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
