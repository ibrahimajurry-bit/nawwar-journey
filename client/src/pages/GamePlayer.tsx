/**
 * GamePlayer - Serves a game via a clean URL like /games/play/:id
 * Fetches the game HTML from the server and renders it in an iframe
 * Students can access this directly without login
 */
import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { Loader2 } from "lucide-react";

export default function GamePlayer() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [gameUrl, setGameUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setError("رابط اللعبة غير صحيح");
      setLoading(false);
      return;
    }
    fetch(`/api/quiz/${id}/url`)
      .then((res) => {
        if (!res.ok) throw new Error("اللعبة غير موجودة");
        return res.json();
      })
      .then((data) => {
        if (data.url) {
          setGameUrl(data.url);
        } else {
          setError("اللعبة غير موجودة");
        }
      })
      .catch((err) => {
        setError(err.message || "حدث خطأ");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a6b3c] to-[#1b5e8a]">
        <div className="text-center text-white">
          <Loader2 className="animate-spin w-12 h-12 mx-auto mb-4" />
          <p style={{ fontFamily: "'Tajawal', sans-serif" }}>جاري تحميل اللعبة...</p>
        </div>
      </div>
    );
  }

  if (error || !gameUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a6b3c] to-[#1b5e8a]">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">🎮</div>
          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Tajawal', sans-serif" }}>
            {error || "اللعبة غير موجودة"}
          </h1>
          <p className="text-white/70 text-sm" style={{ fontFamily: "'Tajawal', sans-serif" }}>
            تحقق من الرابط وحاول مرة أخرى
          </p>
        </div>
      </div>
    );
  }

  // Render the game in a full-screen iframe
  return (
    <div className="w-full h-screen">
      <iframe
        src={gameUrl}
        className="w-full h-full border-0"
        title="Educational Game"
        allow="fullscreen"
      />
    </div>
  );
}
