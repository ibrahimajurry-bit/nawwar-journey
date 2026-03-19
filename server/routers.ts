import { getSessionCookieOptions } from "./_core/cookies";
import { COOKIE_NAME } from "@shared/const";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { z } from "zod";
import { getDb } from "./db";
import { teacherAccounts } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  teacher: router({
    register: publicProcedure
      .input(z.object({
        schoolName: z.string().min(1),
        password: z.string().min(6),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) return { success: false, message: 'Database unavailable' };
        
        const passwordHash = crypto.createHash('sha256').update(input.password).digest('hex');
        const existing = await db.select().from(teacherAccounts).where(eq(teacherAccounts.schoolName, input.schoolName)).limit(1);
        if (existing.length > 0) {
          return { success: false, message: 'School name already registered' };
        }
        await db.insert(teacherAccounts).values({
          schoolName: input.schoolName,
          passwordHash,
          isPremium: 0,
        });
        return { success: true };
      }),
    login: publicProcedure
      .input(z.object({
        schoolName: z.string().min(1),
        password: z.string().min(6),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) return { success: false, message: 'Database unavailable' };
        
        const passwordHash = crypto.createHash('sha256').update(input.password).digest('hex');
        const result = await db.select().from(teacherAccounts).where(eq(teacherAccounts.schoolName, input.schoolName)).limit(1);
        const teacher = result.length > 0 ? result[0] : null;
        
        if (!teacher || teacher.passwordHash !== passwordHash) {
          return { success: false, message: 'Invalid credentials' };
        }
        return { success: true, id: teacher.id, schoolName: teacher.schoolName, isPremium: teacher.isPremium === 1 };
      }),
  }),

  quiz: router({
    generate: publicProcedure
      .input(z.object({
        prompt: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        const result = await invokeLLM({
          messages: [
            { role: "system", content: "أنت مساعد تعليمي متخصص في إنشاء ألعاب تعليمية تفاعلية باللغة العربية. أجب دائماً بصيغة JSON صالحة." },
            { role: "user", content: input.prompt },
          ],
          max_tokens: 16000,
        });

        const content = result.choices?.[0]?.message?.content;
        const textContent = typeof content === 'string' ? content : 
          Array.isArray(content) ? content.filter(c => c.type === 'text').map(c => (c as any).text).join('') : '';
        
        return { content: textContent };
      }),
  }),
});

export type AppRouter = typeof appRouter;
