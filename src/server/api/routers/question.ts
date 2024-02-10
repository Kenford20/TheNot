/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const questionRouter = createTRPCRouter({
  upsert: protectedProcedure
    .input(
      z.object({
        questionId: z.string().optional(),
        websiteId: z.string().optional().nullish(),
        eventId: z.string().optional().nullish(),
        text: z
          .string()
          .min(1, { message: "Option name should not be empty!" }),
        type: z.string(),
        isRequired: z.boolean().default(false),
        options: z
          .array(
            z.object({
              id: z.string().optional(),
              questionId: z.string().optional(),
              responseCount: z.number().optional(),
              text: z.string(),
              description: z.string(),
            }),
          )
          .optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.question.upsert({
        where: {
          id: input.questionId ?? undefined,
        },
        update: {
          text: input.text,
          type: input.type,
          isRequired: input.isRequired,
        },
        create: {
          eventId: input.eventId ?? undefined,
          websiteId: input.websiteId ?? undefined,
          text: input.text,
          type: input.type,
          isRequired: input.isRequired,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ questionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.question.delete({
        where: {
          id: input.questionId,
        },
      });
    }),
});
