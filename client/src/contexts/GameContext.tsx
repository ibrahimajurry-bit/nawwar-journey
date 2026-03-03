import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { stations } from "@/lib/gameData";

interface GameState {
  playerName: string;
  currentStation: number; // 0 = map, 1-5 = stations, 6 = certificate
  currentQuestion: number;
  score: number;
  totalQuestions: number;
  stationScores: number[];
  answeredQuestions: Set<number>;
  showFeedback: boolean;
  feedbackCorrect: boolean;
  gameStarted: boolean;
}

interface GameContextType extends GameState {
  setPlayerName: (name: string) => void;
  startGame: () => void;
  goToStation: (station: number) => void;
  answerQuestion: (questionId: number, answerIndex: number) => boolean;
  nextQuestion: () => void;
  goToCertificate: () => void;
  resetGame: () => void;
  dismissFeedback: () => void;
  getStationProgress: (stationIndex: number) => { answered: number; total: number; complete: boolean };
  getFirstUnansweredIndex: (stationIndex: number) => number;
}

const GameContext = createContext<GameContextType | null>(null);

const totalQ = stations.reduce((sum, s) => sum + s.questions.length, 0);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>({
    playerName: "",
    currentStation: 0,
    currentQuestion: 0,
    score: 0,
    totalQuestions: totalQ,
    stationScores: [0, 0, 0, 0, 0],
    answeredQuestions: new Set(),
    showFeedback: false,
    feedbackCorrect: false,
    gameStarted: false,
  });

  const setPlayerName = useCallback((name: string) => {
    setState((s) => ({ ...s, playerName: name }));
  }, []);

  const startGame = useCallback(() => {
    setState((s) => ({ ...s, gameStarted: true, currentStation: 0, currentQuestion: 0 }));
  }, []);

  // Helper: find first unanswered question index in a station
  const getFirstUnansweredIndex = useCallback((stationIndex: number): number => {
    const station = stations[stationIndex];
    if (!station) return 0;
    const idx = station.questions.findIndex((q) => !state.answeredQuestions.has(q.id));
    return idx === -1 ? station.questions.length : idx; // if all answered, return length (triggers complete screen)
  }, [state.answeredQuestions]);

  const getStationProgress = useCallback((stationIndex: number) => {
    const station = stations[stationIndex];
    if (!station) return { answered: 0, total: 0, complete: false };
    const answered = station.questions.filter((q) => state.answeredQuestions.has(q.id)).length;
    return { answered, total: station.questions.length, complete: answered === station.questions.length };
  }, [state.answeredQuestions]);

  const goToStation = useCallback((stationId: number) => {
    if (stationId === 0) {
      // Go to map
      setState((s) => ({ ...s, currentStation: 0, currentQuestion: 0, showFeedback: false }));
      return;
    }
    // When entering a station, jump to first unanswered question
    setState((s) => {
      const stationIndex = stationId - 1;
      const station = stations[stationIndex];
      if (!station) return { ...s, currentStation: 0 };
      const firstUnanswered = station.questions.findIndex((q) => !s.answeredQuestions.has(q.id));
      const qIndex = firstUnanswered === -1 ? station.questions.length : firstUnanswered;
      return { ...s, currentStation: stationId, currentQuestion: qIndex, showFeedback: false };
    });
  }, []);

  const answerQuestion = useCallback((questionId: number, answerIndex: number): boolean => {
    const station = stations.find((s) => s.questions.some((q) => q.id === questionId));
    const question = station?.questions.find((q) => q.id === questionId);
    if (!question || !station) return false;

    const isCorrect = answerIndex === question.correctAnswer;

    setState((s) => {
      // If already answered, don't allow re-answering
      if (s.answeredQuestions.has(questionId)) return s;
      const newAnswered = new Set(s.answeredQuestions);
      newAnswered.add(questionId);
      const newStationScores = [...s.stationScores];
      if (isCorrect) {
        newStationScores[station.id - 1] += 1;
      }
      return {
        ...s,
        score: isCorrect ? s.score + 1 : s.score,
        stationScores: newStationScores,
        answeredQuestions: newAnswered,
        showFeedback: true,
        feedbackCorrect: isCorrect,
      };
    });

    return isCorrect;
  }, []);

  const nextQuestion = useCallback(() => {
    setState((s) => {
      const stationData = stations[s.currentStation - 1];
      if (!stationData) return s;
      // Find next unanswered question after current
      let nextIdx = s.currentQuestion + 1;
      while (nextIdx < stationData.questions.length && s.answeredQuestions.has(stationData.questions[nextIdx].id)) {
        nextIdx++;
      }
      return { ...s, currentQuestion: nextIdx, showFeedback: false };
    });
  }, []);

  const goToCertificate = useCallback(() => {
    setState((s) => ({ ...s, currentStation: 6 }));
  }, []);

  const dismissFeedback = useCallback(() => {
    setState((s) => ({ ...s, showFeedback: false }));
  }, []);

  const resetGame = useCallback(() => {
    setState({
      playerName: "",
      currentStation: 0,
      currentQuestion: 0,
      score: 0,
      totalQuestions: totalQ,
      stationScores: [0, 0, 0, 0, 0],
      answeredQuestions: new Set(),
      showFeedback: false,
      feedbackCorrect: false,
      gameStarted: false,
    });
  }, []);

  return (
    <GameContext.Provider
      value={{
        ...state,
        setPlayerName,
        startGame,
        goToStation,
        answerQuestion,
        nextQuestion,
        goToCertificate,
        resetGame,
        dismissFeedback,
        getStationProgress,
        getFirstUnansweredIndex,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
