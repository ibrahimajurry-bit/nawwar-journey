import { useGame } from "@/contexts/GameContext";
import WelcomeScreen from "@/components/WelcomeScreen";
import StationMap from "@/components/StationMap";
import QuestionScreen from "@/components/QuestionScreen";
import Certificate from "@/components/Certificate";

export default function Home() {
  const { gameStarted, currentStation } = useGame();

  // Welcome screen
  if (!gameStarted) {
    return <WelcomeScreen />;
  }

  // Certificate screen
  if (currentStation === 6) {
    return <Certificate />;
  }

  // Station map (currentStation === 0)
  if (currentStation === 0) {
    return <StationMap />;
  }

  // Question screen (currentStation 1-5)
  return <QuestionScreen />;
}
