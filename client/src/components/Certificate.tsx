import { useRef, useCallback } from "react";
import { useGame } from "@/contexts/GameContext";
import { IMAGES, getGrade, stations } from "@/lib/gameData";
import { motion } from "framer-motion";

export default function Certificate() {
  const { playerName, score, totalQuestions, stationScores, resetGame } = useGame();
  const certRef = useRef<HTMLDivElement>(null);
  const grade = getGrade(score, totalQuestions);

  const downloadCertificate = useCallback(async () => {
    if (!certRef.current) return;

    try {
      // Use html2canvas approach via canvas API
      const cert = certRef.current;
      const canvas = document.createElement("canvas");
      const scale = 2;
      canvas.width = cert.offsetWidth * scale;
      canvas.height = cert.offsetHeight * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.scale(scale, scale);

      // Draw background gradient
      const grad = ctx.createLinearGradient(0, 0, cert.offsetWidth, cert.offsetHeight);
      grad.addColorStop(0, "#FFFBEB");
      grad.addColorStop(0.5, "#FEF3C7");
      grad.addColorStop(1, "#FDE68A");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, cert.offsetWidth, cert.offsetHeight);

      // Draw decorative border
      ctx.strokeStyle = "#F59E0B";
      ctx.lineWidth = 4;
      ctx.strokeRect(15, 15, cert.offsetWidth - 30, cert.offsetHeight - 30);
      ctx.strokeStyle = "#D97706";
      ctx.lineWidth = 2;
      ctx.strokeRect(22, 22, cert.offsetWidth - 44, cert.offsetHeight - 44);

      // Draw stars at corners
      const drawStar = (x: number, y: number, size: number) => {
        ctx.font = `${size}px serif`;
        ctx.fillText("⭐", x - size / 2, y + size / 3);
      };
      drawStar(50, 50, 24);
      drawStar(cert.offsetWidth - 50, 50, 24);
      drawStar(50, cert.offsetHeight - 50, 24);
      drawStar(cert.offsetWidth - 50, cert.offsetHeight - 50, 24);

      // Title
      ctx.textAlign = "center";
      ctx.fillStyle = "#D97706";
      ctx.font = "bold 28px Tajawal, sans-serif";
      ctx.fillText("شَهَادَةُ تَقْدِيرٍ", cert.offsetWidth / 2, 75);
      ctx.fillStyle = "#92400E";
      ctx.font = "16px Fredoka, sans-serif";
      ctx.fillText("Certificate of Achievement", cert.offsetWidth / 2, 100);

      // Trophy
      ctx.font = "48px serif";
      ctx.fillText("🏆", cert.offsetWidth / 2, 155);

      // Player name
      ctx.fillStyle = "#1C1917";
      ctx.font = "bold 32px Tajawal, sans-serif";
      ctx.fillText(playerName, cert.offsetWidth / 2, 200);

      // Grade
      ctx.fillStyle = "#D97706";
      ctx.font = "bold 24px Tajawal, sans-serif";
      ctx.fillText(`${grade.emoji} ${grade.ar}`, cert.offsetWidth / 2, 240);
      ctx.fillStyle = "#92400E";
      ctx.font = "16px Fredoka, sans-serif";
      ctx.fillText(grade.en, cert.offsetWidth / 2, 265);

      // Score
      ctx.fillStyle = "#1C1917";
      ctx.font = "bold 22px Fredoka, sans-serif";
      ctx.fillText(`${score} / ${totalQuestions}`, cert.offsetWidth / 2, 300);
      ctx.fillStyle = "#78716C";
      ctx.font = "14px Tajawal, sans-serif";
      ctx.fillText("الدَّرَجَةُ - Score", cert.offsetWidth / 2, 320);

      // Station scores
      const startY = 350;
      stations.forEach((station, i) => {
        const y = startY + i * 28;
        ctx.fillStyle = station.color;
        ctx.font = "bold 14px Tajawal, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`${station.icon} ${station.nameAr}: ${stationScores[i]}/${station.questions.length}`, cert.offsetWidth / 2, y);
      });

      // Story name
      const storyY = startY + stations.length * 28 + 20;
      ctx.fillStyle = "#78716C";
      ctx.font = "14px Tajawal, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("قِصَّةُ جَارِنَا السَّيِّدُ مُهِمٌّ", cert.offsetWidth / 2, storyY);
      ctx.font = "12px Nunito, sans-serif";
      ctx.fillText("The Story of Our Neighbor Mr. Muhim", cert.offsetWidth / 2, storyY + 20);

      // School info
      ctx.fillStyle = "#A8A29E";
      ctx.font = "12px Tajawal, sans-serif";
      ctx.fillText("مَدْرَسَةُ الْإِبْدَاعِ الْعِلْمِيِّ الدَّوْلِيَّةِ", cert.offsetWidth / 2, cert.offsetHeight - 55);
      ctx.font = "11px Nunito, sans-serif";
      ctx.fillText("عَصَافِيرُ الْإِبْدَاعِ تَقْرَأُ", cert.offsetWidth / 2, cert.offsetHeight - 35);

      // Download
      const link = document.createElement("a");
      link.download = `شهادة_${playerName}_رحلة_نوار.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    }
  }, [playerName, score, totalQuestions, stationScores, grade]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "linear-gradient(135deg, #FFFBEB, #FDE68A)" }}>
      <div className="max-w-md w-full">
        {/* Certificate card */}
        <motion.div
          ref={certRef}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 rounded-3xl shadow-2xl overflow-hidden"
          style={{ border: "4px solid #F59E0B" }}
        >
          {/* Inner border */}
          <div className="m-2 rounded-2xl p-6 text-center" style={{ border: "2px solid #D97706" }}>
            {/* Stars decoration */}
            <div className="flex justify-between mb-2">
              <span className="text-2xl">⭐</span>
              <span className="text-2xl">⭐</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-extrabold text-amber-700 mb-1" style={{ fontFamily: "'Tajawal', sans-serif" }}>
              شَهَادَةُ تَقْدِيرٍ
            </h1>
            <p className="text-amber-600 text-sm mb-4" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              Certificate of Achievement
            </p>

            {/* Trophy */}
            <motion.div
              className="text-5xl mb-4"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🏆
            </motion.div>

            {/* Player name */}
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3" style={{ fontFamily: "'Tajawal', sans-serif" }}>
              {playerName}
            </h2>

            {/* Grade */}
            <div className="inline-block bg-amber-200/60 px-6 py-2 rounded-2xl mb-4">
              <p className="text-xl font-bold text-amber-800" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                {grade.emoji} {grade.ar}
              </p>
              <p className="text-sm text-amber-700" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                {grade.en}
              </p>
            </div>

            {/* Score */}
            <div className="bg-white/60 rounded-2xl p-4 mb-4">
              <p className="text-3xl font-bold text-gray-800" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                {score} / {totalQuestions}
              </p>
              <p className="text-sm text-gray-500" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                الدَّرَجَةُ - Score
              </p>
            </div>

            {/* Station breakdown */}
            <div className="space-y-2 mb-4">
              {stations.map((station, i) => (
                <div key={station.id} className="flex items-center justify-between bg-white/40 rounded-xl px-3 py-1.5">
                  <span className="text-sm font-bold" style={{ fontFamily: "'Tajawal', sans-serif", color: station.color }}>
                    {station.icon} {station.nameAr}
                  </span>
                  <span className="text-sm font-bold" style={{ fontFamily: "'Fredoka', sans-serif", color: station.color }}>
                    {stationScores[i]}/{station.questions.length}
                  </span>
                </div>
              ))}
            </div>

            {/* Story name */}
            <p className="text-sm text-gray-500 mb-1" style={{ fontFamily: "'Tajawal', sans-serif" }}>
              قِصَّةُ جَارِنَا السَّيِّدُ مُهِمٌّ
            </p>
            <p className="text-xs text-gray-400 mb-3" style={{ fontFamily: "'Nunito', sans-serif" }}>
              The Story of Our Neighbor Mr. Muhim
            </p>

            {/* School logo and info */}
            <div className="flex items-center justify-center gap-2 opacity-60">
              <img src={IMAGES.logo} alt="" className="h-8 object-contain" />
              <div className="text-right">
                <p className="text-[10px] text-gray-500" style={{ fontFamily: "'Tajawal', sans-serif" }}>عَصَافِيرُ الْإِبْدَاعِ تَقْرَأُ</p>
              </div>
            </div>

            {/* Bottom stars */}
            <div className="flex justify-between mt-2">
              <span className="text-2xl">⭐</span>
              <span className="text-2xl">⭐</span>
            </div>
          </div>
        </motion.div>

        {/* Action buttons */}
        <div className="mt-6 space-y-3">
          <motion.button
            onClick={downloadCertificate}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3.5 rounded-2xl text-white font-bold text-lg shadow-xl"
            style={{
              fontFamily: "'Tajawal', sans-serif",
              background: "linear-gradient(135deg, #16A34A, #15803D)",
              boxShadow: "0 4px 15px rgba(22,163,74,0.4)",
            }}
          >
            📥 حَمِّلِ الشَّهَادَةَ
            <span className="block text-sm font-normal mt-0.5" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              Download Certificate
            </span>
          </motion.button>

          <motion.button
            onClick={resetGame}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 rounded-2xl bg-white text-gray-600 font-bold text-lg shadow-lg border-2 border-gray-200"
            style={{ fontFamily: "'Tajawal', sans-serif" }}
          >
            🔄 الْعَبْ مَرَّةً أُخْرَى
            <span className="block text-sm font-normal text-gray-400 mt-0.5" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              Play Again
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
