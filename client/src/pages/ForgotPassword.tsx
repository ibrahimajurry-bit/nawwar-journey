import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowRight, CheckCircle, Loader2 } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("يرجى إدخال البريد الإلكتروني");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/teacher/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
      } else {
        setError(data.error || "حدث خطأ، يرجى المحاولة مجدداً");
      }
    } catch {
      setError("تعذّر الاتصال بالخادم، يرجى المحاولة لاحقاً");
    } finally {
      setLoading(false);
    }
  };

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
          <div className="bg-gradient-to-l from-blue-900 to-blue-700 px-6 py-5 text-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-white text-lg font-bold">نسيت كلمة المرور؟</h2>
            <p className="text-blue-200 text-sm mt-1">سنرسل لك رابطاً لإعادة التعيين</p>
          </div>

          <div className="p-6">
            {sent ? (
              /* Success State */
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-9 h-9 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">تم الإرسال بنجاح!</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  إذا كان البريد الإلكتروني مسجّلاً لدينا، ستصلك رسالة تحتوي على رابط إعادة تعيين كلمة المرور خلال دقائق.
                  <br />
                  <span className="text-amber-600 font-medium">الرابط صالح لمدة ساعة واحدة فقط.</span>
                </p>
                <p className="text-xs text-gray-400 mb-4">لم تستلم الإيميل؟ تحقق من مجلد البريد غير المرغوب فيه (Spam).</p>
                <Link href="/teacher-login">
                  <Button className="w-full" style={{ background: "linear-gradient(135deg, #1a6b3c, #1b5e8a)" }}>
                    العودة لتسجيل الدخول
                  </Button>
                </Link>
              </div>
            ) : (
              /* Form State */
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  أدخل البريد الإلكتروني المرتبط بحسابك وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.
                </p>

                <div className="space-y-1">
                  <Label htmlFor="email" className="text-gray-700 font-medium text-sm">
                    البريد الإلكتروني
                  </Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@email.com"
                      className="pr-9 text-right"
                      dir="ltr"
                      disabled={loading}
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 font-bold text-base"
                  style={{ background: "linear-gradient(135deg, #1b5e8a, #1a3a6b)" }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin ml-2" />
                      جارٍ الإرسال...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4 ml-2" />
                      إرسال رابط إعادة التعيين
                    </>
                  )}
                </Button>

                <div className="text-center pt-2">
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
