import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

  // REST API endpoint for quiz generation (used by iframe)
  app.post('/api/quiz/generate', async (req, res) => {
    try {
      const { invokeLLM } = await import('./llm');
      const { prompt } = req.body;
      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'prompt is required' });
      }
      const result = await invokeLLM({
        messages: [
          { role: 'system', content: 'أنت مساعد تعليمي متخصص في إنشاء ألعاب تعليمية تفاعلية باللغة العربية. أجب دائماً بصيغة JSON صالحة.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 16000,
      });
      const content = result.choices?.[0]?.message?.content;
      const textContent = typeof content === 'string' ? content :
        Array.isArray(content) ? content.filter((c: any) => c.type === 'text').map((c: any) => c.text).join('') : '';
      res.json({ content: textContent });
    } catch (error: any) {
      console.error('[Quiz Generate Error]', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });
  // REST API endpoint for saving generated quiz to S3 + DB
  app.post('/api/quiz/save', async (req, res) => {
    try {
      const { title, grade, htmlContent } = req.body;
      if (!title || !grade || !htmlContent) {
        return res.status(400).json({ error: 'title, grade, and htmlContent are required' });
      }
      const { storagePut } = await import('../storage');
      const { getDb } = await import('../db');
      const { generatedQuizzes } = await import('../../drizzle/schema');
      const { nanoid } = await import('nanoid');
      
      const fileKey = `quizzes/${nanoid(12)}.html`;
      const { url } = await storagePut(fileKey, htmlContent, 'text/html; charset=utf-8');
      
      const db = await getDb();
      if (db) {
        await db.insert(generatedQuizzes).values({
          title,
          grade,
          storageUrl: url,
          storageKey: fileKey,
        });
      }
      
      res.json({ success: true, url });
    } catch (error: any) {
      console.error('[Quiz Save Error]', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

  // REST API endpoint for listing generated quizzes
  app.get('/api/quiz/list', async (req, res) => {
    try {
      const { getDb } = await import('../db');
      const { generatedQuizzes } = await import('../../drizzle/schema');
      const { desc } = await import('drizzle-orm');
      
      const db = await getDb();
      if (!db) {
        return res.json({ quizzes: [] });
      }
      
      const quizzes = await db.select().from(generatedQuizzes).orderBy(desc(generatedQuizzes.createdAt));
      res.json({ quizzes });
    } catch (error: any) {
      console.error('[Quiz List Error]', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
