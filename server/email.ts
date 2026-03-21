import nodemailer from "nodemailer";

/**
 * Email service for Nawwar Journey platform.
 * Uses SMTP credentials from environment variables.
 * Falls back gracefully if email is not configured.
 */

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn("[Email] SMTP not configured. Skipping email send.");
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendWelcomeEmail(to: string, teacherName: string): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) return false;

  const fromName = process.env.SMTP_FROM_NAME || "Nawwar Journey";
  const fromEmail = process.env.SMTP_USER;

  const htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Arial,sans-serif;background:#f0f7f0;">
  <div style="max-width:560px;margin:30px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1a6b3c,#1b5e8a);padding:32px 24px;text-align:center;">
      <img src="https://d2xsxph8kpxj0f.cloudfront.net/310419663029980891/S9UfAnxEfs6upsP98hCzwU/nawwar-logo-AWuZdjrAyTDDSJocatLxwi.png" 
           alt="Nawwar Journey" style="width:64px;height:64px;border-radius:14px;margin-bottom:12px;" />
      <h1 style="color:#ffffff;font-size:22px;margin:0;">مرحباً بك في رحلة نوّار!</h1>
      <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:6px 0 0;">Welcome to Nawwar Journey</p>
    </div>
    <!-- Body -->
    <div style="padding:28px 24px;">
      <p style="font-size:16px;color:#333;line-height:1.8;margin:0 0 16px;">
        أهلاً <strong>${teacherName}</strong>! 🎉
      </p>
      <p style="font-size:15px;color:#555;line-height:1.8;margin:0 0 16px;">
        تم تسجيل حسابك بنجاح في منصة <strong>رحلة نوّار</strong> التعليمية. يمكنك الآن الاستفادة من جميع أدوات المنصة:
      </p>
      <ul style="font-size:14px;color:#555;line-height:2;padding-right:20px;margin:0 0 20px;">
        <li>🎮 <strong>منشئ الألعاب التعليمية</strong> — أنشئ ألعاب تفاعلية بالذكاء الاصطناعي</li>
        <li>📱 <strong>مولّد أكواد QR</strong> — أنشئ أكواد QR مخصصة لدروسك</li>
        <li>🎯 <strong>مكتبة الألعاب</strong> — تصفّح وشارك ألعابك التعليمية</li>
      </ul>
      <div style="text-align:center;margin:24px 0;">
        <a href="https://nawwarjourney.qpon" 
           style="display:inline-block;background:linear-gradient(135deg,#1a6b3c,#1b5e8a);color:#fff;text-decoration:none;padding:12px 32px;border-radius:10px;font-size:15px;font-weight:bold;">
          ابدأ الآن →
        </a>
      </div>
      <p style="font-size:13px;color:#999;text-align:center;margin:20px 0 0;">
        إذا لم تقم بإنشاء هذا الحساب، يمكنك تجاهل هذه الرسالة.
      </p>
    </div>
    <!-- Footer -->
    <div style="background:#f8faf8;padding:16px 24px;text-align:center;border-top:1px solid #eee;">
      <p style="font-size:12px;color:#aaa;margin:0;">
        Nawwar Journey — منصة تعليمية للتطبيقات التفاعلية
      </p>
    </div>
  </div>
</body>
</html>`;

  try {
    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject: "🎉 مرحباً بك في رحلة نوّار! — Welcome to Nawwar Journey",
      html: htmlContent,
    });
    console.log(`[Email] Welcome email sent to ${to}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send welcome email:", error);
    return false;
  }
}
