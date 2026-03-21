import { Resend } from "resend";

/**
 * Email service for Nawwar Journey platform.
 * Uses Resend API for reliable email delivery from info@nawwarjourney.qpon.
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

  const fromEmail = "رحلة نوّار <info@nawwarjourney.qpon>";

  const htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Arial,sans-serif;background:#f0f7f0;">
  <div style="max-width:580px;margin:30px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1a6b3c,#1b5e8a);padding:36px 24px;text-align:center;">
      <img src="https://d2xsxph8kpxj0f.cloudfront.net/310419663029980891/S9UfAnxEfs6upsP98hCzwU/nawwar-logo-AWuZdjrAyTDDSJocatLxwi.png"
           alt="Nawwar Journey"
           style="width:72px;height:72px;border-radius:16px;margin-bottom:16px;display:block;margin-left:auto;margin-right:auto;" />
      <h1 style="color:#ffffff;font-size:24px;margin:0 0 8px;font-weight:700;">
        🎉 مرحباً بك في رحلة نوّار!
      </h1>
      <p style="color:rgba(255,255,255,0.75);font-size:14px;margin:0;">
        Welcome to Nawwar Journey Educational Platform
      </p>
    </div>

    <!-- Body -->
    <div style="padding:32px 28px;">
      <p style="font-size:17px;color:#222;line-height:1.8;margin:0 0 8px;font-weight:600;">
        أهلاً وسهلاً ${teacherName}! 👋
      </p>
      <p style="font-size:15px;color:#555;line-height:1.9;margin:0 0 24px;">
        يسعدنا انضمامك إلى منصة <strong>رحلة نوّار</strong> التعليمية. حسابك جاهز الآن ويمكنك الاستفادة من جميع أدوات المنصة:
      </p>

      <!-- Features -->
      <div style="margin-bottom:28px;">
        <div style="padding:14px 16px;background:#f5f0ff;border-radius:12px;margin-bottom:10px;border-right:4px solid #7c3aed;">
          <span style="font-size:18px;">✨</span>
          <strong style="color:#6b21a8;font-size:14px;margin-right:8px;">منشئ الألعاب التعليمية</strong>
          <span style="color:#888;font-size:13px;display:block;margin-top:2px;padding-right:28px;">أنشئ ألعاباً تفاعلية بالذكاء الاصطناعي في دقائق</span>
        </div>
        <div style="padding:14px 16px;background:#f0fdf4;border-radius:12px;margin-bottom:10px;border-right:4px solid #16a34a;">
          <span style="font-size:18px;">📱</span>
          <strong style="color:#166534;font-size:14px;margin-right:8px;">مولّد أكواد QR</strong>
          <span style="color:#888;font-size:13px;display:block;margin-top:2px;padding-right:28px;">أنشئ أكواد QR مخصصة بشعار مدرستك لدروسك</span>
        </div>
        <div style="padding:14px 16px;background:#fff7ed;border-radius:12px;border-right:4px solid #ea580c;">
          <span style="font-size:18px;">🎮</span>
          <strong style="color:#9a3412;font-size:14px;margin-right:8px;">مكتبة الألعاب</strong>
          <span style="color:#888;font-size:13px;display:block;margin-top:2px;padding-right:28px;">تصفّح وشارك ألعابك التعليمية مع الطلاب</span>
        </div>
      </div>

      <!-- CTA Button -->
      <div style="text-align:center;margin:28px 0 24px;">
        <a href="https://nawwarjourney.qpon"
           style="display:inline-block;background:linear-gradient(135deg,#1a6b3c,#1b5e8a);color:#ffffff;text-decoration:none;padding:14px 44px;border-radius:12px;font-size:16px;font-weight:700;letter-spacing:0.3px;">
          ابدأ الاستكشاف ←
        </a>
      </div>

      <p style="font-size:12px;color:#ccc;text-align:center;margin:0 0 24px;">
        إذا لم تقم بإنشاء هذا الحساب، يمكنك تجاهل هذه الرسالة بأمان.
      </p>

      <!-- Official Signature -->
      <div style="border-top:2px solid #e8f5ee;padding-top:20px;margin-top:8px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="vertical-align:middle;padding-left:16px;">
              <img src="https://d2xsxph8kpxj0f.cloudfront.net/310419663029980891/S9UfAnxEfs6upsP98hCzwU/nawwar-logo-AWuZdjrAyTDDSJocatLxwi.png"
                   alt="Nawwar Journey"
                   style="width:44px;height:44px;border-radius:10px;display:block;" />
            </td>
            <td style="vertical-align:middle;padding-right:12px;">
              <p style="margin:0;font-size:14px;font-weight:700;color:#1a6b3c;">فريق رحلة نوّار</p>
              <p style="margin:2px 0 0;font-size:12px;color:#888;">Nawwar Journey — المنصة التعليمية التفاعلية</p>
              <p style="margin:4px 0 0;font-size:12px;">
                <a href="https://nawwarjourney.qpon" style="color:#1b5e8a;text-decoration:none;">🌐 nawwarjourney.qpon</a>
                &nbsp;|&nbsp;
                <a href="mailto:info@nawwarjourney.qpon" style="color:#1b5e8a;text-decoration:none;">✉️ info@nawwarjourney.qpon</a>
              </p>
            </td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#f8faf8;padding:16px 24px;text-align:center;border-top:1px solid #eee;">
      <p style="font-size:11px;color:#bbb;margin:0;">
        © 2025 Nawwar Journey. جميع الحقوق محفوظة.
      </p>
      <p style="font-size:11px;margin:4px 0 0;">
        <a href="https://nawwarjourney.qpon" style="color:#1a6b3c;text-decoration:none;">nawwarjourney.qpon</a>
        &nbsp;·&nbsp;
        <a href="mailto:info@nawwarjourney.qpon" style="color:#1a6b3c;text-decoration:none;">info@nawwarjourney.qpon</a>
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
