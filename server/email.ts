import { Resend } from "resend";

/**
 * Email service for Nawwar Journey platform.
 * Uses Resend API for reliable email delivery.
 * Falls back gracefully if API key is not configured.
 */

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[Email] RESEND_API_KEY not configured. Skipping email send.");
    return null;
  }
  return new Resend(apiKey);
}

export async function sendWelcomeEmail(to: string, teacherName: string): Promise<boolean> {
  const resend = getResendClient();
  if (!resend) return false;

  const fromEmail = "Nawwar Journey <onboarding@resend.dev>";

  const htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Arial,sans-serif;background:#f0f7f0;">
  <div style="max-width:560px;margin:30px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1a6b3c,#1b5e8a);padding:36px 24px;text-align:center;">
      <img src="https://d2xsxph8kpxj0f.cloudfront.net/310419663029980891/S9UfAnxEfs6upsP98hCzwU/nawwar-logo-AWuZdjrAyTDDSJocatLxwi.png"
           alt="Nawwar Journey"
           style="width:72px;height:72px;border-radius:16px;margin-bottom:16px;display:block;margin-left:auto;margin-right:auto;" />
      <h1 style="color:#ffffff;font-size:24px;margin:0 0 8px;font-weight:700;">
        🎉 مرحباً بك في رحلة نوّار!
      </h1>
      <p style="color:rgba(255,255,255,0.75);font-size:14px;margin:0;">
        Welcome to Nawwar Journey
      </p>
    </div>

    <!-- Body -->
    <div style="padding:32px 28px;">
      <p style="font-size:17px;color:#222;line-height:1.8;margin:0 0 8px;font-weight:600;">
        أهلاً ${teacherName}! 👋
      </p>
      <p style="font-size:15px;color:#555;line-height:1.9;margin:0 0 24px;">
        يسعدنا انضمامك إلى منصة <strong>رحلة نوّار</strong> التعليمية. حسابك جاهز الآن ويمكنك الاستفادة من جميع أدوات المنصة:
      </p>

      <!-- Features -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
        <tr>
          <td style="padding:12px 14px;background:#f5f0ff;border-radius:12px;margin-bottom:10px;display:block;">
            <span style="font-size:20px;">✨</span>
            <strong style="color:#6b21a8;font-size:14px;margin-right:8px;">منشئ الألعاب التعليمية</strong>
            <span style="color:#888;font-size:13px;">— أنشئ ألعاباً تفاعلية بالذكاء الاصطناعي</span>
          </td>
        </tr>
        <tr><td style="height:8px;"></td></tr>
        <tr>
          <td style="padding:12px 14px;background:#f0fdf4;border-radius:12px;margin-bottom:10px;display:block;">
            <span style="font-size:20px;">📱</span>
            <strong style="color:#166534;font-size:14px;margin-right:8px;">مولّد أكواد QR</strong>
            <span style="color:#888;font-size:13px;">— أنشئ أكواد QR مخصصة لدروسك</span>
          </td>
        </tr>
        <tr><td style="height:8px;"></td></tr>
        <tr>
          <td style="padding:12px 14px;background:#fff7ed;border-radius:12px;display:block;">
            <span style="font-size:20px;">🎮</span>
            <strong style="color:#9a3412;font-size:14px;margin-right:8px;">مكتبة الألعاب</strong>
            <span style="color:#888;font-size:13px;">— تصفّح وشارك ألعابك التعليمية</span>
          </td>
        </tr>
      </table>

      <!-- CTA Button -->
      <div style="text-align:center;margin:28px 0 20px;">
        <a href="https://nawwarjourney.qpon"
           style="display:inline-block;background:linear-gradient(135deg,#1a6b3c,#1b5e8a);color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:12px;font-size:16px;font-weight:700;letter-spacing:0.3px;">
          ابدأ الاستكشاف →
        </a>
      </div>

      <p style="font-size:12px;color:#bbb;text-align:center;margin:16px 0 0;">
        إذا لم تقم بإنشاء هذا الحساب، يمكنك تجاهل هذه الرسالة.
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f8faf8;padding:18px 24px;text-align:center;border-top:1px solid #eee;">
      <p style="font-size:12px;color:#aaa;margin:0;">
        © 2025 Nawwar Journey — منصة تعليمية للتطبيقات التفاعلية
      </p>
      <p style="font-size:12px;color:#bbb;margin:4px 0 0;">
        <a href="https://nawwarjourney.qpon" style="color:#1a6b3c;text-decoration:none;">nawwarjourney.qpon</a>
      </p>
    </div>
  </div>
</body>
</html>`;

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [to],
      subject: "🎉 مرحباً بك في رحلة نوّار! — Welcome to Nawwar Journey",
      html: htmlContent,
    });

    if (error) {
      console.error("[Email] Resend error:", error);
      return false;
    }

    console.log(`[Email] Welcome email sent to ${to}, id: ${data?.id}`);
    return true;
  } catch (err) {
    console.error("[Email] Failed to send welcome email:", err);
    return false;
  }
}
