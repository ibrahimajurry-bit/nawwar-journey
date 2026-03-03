import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { stations } from "@/lib/gameData";

interface GameState {
  playerName: string;
  currentStation: number; // 0 = welcome, 1-5 = stations, 6 = certificate
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
    setState((s) => ({ ...s, gameStarted: true, currentStation: 1, currentQuestion: 0 }));
  }, []);

  const goToStation = useCallback((station: number) => {
    setState((s) => ({ ...s, currentStation: station, currentQuestion: 0, showFeedback: false }));
  }, []);

  const answerQuestion = useCallback((questionId: number, answerIndex: number): boolean => {
    const station = stations.find((s) => s.questions.some((q) => q.id === questionId));
    const question = station?.questions.find((q) => q.id === questionId);
    if (!question || !station) return false;

    const isCorrect = answerIndex === question.correctAnswer;

    setState((s) => {
      if (s.answeredQuestions.has(questionId)) return { ...s, showFeedback: true, feedbackCorrect: isCorrect };
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
      const nextQ = s.currentQuestion + 1;
      if (nextQ >= stationData.questions.length) {
        // Station complete - go to map
        const nextStation = s.currentStation < 5 ? 0 : 0;
        return { ...s, currentQuestion: nextQ, showFeedback: false };
      }
      return { ...s, currentQuestion: nextQ, showFeedback: false };
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
