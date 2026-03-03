import { useState } from "react";
import { useGame } from "@/contexts/GameContext";
import { IMAGES } from "@/lib/gameData";
import { motion } from "framer-motion";

export default function WelcomeScreen() {
  const { setPlayerName, startGame, playerName } = useGame();
  const [name, setName] = useState("");

  const handleStart = () => {
    if (name.trim()) {
      setPlayerName(name.trim());
      startGame();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 30%, #FDE68A 70%, #FBBF24 100%)" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg"
      >
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header with gradient */}
          <div className="relative py-8 px-6 text-center" style={{ background: "linear-gradient(135deg, #FF8C00, #FF6B00)" }}>
            <motion.img
              src={IMAGES.bird}
              alt="Bird Mascot"
              className="w-20 h-20 mx-auto mb-3 object-contain"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <h1 className="text-3xl font-extrabold text-white mb-1" style={{ fontFamily: "'Tajawal', sans-serif" }}>
              رِحْلَةُ نَوَّارٍ
            </h1>
            <p className="text-white/90 text-lg" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              Nawwar's Journey
            </p>
          </div>

          {/* Story cover and characters */}
          <div className="px-6 pt-6">
            <div className="flex justify-center gap-3 mb-4">
              <motion.img src={IMAGES.nawwar} alt="Nawwar" className="w-16 h-16 rounded-full object-cover border-3 border-blue-400 shadow-md" whileHover={{ scale: 1.1 }} />
              <motion.img src={IMAGES.mrMuhim} alt="Mr. Muhim" className="w-16 h-16 rounded-full object-cover border-3 border-orange-400 shadow-md" whileHover={{ scale: 1.1 }} />
              <motion.img src={IMAGES.nouriya} alt="Nouriya" className="w-16 h-16 rounded-full object-cover border-3 border-purple-400 shadow-md" whileHover={{ scale: 1.1 }} />
              <motion.img src={IMAGES.saleh} alt="Saleh" className="w-16 h-16 rounded-full object-cover border-3 border-green-400 shadow-md" whileHover={{ scale: 1.1 }} />
            </div>

            <p className="text-center text-gray-600 text-sm mb-2" style={{ fontFamily: "'Tajawal', sans-serif" }}>
              قِصَّةُ جَارِنَا السَّيِّدُ مُهِمٌّ
            </p>
            <p className="text-center text-gray-400 text-xs mb-4" style={{ fontFamily: "'Nunito', sans-serif" }}>
              The Story of Our Neighbor Mr. Muhim
            </p>
          </div>

          {/* Name input */}
          <div className="px-6 pb-8">
            <label className="block text-center mb-2 text-gray-700 font-bold text-lg" style={{ fontFamily: "'Tajawal', sans-serif" }}>
              مَا اسْمُكَ؟
            </label>
            <p className="text-center text-gray-400 text-sm mb-3" style={{ fontFamily: "'Nunito', sans-serif" }}>
              What is your name?
            </p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleStart()}
              placeholder="اكْتُبْ اسْمَكَ هُنَا..."
              className="w-full px-5 py-3 text-center text-lg rounded-2xl border-2 border-orange-200 focus:border-orange-400 focus:outline-none transition-colors bg-orange-50/50"
              style={{ fontFamily: "'Tajawal', sans-serif" }}
              dir="rtl"
            />
            <motion.button
              onClick={handleStart}
              disabled={!name.trim()}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full mt-4 py-3.5 rounded-2xl text-white font-bold text-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                fontFamily: "'Tajawal', sans-serif",
                background: name.trim() ? "linear-gradient(135deg, #FF8C00, #FF6B00)" : "#ccc",
                boxShadow: name.trim() ? "0 4px 15px rgba(255,140,0,0.4)" : "none",
              }}
            >
              ابْدَأِ الرِّحْلَةَ! 🚀
            </motion.button>
            <p className="text-center text-gray-400 text-xs mt-2" style={{ fontFamily: "'Nunito', sans-serif" }}>
              Start the Journey!
            </p>

            {/* School logo */}
            <div className="flex justify-center mt-4">
              <img src={IMAGES.logo} alt="School Logo" className="h-12 object-contain opacity-60" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
