import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { z } from "zod";

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
