import { useState, useEffect } from "react";
import { useGame } from "@/contexts/GameContext";
import { stations, type Question } from "@/lib/gameData";
import { motion, AnimatePresence } from "framer-motion";

function TrueFalseQuestion({ question, onAnswer }: { question: Question; onAnswer: (idx: number) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const { showFeedback, feedbackCorrect } = useGame();

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    onAnswer(idx);
  };

  const btnStyle = (idx: number) => {
    if (selected === null) return {};
    if (idx === question.correctAnswer) return { backgroundColor: "#22C55E", color: "white", borderColor: "#16A34A" };
    if (idx === selected && idx !== question.correctAnswer) return { backgroundColor: "#EF4444", color: "white", borderColor: "#DC2626" };
    return { opacity: 0.5 };
  };

  return (
    <div className="space-y-3">
      <motion.button
        onClick={() => handleSelect(0)}
        disabled={selected !== null}
        whileHover={selected === null ? { scale: 1.02 } : {}}
        whileTap={selected === null ? { scale: 0.98 } : {}}
        className="w-full py-4 rounded-2xl border-2 border-green-300 bg-green-50 font-bold text-lg transition-all"
        style={{ fontFamily: "'Tajawal', sans-serif", ...btnStyle(0) }}
      >
        ✅ صَحٌّ - True
      </motion.button>
      <motion.button
        onClick={() => handleSelect(1)}
        disabled={selected !== null}
        whileHover={selected === null ? { scale: 1.02 } : {}}
        whileTap={selected === null ? { scale: 0.98 } : {}}
        className="w-full py-4 rounded-2xl border-2 border-red-300 bg-red-50 font-bold text-lg transition-all"
        style={{ fontFamily: "'Tajawal', sans-serif", ...btnStyle(1) }}
      >
        ❌ خَطَأٌ - False
      </motion.button>
    </div>
  );
}

function MCQQuestion({ question, onAnswer }: { question: Question; onAnswer: (idx: number) => void }) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    onAnswer(idx);
  };

  const colors = ["#2563EB", "#7C3AED", "#16A34A", "#FF8C00"];

  const btnStyle = (idx: number) => {
    if (selected === null) return { borderColor: colors[idx] + "40", backgroundColor: colors[idx] + "08" };
    if (idx === question.correctAnswer) return { backgroundColor: "#22C55E", color: "white", borderColor: "#16A34A" };
    if (idx === selected && idx !== question.correctAnswer) return { backgroundColor: "#EF4444", color: "white", borderColor: "#DC2626" };
    return { opacity: 0.4, borderColor: "#D1D5DB" };
  };

  return (
    <div className="space-y-3">
      {question.options?.map((opt, idx) => (
        <motion.button
          key={idx}
          onClick={() => handleSelect(idx)}
          disabled={selected !== null}
          whileHover={selected === null ? { scale: 1.02 } : {}}
          whileTap={selected === null ? { scale: 0.98 } : {}}
          className="w-full py-3.5 px-5 rounded-2xl border-2 text-right transition-all"
          style={{ ...btnStyle(idx) }}
        >
          <span className="font-bold text-lg block" style={{ fontFamily: "'Tajawal', sans-serif" }}>
            {opt.ar}
          </span>
          <span className="text-sm opacity-70 block mt-0.5" style={{ fontFamily: "'Nunito', sans-serif" }}>
            {opt.en}
          </span>
        </motion.button>
      ))}
    </div>
  );
}

