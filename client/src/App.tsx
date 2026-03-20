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
import GamesPage from "./pages/GamesPage";
import IsharaQuiz from "./pages/IsharaQuiz";
import QuizGeneratorApp from "./pages/QuizGeneratorApp";
import TeacherLogin from "./pages/TeacherLogin";
import AdminDashboard from "./pages/AdminDashboard";

function ProtectedRouter() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/games" component={GamesPage} />
      <Route path="/games/nawwar" component={Home} />
      <Route path="/games/ishara" component={IsharaQuiz} />
      <Route path="/apps/qr-generator" component={QRGenerator} />
      <Route path="/apps/quiz-generator" component={QuizGeneratorApp} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function Router() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loggedIn = localStorage.getItem("teacherLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a6b3c] via-[#1e7a44] to-[#1b5e8a]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <TeacherLogin
        onLogin={() => {
          setIsLoggedIn(true);
        }}
      />
    );
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
