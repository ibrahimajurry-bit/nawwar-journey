import { useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

const FORGE_API_KEY = import.meta.env.VITE_FRONTEND_FORGE_API_KEY;
const FORGE_API_URL =
  import.meta.env.VITE_FRONTEND_FORGE_API_URL ||
  "https://api.manus.im/v1";

export default function QuizGeneratorApp() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const sendConfig = useCallback(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: "FORGE_CONFIG",
          apiKey: FORGE_API_KEY,
          apiUrl: FORGE_API_URL,
        },
        "*"
      );
    }
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "QUIZ_GEN_READY") {
        sendConfig();
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [sendConfig]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9f2] to-[#e8f4fd]">
      {/* Back button */}
      <div className="p-4">
        <Link
          href="/apps"
          className="inline-flex items-center gap-2 text-[#1b6b2f] hover:text-[#0d3d1a] font-medium transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
          <span>العودة لتطبيقات ASL</span>
        </Link>
      </div>

      {/* Iframe */}
      <iframe
        ref={iframeRef}
        src="/quiz_generator.html"
        className="w-full border-0"
        style={{ height: "calc(100vh - 60px)" }}
        title="مولّد الألعاب التعليمية"
        onLoad={sendConfig}
      />
    </div>
  );
}
