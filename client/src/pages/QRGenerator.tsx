/*
 * QR Code Generator - Professional school-branded QR code tool
 * Design: Green/blue school colors, clean, Arabic RTL, professional
 * Features: URL input, logo embedding, download PNG, reset
 */
import { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "wouter";
import QRCode from "qrcode";
import { motion } from "framer-motion";
import { QrCode, Download, RotateCcw, ArrowRight, Upload, Link2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const SCHOOL_LOGO = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029980891/VGalWSshoNNhMYmE.png";

export default function QRGenerator() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [qrGenerated, setQrGenerated] = useState(false);
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const downloadCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentLogo = customLogo || SCHOOL_LOGO;

  // Preload logo image
  const loadImage = useCallback((src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
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

  const drawQRWithLogo = useCallback(
    async (canvas: HTMLCanvasElement, size: number, forDownload: boolean = false) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const fullUrl = normalizeUrl(url);
      
      // Generate QR code to canvas
      await QRCode.toCanvas(canvas, fullUrl, {
        width: size,
        margin: 2,
        errorCorrectionLevel: "H",
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      // Draw logo in center
      try {
        const logoImg = await loadImage(currentLogo);
        const logoSize = size * 0.19;
        const padding = logoSize * 0.15;
        const totalSize = logoSize + padding * 2;
        const x = (size - totalSize) / 2;
        const y = (size - totalSize) / 2;

        // White background for logo
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.roundRect(x, y, totalSize, totalSize, 8);
        ctx.fill();

        // Draw logo
        ctx.drawImage(logoImg, x + padding, y + padding, logoSize, logoSize);
      } catch (e) {
        console.warn("Could not load logo:", e);
      }

      // For download, add title and subtitle
      if (forDownload) {
        // This is handled separately in the download function
      }
    },
    [url, currentLogo, loadImage]
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

      // Draw preview QR
      if (canvasRef.current) {
        await drawQRWithLogo(canvasRef.current, 300);
      }

      setQrGenerated(true);
    } catch (e) {
      setError("حدث خطأ في إنشاء الكود. تأكد من صحة الرابط.");
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPNG = async () => {
    const fullUrl = normalizeUrl(url);
    const displayTitle = title || extractTitle(url);

    // Create a high-res canvas for download
    const downloadCanvas = document.createElement("canvas");
    const qrSize = 600;
    const padding = 60;
    const titleHeight = 80;
    const subtitleHeight = 40;
    const bottomPadding = 40;
    const totalWidth = qrSize + padding * 2;
    const totalHeight = titleHeight + subtitleHeight + qrSize + padding + bottomPadding;

    downloadCanvas.width = totalWidth;
    downloadCanvas.height = totalHeight;

    const ctx = downloadCanvas.getContext("2d");
    if (!ctx) return;

    // White background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    // Title
    ctx.fillStyle = "#1a6b3c";
    ctx.font = "bold 28px 'Tajawal', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(displayTitle, totalWidth / 2, titleHeight - 10);

    // Subtitle
    ctx.fillStyle = "#888888";
    ctx.font = "18px 'Tajawal', Arial, sans-serif";
    ctx.fillText("Scan to open", totalWidth / 2, titleHeight + subtitleHeight - 10);

    // Generate QR on temp canvas
    const tempCanvas = document.createElement("canvas");
    await QRCode.toCanvas(tempCanvas, fullUrl, {
      width: qrSize,
      margin: 2,
      errorCorrectionLevel: "H",
      color: { dark: "#000000", light: "#FFFFFF" },
    });

    // Draw QR onto download canvas
    const qrX = padding;
    const qrY = titleHeight + subtitleHeight;
    ctx.drawImage(tempCanvas, qrX, qrY, qrSize, qrSize);

    // Draw logo in center of QR
    try {
      const logoImg = await loadImage(currentLogo);
      const logoSize = qrSize * 0.19;
      const logoPadding = logoSize * 0.15;
      const totalLogoSize = logoSize + logoPadding * 2;
      const logoX = qrX + (qrSize - totalLogoSize) / 2;
      const logoY = qrY + (qrSize - totalLogoSize) / 2;

      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.roundRect(logoX, logoY, totalLogoSize, totalLogoSize, 8);
      ctx.fill();

      ctx.drawImage(logoImg, logoX + logoPadding, logoY + logoPadding, logoSize, logoSize);
    } catch (e) {
      console.warn("Could not load logo for download:", e);
    }

    // Download
    const link = document.createElement("a");
    link.download = `QR_${displayTitle.replace(/\s+/g, "_")}.png`;
    link.href = downloadCanvas.toDataURL("image/png", 1.0);
    link.click();
  };

  const resetAll = () => {
    setUrl("");
    setTitle("");
    setQrGenerated(false);
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
        if (qrGenerated && canvasRef.current) {
          // Re-generate with new logo
          setTimeout(() => {
            drawQRWithLogo(canvasRef.current!, 300);
          }, 100);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Re-draw QR when logo changes
  useEffect(() => {
    if (qrGenerated && canvasRef.current) {
      drawQRWithLogo(canvasRef.current, 300);
    }
  }, [customLogo, qrGenerated, drawQRWithLogo]);

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
            <img src={SCHOOL_LOGO} alt="Logo" className="h-12 w-auto" />
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
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-left dir-ltr focus:border-[#1a6b3c] focus:ring-2 focus:ring-[#1a6b3c]/20 outline-none transition-all text-gray-800"
              dir="ltr"
              style={{ fontFamily: "monospace, 'Tajawal', sans-serif" }}
            />
            {error && (
              <p className="text-red-500 text-sm mt-2" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                ⚠️ {error}
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
                  src={currentLogo}
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
        {qrGenerated && (
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

              {/* QR Canvas */}
              <div className="inline-block p-6 bg-white rounded-2xl shadow-inner border border-gray-100">
                <canvas ref={canvasRef} className="mx-auto" />
              </div>

              {/* Hidden download canvas */}
              <canvas ref={downloadCanvasRef} className="hidden" />

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