export default function QuestionScreen() {
  const { currentStation, currentQuestion, answerQuestion, nextQuestion, goToStation, showFeedback, feedbackCorrect, dismissFeedback } = useGame();

  const station = stations[currentStation - 1];
  if (!station) return null;

  const question = station.questions[currentQuestion];
  const isLastQuestion = currentQuestion >= station.questions.length - 1;
  const stationDone = currentQuestion >= station.questions.length;

  const handleAnswer = (answerIndex: number) => {
    if (!question) return;
    answerQuestion(question.id, answerIndex);
  };

  const handleNext = () => {
    dismissFeedback();
    nextQuestion();
  };

  const handleBackToMap = () => {
    dismissFeedback();
    goToStation(0);
  };

  // Station complete screen
  if (stationDone) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: `linear-gradient(135deg, ${station.color}15, ${station.color}05)` }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-6xl mb-4"
          >
            🎉
          </motion.div>
          <h2 className="text-2xl font-extrabold mb-2" style={{ fontFamily: "'Tajawal', sans-serif", color: station.color }}>
            أَحْسَنْتَ!
          </h2>
          <p className="text-gray-500 mb-4" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            Well Done!
          </p>
          <p className="text-lg text-gray-700 mb-6" style={{ fontFamily: "'Tajawal', sans-serif" }}>
            أَكْمَلْتَ مَحَطَّةَ {station.nameAr}
          </p>
          <motion.button
            onClick={handleBackToMap}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3.5 rounded-2xl text-white font-bold text-lg"
            style={{
              fontFamily: "'Tajawal', sans-serif",
              background: `linear-gradient(135deg, ${station.color}, ${station.color}CC)`,
              boxShadow: `0 4px 15px ${station.color}40`,
            }}
          >
            🗺️ عُدْ إِلَى الْخَرِيطَةِ
            <span className="block text-sm font-normal mt-0.5" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              Back to Map
            </span>
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="min-h-screen p-4" style={{ background: `linear-gradient(180deg, ${station.color}12, #FFFBEB)` }}>
      <div className="max-w-lg mx-auto">
        {/* Station header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleBackToMap}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/80 shadow text-gray-600 text-sm"
            style={{ fontFamily: "'Tajawal', sans-serif" }}
          >
            ← الْخَرِيطَة
          </button>
          <div className="flex items-center gap-2 bg-white/80 rounded-xl px-3 py-2 shadow">
            <span className="text-lg">{station.icon}</span>
            <span className="font-bold text-sm" style={{ fontFamily: "'Tajawal', sans-serif", color: station.color }}>
              {station.nameAr}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-white/60 rounded-full h-3 mb-6 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: station.color }}
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / station.questions.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden"
          >
            {/* Question image */}
            {question.image && (
              <div className="h-40 overflow-hidden">
                <img src={question.image} alt="" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="p-6">
              {/* Question number */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: station.color }}
                >
                  {currentQuestion + 1}
                </span>
                <span className="text-xs text-gray-400" style={{ fontFamily: "'Nunito', sans-serif" }}>
                  Question {currentQuestion + 1} of {station.questions.length}
                </span>
              </div>

              {/* Question text */}
              <h3 className="text-xl font-bold text-gray-800 mb-2 leading-relaxed" style={{ fontFamily: "'Tajawal', sans-serif" }}>
                {question.questionAr}
              </h3>
              <p className="text-sm text-gray-400 mb-6" style={{ fontFamily: "'Nunito', sans-serif" }}>
                {question.questionEn}
              </p>

              {/* Answer options */}
              {question.type === "truefalse" ? (
                <TrueFalseQuestion question={question} onAnswer={handleAnswer} />
              ) : (
                <MCQQuestion question={question} onAnswer={handleAnswer} />
              )}

              {/* Feedback & Next button */}
              <AnimatePresence>
                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-5"
                  >
                    <div
                      className={`text-center py-3 rounded-xl mb-3 font-bold text-lg ${
                        feedbackCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                      style={{ fontFamily: "'Tajawal', sans-serif" }}
                    >
                      {feedbackCorrect ? "🌟 إِجَابَةٌ صَحِيحَةٌ! - Correct!" : "💪 حَاوِلْ مَرَّةً أُخْرَى! - Try again next time!"}
                    </div>
                    <motion.button
                      onClick={handleNext}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 rounded-2xl text-white font-bold text-lg"
                      style={{
                        fontFamily: "'Tajawal', sans-serif",
                        background: `linear-gradient(135deg, ${station.color}, ${station.color}CC)`,
                      }}
                    >
                      {isLastQuestion ? "✅ أَنْهِ الْمَحَطَّةَ" : "➡️ السُّؤَالُ التَّالِي"}
                      <span className="block text-xs font-normal mt-0.5" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                        {isLastQuestion ? "Finish Station" : "Next Question"}
                      </span>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Character encouragement */}
        <div className="flex justify-center mt-6">
          <motion.img
            src={station.characterImage}
            alt=""
            className="w-20 h-20 rounded-full object-cover shadow-lg"
            style={{ border: `3px solid ${station.color}` }}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  );
}
