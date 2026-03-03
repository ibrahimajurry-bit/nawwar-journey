/*
 * QR Code Generator - Professional school-branded QR code tool
 * Design: Green/blue school colors, clean, Arabic RTL, professional
 * Features: URL input, two logo modes (school fixed + custom upload), download PNG, reset
 * Logo is drawn on Canvas AFTER QR code generation for guaranteed overlay
 */
import { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "wouter";
import QRCode from "qrcode";
import { motion } from "framer-motion";
import { QrCode, Download, RotateCcw, ArrowRight, Upload, Link2, CheckCircle2, School, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SCHOOL_LOGO_BASE64 } from "@/lib/schoolLogo";

// CDN URL for display (img tags), Base64 for canvas operations (no CORS issues)
const SCHOOL_LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310419663029980891/S9UfAnxEfs6upsP98hCzwU/school_logo_cropped_ae5db075.png";

// Logo aspect ratio: 2.39:1 (width:height) - rectangular, not square
const SCHOOL_LOGO_ASPECT_RATIO = 2.39;

type LogoMode = "school" | "custom";

export default function QRGenerator() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [qrGenerated, setQrGenerated] = useState(false);
  const [logoMode, setLogoMode] = useState<LogoMode>("school");
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const [customLogoName, setCustomLogoName] = useState<string>("");
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrImageSrc, setQrImageSrc] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine which logo to use based on mode
  const currentLogoForCanvas = logoMode === "school" ? SCHOOL_LOGO_BASE64 : (customLogo || SCHOOL_LOGO_BASE64);
  const currentLogoForDisplay = logoMode === "school" ? SCHOOL_LOGO_URL : (customLogo || SCHOOL_LOGO_URL);

  const loadImage = useCallback((src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Failed to load image: " + src));
      img.src = src;
    });
  }, []);

  const normalizeUrl = (input: string): string => {
    let trimmed = input.trim();
    if (!trimmed) return "";
    if (!/^https?:\/\//i.test(trimmed)) {
      trimmed = "https://" + trimmed;
    }
    return trimmed;
  };

  const extractTitle = (input: string): string => {
    try {
      const urlObj = new URL(normalizeUrl(input));
      const hostname = urlObj.hostname.replace("www.", "");
      const pathParts = urlObj.pathname.split("/").filter(Boolean);
      if (pathParts.length > 0) {
        const lastPart = decodeURIComponent(pathParts[pathParts.length - 1])
          .replace(/[-_]/g, " ")
          .replace(/\.\w+$/, "");
        if (lastPart.length > 3) {
          return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
        }
      }
      return hostname;
    } catch {
      return input.slice(0, 40);
    }
  };

  // Core function: Generate QR code with logo overlay on a canvas
  const generateQRWithLogo = useCallback(
    async (qrSize: number): Promise<string> => {
      const fullUrl = normalizeUrl(url);

      // Step 1: Generate QR code on a temporary canvas
      const tempCanvas = document.createElement("canvas");
      await QRCode.toCanvas(tempCanvas, fullUrl, {
        width: qrSize,
        margin: 2,
        errorCorrectionLevel: "H", // High error correction to survive logo overlay
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      // Step 2: Create final canvas and draw QR code
      const finalCanvas = document.createElement("canvas");
      finalCanvas.width = qrSize;
      finalCanvas.height = qrSize;
      const ctx = finalCanvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context not available");

      ctx.drawImage(tempCanvas, 0, 0, qrSize, qrSize);

      // Step 3: Draw logo in the center
      try {
        const logoImg = await loadImage(currentLogoForCanvas);
        
        // Determine if school logo (rectangular) or custom logo (keep as-is)
        const isSchoolLogo = logoMode === "school";
        const imgAspect = logoImg.naturalWidth / logoImg.naturalHeight;
        const useAspect = isSchoolLogo ? SCHOOL_LOGO_ASPECT_RATIO : (imgAspect > 1 ? imgAspect : 1);
        
        // For rectangular logo: width is ~45% of QR, height adjusts by aspect ratio
        // This makes the logo wider but shorter, taking less vertical QR space
        const logoWidth = Math.floor(qrSize * (isSchoolLogo ? 0.42 : 0.28));
        const logoHeight = Math.floor(logoWidth / useAspect);
        
        const paddingX = Math.floor(logoWidth * 0.08);
        const paddingY = Math.floor(logoHeight * 0.15);
        const totalWidth = logoWidth + paddingX * 2;
        const totalHeight = logoHeight + paddingY * 2;
        const x = Math.floor((qrSize - totalWidth) / 2);
        const y = Math.floor((qrSize - totalHeight) / 2);

        // White rounded rectangle background
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        const radius = Math.floor(Math.min(totalWidth, totalHeight) * 0.08);
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + totalWidth - radius, y);
        ctx.quadraticCurveTo(x + totalWidth, y, x + totalWidth, y + radius);
        ctx.lineTo(x + totalWidth, y + totalHeight - radius);
        ctx.quadraticCurveTo(x + totalWidth, y + totalHeight, x + totalWidth - radius, y + totalHeight);
        ctx.lineTo(x + radius, y + totalHeight);
        ctx.quadraticCurveTo(x, y + totalHeight, x, y + totalHeight - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();

        // Draw the logo image (rectangular for school, square for custom)
        ctx.drawImage(logoImg, x + paddingX, y + paddingY, logoWidth, logoHeight);
      } catch (e) {
        console.warn("Could not load logo for QR overlay:", e);
      }

      return finalCanvas.toDataURL("image/png", 1.0);
    },
    [url, currentLogoForCanvas, loadImage, logoMode]
  );

  const generateQR = async () => {
    const trimmed = url.trim();
    if (!trimmed) {
      setError("الرجاء إدخال رابط");
      return;
    }

    // If custom mode selected but no logo uploaded, show error
    if (logoMode === "custom" && !customLogo) {
      setError("الرجاء رفع لوجو مخصص أو اختيار لوجو المدرسة");
      return;
    }

    setError("");
    setIsGenerating(true);

    try {
      const derivedTitle = title || extractTitle(trimmed);
      if (!title) setTitle(derivedTitle);

      // Generate preview QR with logo (400px)
      const previewDataUrl = await generateQRWithLogo(400);
      setQrImageSrc(previewDataUrl);
      setQrGenerated(true);
    } catch (e) {
      setError("حدث خطأ في إنشاء الكود. تأكد من صحة الرابط.");
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPNG = async () => {
    const displayTitle = title || extractTitle(url);

    try {
      // Generate high-res QR with logo (800px)
      const qrSize = 800;
      const qrDataUrl = await generateQRWithLogo(qrSize);
      const qrImg = await loadImage(qrDataUrl);

      // Create download canvas with title and subtitle
      const padding = 80;
      const titleHeight = 100;
      const subtitleHeight = 50;
      const bottomPadding = 60;
      const totalWidth = qrSize + padding * 2;
      const totalHeight = titleHeight + subtitleHeight + qrSize + padding + bottomPadding;

      const downloadCanvas = document.createElement("canvas");
      downloadCanvas.width = totalWidth;
      downloadCanvas.height = totalHeight;

      const ctx = downloadCanvas.getContext("2d");
      if (!ctx) return;

      // White background
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, totalWidth, totalHeight);

      // Title text
      ctx.fillStyle = "#1a6b3c";
      ctx.font = "bold 36px 'Tajawal', 'Arial', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(displayTitle, totalWidth / 2, titleHeight / 2 + 10);

      // Subtitle
      ctx.fillStyle = "#888888";
      ctx.font = "22px 'Tajawal', 'Arial', sans-serif";
      ctx.fillText("Scan to open", totalWidth / 2, titleHeight + subtitleHeight / 2);

      // Draw QR code with logo
      const qrX = padding;
      const qrY = titleHeight + subtitleHeight;
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

      // Download
      const link = document.createElement("a");
      link.download = `QR_${displayTitle.replace(/\s+/g, "_")}.png`;
      link.href = downloadCanvas.toDataURL("image/png", 1.0);
      link.click();
    } catch (e) {
      console.error("Download error:", e);
    }
  };

  const resetAll = () => {
    setUrl("");
    setTitle("");
    setQrGenerated(false);
    setQrImageSrc("");
    setLogoMode("school");
    setCustomLogo(null);
    setCustomLogoName("");
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomLogoName(file.name);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setCustomLogo(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Re-generate QR when logo mode or custom logo changes and QR is already generated
  useEffect(() => {
    if (qrGenerated && url.trim()) {
      if (logoMode === "school" || (logoMode === "custom" && customLogo)) {
        generateQRWithLogo(400).then(setQrImageSrc).catch(console.error);
      }
    }
  }, [logoMode, customLogo]);

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-[#f0f7f0] via-white to-[#f0f4f8]">
      {/* Header */}
      <header className="bg-gradient-to-br from-[#1a6b3c] via-[#1e7a44] to-[#1b5e8a] text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/">
              <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm">
                <ArrowRight size={18} />
                <span style={{ fontFamily: "'Tajawal', sans-serif" }}>الرئيسية</span>
              </button>
            </Link>
            <img src={SCHOOL_LOGO_URL} alt="Logo" className="h-12 w-auto" />
          </div>
          <div className="text-center mt-4">
            <QrCode size={40} className="mx-auto mb-2 opacity-80" />
            <h1 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "'Tajawal', sans-serif" }}>
              مولد أكواد QR للمدرسة
            </h1>
            <p className="text-white/70 mt-1 text-sm" style={{ fontFamily: "'Tajawal', sans-serif" }}>
              أنشئ رمز QR احترافيًا مع لوجو المدرسة
            </p>
            <p className="text-white/50 text-xs mt-1">School QR Code Generator</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Input Section */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* URL Input */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Tajawal', sans-serif" }}>
              <Link2 size={16} className="text-[#1a6b3c]" />
              أدخل الرابط
              <span className="text-gray-400 text-xs">(Enter URL)</span>
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && generateQR()}
              placeholder="https://example.com"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-left focus:border-[#1a6b3c] focus:ring-2 focus:ring-[#1a6b3c]/20 outline-none transition-all text-gray-800"
              dir="ltr"
              style={{ fontFamily: "monospace, 'Tajawal', sans-serif" }}
            />
            {error && (
              <p className="text-red-500 text-sm mt-2" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                {error}
              </p>
            )}
          </div>

          {/* Title Input */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Tajawal', sans-serif" }}>
              العنوان (اختياري)
              <span className="text-gray-400 text-xs">(Optional Title)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="سيتم استخراجه من الرابط تلقائيًا"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#1a6b3c] focus:ring-2 focus:ring-[#1a6b3c]/20 outline-none transition-all text-gray-800"
              style={{ fontFamily: "'Tajawal', sans-serif" }}
            />
          </div>

          {/* Logo Selection - Two Options */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3" style={{ fontFamily: "'Tajawal', sans-serif" }}>
              اختر اللوجو
              <span className="text-gray-400 text-xs">(Choose Logo)</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: School Logo (Fixed) */}
              <button
                type="button"
                onClick={() => setLogoMode("school")}
                className={`relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  logoMode === "school"
                    ? "border-[#1a6b3c] bg-green-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {/* Selected indicator */}
                {logoMode === "school" && (
                  <div className="absolute top-2 left-2">
                    <CheckCircle2 size={20} className="text-[#1a6b3c]" />
                  </div>
                )}
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center p-1 ${
                  logoMode === "school" ? "bg-white shadow-sm border border-green-200" : "bg-gray-50 border border-gray-200"
                }`}>
                  <img
                    src={SCHOOL_LOGO_URL}
                    alt="School Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <School size={14} className={logoMode === "school" ? "text-[#1a6b3c]" : "text-gray-500"} />
                    <span
                      className={`text-sm font-bold ${logoMode === "school" ? "text-[#1a6b3c]" : "text-gray-700"}`}
                      style={{ fontFamily: "'Tajawal', sans-serif" }}
                    >
                      لوجو الإبداع العلمي
                    </span>
                  </div>
                  <span className="text-xs text-gray-400" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                    يُضاف تلقائيًا
                  </span>
                  <span className="block text-xs text-gray-400">(Auto - School Logo)</span>
                </div>
              </button>

              {/* Option 2: Custom Logo (Upload) */}
              <button
                type="button"
                onClick={() => setLogoMode("custom")}
                className={`relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  logoMode === "custom"
                    ? "border-[#1b5e8a] bg-blue-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {/* Selected indicator */}
                {logoMode === "custom" && (
                  <div className="absolute top-2 left-2">
                    <CheckCircle2 size={20} className="text-[#1b5e8a]" />
                  </div>
                )}
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                  logoMode === "custom" ? "bg-white shadow-sm border border-blue-200" : "bg-gray-50 border border-gray-200"
                }`}>
                  {customLogo ? (
                    <img
                      src={customLogo}
                      alt="Custom Logo"
                      className="w-full h-full object-contain p-1"
                    />
                  ) : (
                    <ImagePlus size={28} className={logoMode === "custom" ? "text-[#1b5e8a]" : "text-gray-400"} />
                  )}
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <Upload size={14} className={logoMode === "custom" ? "text-[#1b5e8a]" : "text-gray-500"} />
                    <span
                      className={`text-sm font-bold ${logoMode === "custom" ? "text-[#1b5e8a]" : "text-gray-700"}`}
                      style={{ fontFamily: "'Tajawal', sans-serif" }}
                    >
                      لوجو مخصص
                    </span>
                  </div>
                  <span className="text-xs text-gray-400" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                    ارفع صورة اللوجو
                  </span>
                  <span className="block text-xs text-gray-400">(Upload Custom Logo)</span>
                </div>
              </button>
            </div>

            {/* Custom Logo Upload Area - Only shown when custom mode is selected */}
            {logoMode === "custom" && (
              <motion.div
                className="mt-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <div className="flex items-center gap-3">
                  <label
                    htmlFor="logo-upload"
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-dashed border-[#1b5e8a]/40 rounded-xl cursor-pointer hover:border-[#1b5e8a] hover:bg-blue-50 transition-all text-sm text-[#1b5e8a] font-medium"
                    style={{ fontFamily: "'Tajawal', sans-serif" }}
                  >
                    <Upload size={16} />
                    {customLogo ? "تغيير اللوجو" : "رفع لوجو"}
                  </label>
                  {customLogo && (
                    <div className="flex items-center gap-2">
                      <img
                        src={customLogo}
                        alt="Uploaded Logo"
                        className="h-10 w-10 object-contain border border-blue-200 rounded-lg p-0.5 bg-white"
                      />
                      <span className="text-xs text-gray-500 truncate max-w-[120px]" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                        {customLogoName || "لوجو مخصص"}
                      </span>
                    </div>
                  )}
                  {!customLogo && (
                    <span className="text-xs text-gray-400" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                      PNG, JPG, SVG
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={generateQR}
              disabled={isGenerating}
              className="flex-1 bg-gradient-to-l from-[#1a6b3c] to-[#1e7a44] hover:from-[#155a32] hover:to-[#1a6b3c] text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
              style={{ fontFamily: "'Tajawal', sans-serif" }}
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جارٍ الإنشاء...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <QrCode size={18} />
                  إنشاء الكود
                </span>
              )}
            </Button>
            <Button
              onClick={resetAll}
              variant="outline"
              className="px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-600 hover:text-red-600 transition-all"
              style={{ fontFamily: "'Tajawal', sans-serif" }}
            >
              <RotateCcw size={18} />
              <span className="hidden sm:inline mr-1">إعادة ضبط</span>
            </Button>
          </div>
        </motion.div>

        {/* QR Output Card */}
        {qrGenerated && qrImageSrc && (
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-center">
              {/* Success indicator */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <CheckCircle2 size={20} className="text-green-500" />
                <span className="text-green-600 font-medium text-sm" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                  تم إنشاء الكود بنجاح
                </span>
              </div>

              {/* Title */}
              <h3
                className="text-xl font-bold text-[#1a6b3c] mb-1"
                style={{ fontFamily: "'Tajawal', sans-serif" }}
              >
                {title || extractTitle(url)}
              </h3>
              <p className="text-gray-400 text-sm mb-6">Scan to open</p>

              {/* QR Code as Image (with logo baked in) */}
              <div className="inline-block p-6 bg-white rounded-2xl shadow-inner border border-gray-100">
                <img
                  src={qrImageSrc}
                  alt="QR Code with logo"
                  className="mx-auto"
                  style={{ width: "300px", height: "300px", imageRendering: "pixelated" }}
                />
              </div>

              {/* Logo mode indicator */}
              <p className="text-gray-400 text-xs mt-3" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                {logoMode === "school" ? "🏫 لوجو مدرسة الإبداع العلمي" : "🎨 لوجو مخصص"}
              </p>

              {/* Download Button */}
              <div className="mt-5">
                <Button
                  onClick={downloadPNG}
                  className="bg-gradient-to-l from-[#1b5e8a] to-[#1a6b3c] hover:from-[#164d73] hover:to-[#155a32] text-white px-8 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                  style={{ fontFamily: "'Tajawal', sans-serif" }}
                >
                  <Download size={18} className="ml-2" />
                  تحميل PNG
                </Button>
                <p className="text-gray-400 text-xs mt-2" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                  سيتم تحميل الصورة بجودة عالية مع العنوان واللوجو
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#1a6b3c] text-white/70 py-4 text-center mt-12">
        <p className="text-sm" style={{ fontFamily: "'Tajawal', sans-serif" }}>
          مدرسة الإبداع العلمي الدولية - مويلح | قسم اللغة العربية للناطقين بغيرها
        </p>
      </footer>
    </div>
  );
}
