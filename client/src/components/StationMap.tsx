import { useGame } from "@/contexts/GameContext";
import { stations, IMAGES } from "@/lib/gameData";
import { motion } from "framer-motion";

export default function StationMap() {
  const { goToStation, stationScores, answeredQuestions, score, totalQuestions, playerName, goToCertificate, getStationProgress } = useGame();

  const isStationComplete = (stationIndex: number) => {
    return getStationProgress(stationIndex).complete;
  };

  const isStationUnlocked = (stationIndex: number) => {
    if (stationIndex === 0) return true;
    return isStationComplete(stationIndex - 1);
  };

  const allComplete = stations.every((_, i) => isStationComplete(i));
  const totalAnswered = stations.reduce((sum, _, i) => sum + getStationProgress(i).answered, 0);
  const overallPct = Math.round((totalAnswered / totalQuestions) * 100);

  const handleStationClick = (stationId: number, stationIndex: number) => {
    const unlocked = isStationUnlocked(stationIndex);
    const complete = isStationComplete(stationIndex);
    if (!unlocked) return;
    // If station is complete, don't allow re-entry
    if (complete) return;
    goToStation(stationId);
  };

  return (
    <div className="min-h-screen p-4" style={{ background: "linear-gradient(180deg, #87CEEB 0%, #E0F2FE 30%, #FFFBEB 60%, #FEF3C7 100%)" }}>
      {/* Header */}
      <div className="max-w-lg mx-auto mb-4">
        <div className="flex items-center justify-between bg-white/80 backdrop-blur rounded-2xl px-4 py-3 shadow-lg">
          <div className="flex items-center gap-2">
            <img src={IMAGES.bird} alt="" className="w-8 h-8 object-contain" />
            <div>
              <p className="text-sm font-bold text-gray-800" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                مَرْحَبًا {playerName}!
              </p>
              <p className="text-xs text-gray-500" style={{ fontFamily: "'Nunito', sans-serif" }}>
                Welcome {playerName}!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-amber-100 px-3 py-1.5 rounded-xl">
            <span className="text-lg">⭐</span>
            <span className="font-bold text-amber-700" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              {score}/{totalQuestions}
            </span>
          </div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="max-w-lg mx-auto mb-4">
        <div className="bg-white/70 backdrop-blur rounded-2xl px-4 py-3 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-gray-700" style={{ fontFamily: "'Tajawal', sans-serif" }}>
              التَّقَدُّمُ الْعَامُّ
            </span>
            <span className="text-sm font-bold text-amber-600" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              {overallPct}%
            </span>
          </div>
          <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #FBBF24, #F59E0B, #D97706)" }}
              initial={{ width: 0 }}
              animate={{ width: `${overallPct}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1 text-center" style={{ fontFamily: "'Nunito', sans-serif" }}>
            Overall Progress - {totalAnswered} of {totalQuestions} questions answered
          </p>
        </div>
      </div>

      {/* Map Title */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold text-gray-800" style={{ fontFamily: "'Tajawal', sans-serif" }}>
          خَرِيطَةُ الرِّحْلَةِ
        </h2>
        <p className="text-gray-500 text-sm" style={{ fontFamily: "'Fredoka', sans-serif" }}>
          Journey Map
        </p>
      </div>

      {/* Stations Path */}
      <div className="max-w-sm mx-auto space-y-4">
        {stations.map((station, index) => {
          const complete = isStationComplete(index);
          const unlocked = isStationUnlocked(index);
          const progress = getStationProgress(index);
          const stationScore = stationScores[index];
          const totalStationQ = station.questions.length;
          const stationPct = Math.round((progress.answered / progress.total) * 100);

          return (
            <motion.div
              key={station.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15, duration: 0.4 }}
            >
              {/* Connector line */}
              {index > 0 && (
                <div className="flex justify-center -mt-4 mb-1">
                  <div className={`w-1 h-6 rounded-full ${isStationComplete(index - 1) ? "bg-green-400" : "bg-gray-300"}`} />
                </div>
              )}

              <motion.button
                onClick={() => handleStationClick(station.id, index)}
                disabled={!unlocked || complete}
                whileHover={unlocked && !complete ? { scale: 1.03 } : {}}
                whileTap={unlocked && !complete ? { scale: 0.97 } : {}}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                  complete
                    ? "bg-white shadow-lg border-2 border-green-400"
                    : unlocked
                    ? "bg-white shadow-lg border-2 border-transparent hover:shadow-xl"
                    : "bg-gray-100 opacity-60 cursor-not-allowed"
                }`}
                style={unlocked && !complete ? { borderColor: station.color + "40" } : {}}
              >
                {/* Station icon */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
                  style={{ backgroundColor: unlocked ? station.color + "20" : "#e5e7eb" }}
                >
                  {complete ? "✅" : unlocked ? station.icon : "🔒"}
                </div>

                {/* Station info */}
                <div className="flex-1 text-right">
                  <p className="font-bold text-gray-800" style={{ fontFamily: "'Tajawal', sans-serif", color: unlocked ? station.color : "#9CA3AF" }}>
                    {station.nameAr}
                  </p>
                  <p className="text-xs text-gray-500" style={{ fontFamily: "'Nunito', sans-serif" }}>
                    {station.nameEn}
                  </p>
                  {/* Progress info */}
                  {unlocked && (
                    <div className="mt-1.5">
                      {complete ? (
                        <div className="flex items-center gap-1.5 justify-end">
                          <span className="text-xs text-green-600 font-bold" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                            ⭐ {stationScore}/{totalStationQ}
                          </span>
                          <span className="text-[10px] text-green-500 bg-green-100 px-2 py-0.5 rounded-full" style={{ fontFamily: "'Nunito', sans-serif" }}>
                            Complete ✓
                          </span>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2 justify-end">
                            <span className="text-[11px] text-gray-500" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                              {progress.answered}/{progress.total}
                            </span>
                            <div className="w-16 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{ width: `${stationPct}%`, backgroundColor: station.color }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Character avatar */}
                <img
                  src={station.characterImage}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover shrink-0"
                  style={{
                    border: `2px solid ${unlocked ? station.color : "#D1D5DB"}`,
                    filter: unlocked ? "none" : "grayscale(100%)",
                  }}
                />
              </motion.button>
            </motion.div>
          );
        })}

        {/* Certificate button */}
        {allComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="pt-4"
          >
            <div className="flex justify-center mb-2">
              <div className="w-1 h-6 rounded-full bg-amber-400" />
            </div>
            <motion.button
              onClick={goToCertificate}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-4 rounded-2xl text-white font-bold text-xl shadow-xl"
              style={{
                fontFamily: "'Tajawal', sans-serif",
                background: "linear-gradient(135deg, #FBBF24, #F59E0B, #D97706)",
                boxShadow: "0 6px 20px rgba(251,191,36,0.5)",
              }}
            >
              🏆 اعْرِضِ الشَّهَادَةَ!
              <span className="block text-sm font-normal mt-1" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                View Certificate!
              </span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
