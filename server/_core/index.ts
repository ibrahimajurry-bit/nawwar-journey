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
      const { questionsText, prompt } = req.body;
      const inputText = questionsText || prompt;
      if (!inputText || typeof inputText !== 'string') {
        return res.status(400).json({ error: 'questionsText is required' });
      }

      const systemPrompt = `أنت محلل أسئلة تعليمية. مهمتك تحويل الأسئلة النصية إلى مصفوفة JSON.

القواعد:
1. كل سؤال اختيار من متعدد يكون بالشكل: {"id": رقم, "type": "mc", "question": "نص السؤال", "options": ["خيار1", "خيار2", "خيار3", "خيار4"], "correct": رقم_فهرس_الإجابة_الصحيحة}
2. كل سؤال صح/خطأ يكون بالشكل: {"id": رقم, "type": "tf", "question": "نص السؤال", "correct": true أو false}
3. فهرس الإجابة الصحيحة يبدأ من 0
4. أرجع فقط مصفوفة JSON بدون أي نص إضافي
5. إذا كانت الإجابة الصحيحة مؤشرة بعلامة ✓ أو ✅ استخدمها
6. إذا لم تكن الإجابة محددة، اختر الإجابة الأكثر منطقية`;

      const result = await invokeLLM({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `حلل الأسئلة التالية وحولها إلى مصفوفة JSON:\n\n${inputText}` },
        ],
        max_tokens: 16000,
      });
      const content = result.choices?.[0]?.message?.content;
      const textContent = typeof content === 'string' ? content :
        Array.isArray(content) ? content.filter((c: any) => c.type === 'text').map((c: any) => c.text).join('') : '';
      
      // Parse the JSON response
      let questions = [];
      try {
        // Try to extract JSON array from the response
        const jsonMatch = textContent.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (jsonMatch) {
          questions = JSON.parse(jsonMatch[0]);
        } else {
          questions = JSON.parse(textContent);
        }
      } catch (parseErr) {
        console.error('[Quiz Parse Error]', parseErr);
        return res.json({ questions: [], error: 'Failed to parse AI response' });
      }
      
      res.json({ questions });
    } catch (error: any) {
      console.error('[Quiz Generate Error]', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });
  // REST API endpoint for saving generated quiz to S3 + DB
  app.post('/api/quiz/save', async (req, res) => {
    try {
      const { title, grade, htmlContent, createdBy } = req.body;
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
          createdBy: createdBy || null,
        });
      }
      
      res.json({ success: true, url });
    } catch (error: any) {
      console.error('[Quiz Save Error]', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

  // REST API endpoint for listing generated quizzes
  // ?user=username - filter by creator (teachers see only their own)
  // ?user=__all__ - owner sees all quizzes
  app.get('/api/quiz/list', async (req, res) => {
    try {
      const { getDb } = await import('../db');
      const { generatedQuizzes } = await import('../../drizzle/schema');
      const { desc, eq } = await import('drizzle-orm');
      
      const db = await getDb();
      if (!db) {
        return res.json({ quizzes: [] });
      }
      
      const userFilter = req.query.user as string | undefined;
      
      let quizzes;
      if (userFilter && userFilter !== '__all__') {
        // Teacher: show only their quizzes
        quizzes = await db.select().from(generatedQuizzes)
          .where(eq(generatedQuizzes.createdBy, userFilter))
          .orderBy(desc(generatedQuizzes.createdAt));
      } else {
        // Owner or no filter: show all quizzes
        quizzes = await db.select().from(generatedQuizzes).orderBy(desc(generatedQuizzes.createdAt));
      }
      res.json({ quizzes });
    } catch (error: any) {
      console.error('[Quiz List Error]', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

  // REST API endpoint for deleting a quiz (owner only)
  // Owner is identified by ?user=admin2009 query param (simple auth)
  app.delete('/api/quiz/:id', async (req, res) => {
    try {
      const requestUser = req.query.user as string | undefined;
      // Only the owner (admin2009) can delete quizzes
      if (requestUser !== 'admin2009') {
        return res.status(403).json({ error: 'Only the site owner can delete quizzes' });
      }

      const quizId = parseInt(req.params.id);
      if (isNaN(quizId)) {
        return res.status(400).json({ error: 'Invalid quiz ID' });
      }

      const { getDb } = await import('../db');
      const { generatedQuizzes } = await import('../../drizzle/schema');
      const { eq } = await import('drizzle-orm');

      const db = await getDb();
      if (!db) {
        return res.status(500).json({ error: 'Database not available' });
      }

      await db.delete(generatedQuizzes).where(eq(generatedQuizzes.id, quizId));
      res.json({ success: true });
    } catch (error: any) {
      console.error('[Quiz Delete Error]', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

  // Teacher Registration endpoint
  app.post('/api/teacher/register', async (req, res) => {
    try {
      const { name, email, whatsapp, password } = req.body;
      if (!name || !email || !whatsapp || !password) {
        return res.status(400).json({ error: 'All fields are required' });
      }
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      const { getDb } = await import('../db');
      const { registeredTeachers } = await import('../../drizzle/schema');
      const { eq } = await import('drizzle-orm');
      const bcrypt = await import('bcryptjs');

      const db = await getDb();
      if (!db) return res.status(500).json({ error: 'Database not available' });

      // Check if email already exists
      const existing = await db.select().from(registeredTeachers).where(eq(registeredTeachers.email, email.toLowerCase()));
      if (existing.length > 0) {
        return res.status(409).json({ error: 'Email already registered' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      await db.insert(registeredTeachers).values({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        whatsapp: whatsapp.trim(),
        passwordHash,
      });

      // Send notification to owner about new teacher registration
      try {
        const { notifyOwner } = await import('./notification');
        await notifyOwner({
          title: `معلم جديد: ${name.trim()}`,
          content: `تم تسجيل معلم جديد في المنصة:\nالاسم: ${name.trim()}\nالإيميل: ${email}\nواتساب: ${whatsapp}`,
        });
      } catch (notifErr) {
        console.warn('[Notification] Failed to notify about new teacher:', notifErr);
      }

      res.json({ success: true, name: name.trim() });
    } catch (error: any) {
      console.error('[Teacher Register Error]', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

  // Teacher Email Login endpoint
  app.post('/api/teacher/login-email', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const { getDb } = await import('../db');
      const { registeredTeachers } = await import('../../drizzle/schema');
      const { eq } = await import('drizzle-orm');
      const bcrypt = await import('bcryptjs');

      const db = await getDb();
      if (!db) return res.status(500).json({ error: 'Database not available' });

      const teachers = await db.select().from(registeredTeachers).where(eq(registeredTeachers.email, email.toLowerCase()));
      if (teachers.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const teacher = teachers[0];
      if (teacher.approved !== 'approved') {
        return res.status(403).json({ error: 'Account pending approval' });
      }

      const valid = await bcrypt.compare(password, teacher.passwordHash);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      res.json({ success: true, name: teacher.name, email: teacher.email });
    } catch (error: any) {
      console.error('[Teacher Email Login Error]', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

  // Admin API: List all registered teachers (owner only)
  app.get('/api/admin/teachers', async (req, res) => {
    try {
      const requestUser = req.query.user as string | undefined;
      if (requestUser !== 'admin2009') {
        return res.status(403).json({ error: 'Unauthorized' });
      }
      const { getDb } = await import('../db');
      const { registeredTeachers } = await import('../../drizzle/schema');
      const { desc } = await import('drizzle-orm');
      const db = await getDb();
      if (!db) return res.json({ teachers: [] });
      const teachers = await db.select({
        id: registeredTeachers.id,
        name: registeredTeachers.name,
        email: registeredTeachers.email,
        whatsapp: registeredTeachers.whatsapp,
        approved: registeredTeachers.approved,
        createdAt: registeredTeachers.createdAt,
      }).from(registeredTeachers).orderBy(desc(registeredTeachers.createdAt));
      res.json({ teachers });
    } catch (error: any) {
      console.error('[Admin Teachers List Error]', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

  // Admin API: Delete a teacher (owner only)
  app.delete('/api/admin/teachers/:id', async (req, res) => {
    try {
      const requestUser = req.query.user as string | undefined;
      if (requestUser !== 'admin2009') {
        return res.status(403).json({ error: 'Unauthorized' });
      }
      const teacherId = parseInt(req.params.id);
      if (isNaN(teacherId)) return res.status(400).json({ error: 'Invalid teacher ID' });
      const { getDb } = await import('../db');
      const { registeredTeachers } = await import('../../drizzle/schema');
      const { eq } = await import('drizzle-orm');
      const db = await getDb();
      if (!db) return res.status(500).json({ error: 'Database not available' });
      await db.delete(registeredTeachers).where(eq(registeredTeachers.id, teacherId));
      res.json({ success: true });
    } catch (error: any) {
      console.error('[Admin Delete Teacher Error]', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

  // Admin API: Update teacher approval status (owner only)
  app.patch('/api/admin/teachers/:id', async (req, res) => {
    try {
      const requestUser = req.query.user as string | undefined;
      if (requestUser !== 'admin2009') {
        return res.status(403).json({ error: 'Unauthorized' });
      }
      const teacherId = parseInt(req.params.id);
      const { approved } = req.body;
      if (isNaN(teacherId)) return res.status(400).json({ error: 'Invalid teacher ID' });
      if (!['pending', 'approved', 'rejected'].includes(approved)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      const { getDb } = await import('../db');
      const { registeredTeachers } = await import('../../drizzle/schema');
      const { eq } = await import('drizzle-orm');
      const db = await getDb();
      if (!db) return res.status(500).json({ error: 'Database not available' });
      await db.update(registeredTeachers).set({ approved }).where(eq(registeredTeachers.id, teacherId));
      res.json({ success: true });
    } catch (error: any) {
      console.error('[Admin Update Teacher Error]', error);
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
