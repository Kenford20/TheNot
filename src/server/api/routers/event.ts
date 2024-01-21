import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const eventRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        eventName: z.string().nonempty({ message: "Event name required" }),
        date: z.string().optional(),
        startTime: z.string().optional(),
        endTime: z.string().optional(),
        venue: z.string().optional(),
        attire: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const {
        eventName: name,
        date,
        startTime,
        endTime,
        venue,
        attire,
        description,
      } = input;

      return await ctx.db.event.create({
        data: {
          name,
          userId: ctx.auth.userId,
          date: date ? new Date(date) : undefined,
          startTime,
          endTime,
          venue,
          attire,
          description,
        },
      });
    }),

  getAllByUserId: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.auth.userId) return;
    return await ctx.db.event.findMany({
      where: {
        userId: ctx.auth.userId,
      },
    });
  }),

  update: protectedProcedure
    .input(
      z.object({
        eventName: z.string().nonempty({ message: "Event name required" }),
        date: z.string().optional(),
        startTime: z.string().optional(),
        endTime: z.string().optional(),
        venue: z.string().optional(),
        attire: z.string().optional(),
        description: z.string().optional(),
        eventId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.event.update({
        where: {
          id: input.eventId,
        },
        data: {
          name: input.eventName,
          date: input.date ? new Date(input.date) : undefined,
          startTime: input.startTime,
          endTime: input.endTime,
          venue: input.venue,
          attire: input.attire,
          description: input.description,
        },
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const deletedEvent = await ctx.db.event.delete({
        where: {
          id: input.eventId,
        },
      });

      return deletedEvent.id;
    }),
});
