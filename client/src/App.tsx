import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { GameProvider } from "./contexts/GameContext";
import { useEffect, useState } from "react";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import QRGenerator from "./pages/QRGenerator";
import AppsPage from "./pages/AppsPage";
import GamesPage from "./pages/GamesPage";
import StoriesPage from "./pages/StoriesPage";
import IsharaQuiz from "./pages/IsharaQuiz";
import QuizGeneratorApp from "./pages/QuizGeneratorApp";
import OwnerLogin from "./pages/OwnerLogin";

function ProtectedRouter() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/apps" component={AppsPage} />
      <Route path="/games" component={GamesPage} />
      <Route path="/stories" component={StoriesPage} />
      <Route path="/games/nawwar" component={Home} />
      <Route path="/games/ishara" component={IsharaQuiz} />
      <Route path="/apps/qr-generator" component={QRGenerator} />
      <Route path="/apps/quiz-generator" component={QuizGeneratorApp} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function Router() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loggedIn = localStorage.getItem('ownerLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isLoggedIn) {
    return <OwnerLogin />;
  }

  return <ProtectedRouter />;
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <GameProvider>
            <Toaster />
            <Router />
          </GameProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
