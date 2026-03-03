/*
 * QR Code Generator - Professional school-branded QR code tool
 * Design: Green/blue school colors, clean, Arabic RTL, professional
 * Features: URL input, logo embedding in center, download PNG, reset
 * Logo is drawn on Canvas AFTER QR code generation for guaranteed overlay
 */
import { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "wouter";
import QRCode from "qrcode";
import { motion } from "framer-motion";
import { QrCode, Download, RotateCcw, ArrowRight, Upload, Link2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SCHOOL_LOGO_BASE64 } from "@/lib/schoolLogo";

// CDN URL for display (img tags), Base64 for canvas operations (no CORS issues)
const SCHOOL_LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029980891/VGalWSshoNNhMYmE.png";

export default function QRGenerator() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [qrGenerated, setQrGenerated] = useState(false);
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrImageSrc, setQrImageSrc] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // For canvas drawing, always use base64 to avoid CORS
  const currentLogoForCanvas = customLogo || SCHOOL_LOGO_BASE64;
  // For display in img tags, use CDN URL
  const currentLogoForDisplay = customLogo || SCHOOL_LOGO_URL;

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
        const logoSize = Math.floor(qrSize * 0.22); // 22% of QR size
        const padding = Math.floor(logoSize * 0.18);
        const totalSize = logoSize + padding * 2;
        const x = Math.floor((qrSize - totalSize) / 2);
        const y = Math.floor((qrSize - totalSize) / 2);

        // White rounded rectangle background
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        const radius = 10;
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + totalSize - radius, y);
        ctx.quadraticCurveTo(x + totalSize, y, x + totalSize, y + radius);
        ctx.lineTo(x + totalSize, y + totalSize - radius);
        ctx.quadraticCurveTo(x + totalSize, y + totalSize, x + totalSize - radius, y + totalSize);
        ctx.lineTo(x + radius, y + totalSize);
        ctx.quadraticCurveTo(x, y + totalSize, x, y + totalSize - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();

        // Draw the logo image
        ctx.drawImage(logoImg, x + padding, y + padding, logoSize, logoSize);
      } catch (e) {
        console.warn("Could not load logo for QR overlay:", e);
      }

      return finalCanvas.toDataURL("image/png", 1.0);
    },
    [url, currentLogoForCanvas, loadImage]
  );

  const generateQR = async () => {
    const trimmed = url.trim();
    if (!trimmed) {
      setError("الرجاء إدخال رابط");
      return;
    }

    setError("");
    setIsGenerating(true);

    try {
      const derivedTitle = title || extractTitle(trimmed);
      if (!title) setTitle(derivedTitle);

      // Generate preview QR with logo (300px)
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
    setCustomLogo(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setCustomLogo(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Re-generate QR when logo changes and QR is already generated
  useEffect(() => {
    if (qrGenerated && url.trim()) {
      generateQRWithLogo(400).then(setQrImageSrc).catch(console.error);
    }
  }, [customLogo]);

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

          {/* Logo Upload */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: "'Tajawal', sans-serif" }}>
              <Upload size={16} className="text-[#1a6b3c]" />
              لوجو مخصص (اختياري)
              <span className="text-gray-400 text-xs">(Custom Logo)</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#1a6b3c] hover:bg-green-50 transition-all text-sm text-gray-600"
                style={{ fontFamily: "'Tajawal', sans-serif" }}
              >
                <Upload size={16} />
                رفع لوجو
              </label>
              <div className="flex items-center gap-2">
                <img
                  src={currentLogoForDisplay}
                  alt="Current Logo"
                  className="h-10 w-10 object-contain border border-gray-200 rounded-lg p-1"
                />
                <span className="text-xs text-gray-400" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                  {customLogo ? "لوجو مخصص" : "لوجو المدرسة"}
                </span>
              </div>
            </div>
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
                  alt="QR Code with school logo"
                  className="mx-auto"
                  style={{ width: "300px", height: "300px", imageRendering: "pixelated" }}
                />
              </div>

              {/* Download Button */}
              <div className="mt-6">
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
