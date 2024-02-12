import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { type User } from "~/app/utils/shared-types";
import { formatDateNumber } from "~/app/utils/helpers";
import { TRPCError } from "@trpc/server";
import { TRPCClientError } from "@trpc/client";

export const websiteRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        partnerFirstName: z.string(),
        partnerLastName: z.string(),
        basePath: z.string(),
        email: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.auth.userId;

      // TODO: needa check for dupes
      const {
        firstName,
        lastName,
        partnerFirstName,
        partnerLastName,
        basePath,
        email,
      } = input;

      const subUrl =
        `${firstName}${lastName}and${partnerFirstName}${partnerLastName}`.toLowerCase();
      const url = `${basePath}/${subUrl}`;

      await ctx.db.event.create({
        data: {
          name: "Wedding Day",
          userId,
        },
      });

      await ctx.db.user.create({
        data: {
          id: userId,
          websiteUrl: url,
          email,
          groomFirstName: firstName,
          groomLastName: lastName,
          brideFirstName: partnerFirstName,
          brideLastName: partnerLastName,
        },
      });

      return ctx.db.website.create({
        data: {
          userId,
          url,
          subUrl,
          generalQuestions: {
            create: [
              {
                text: "Will you be bringing any children under the age of 10?",
                type: "Text",
              },
              {
                text: "Send a note to the couple?",
                type: "Text",
              },
            ],
          },
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        isPasswordEnabled: z.boolean().optional(),
        password: z.string().optional(),
        basePath: z.string().optional(),
        subUrl: z
          .string()
          .regex(
            new RegExp(/^\w+$/),
            "Url should not contain any special characters!",
          )
          .optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const url =
        input.subUrl !== undefined
          ? `${input.basePath}/${input.subUrl}`
          : undefined;

      await ctx.db.user.update({
        where: {
          id: ctx.auth.userId,
        },
        data: {
          websiteUrl: url,
        },
      });

      return await ctx.db.website.update({
        where: {
          userId: ctx.auth.userId,
        },
        data: {
          isPasswordEnabled: input.isPasswordEnabled ?? undefined,
          password: input.password ?? undefined,
          subUrl: input.subUrl,
          url,
        },
      });
    }),

  updateIsRsvpEnabled: protectedProcedure
    .input(
      z.object({
        websiteId: z.string(),
        isRsvpEnabled: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.website.update({
        where: {
          id: input.websiteId,
        },
        data: {
          isRsvpEnabled: input.isRsvpEnabled,
        },
      });
    }),

  getByUserId: publicProcedure.query(async ({ ctx }) => {
    console.log("idz", ctx.auth.userId);
    if (!ctx.auth) return;
    return ctx.db.website.findFirst({
      where: {
        userId: ctx.auth.userId ?? "",
      },
    });
  }),

  getBySubUrl: publicProcedure
    .input(z.object({ subUrl: z.string().nullish() }))
    .query(async ({ ctx, input }) => {
      if (input.subUrl === undefined) return null;
      return await ctx.db.website.findFirst({
        where: {
          subUrl: input.subUrl ?? "",
        },
      });
    }),

  fetchWeddingData: publicProcedure
    .input(z.object({ subUrl: z.string() }))
    .query(async ({ ctx, input }) => {
      const currentWebsite = await ctx.db.website.findFirst({
        where: {
          subUrl: input.subUrl,
        },
      });

      if (currentWebsite === null) {
        throw new TRPCClientError("This website does not exist.");
      }

      const weddingUser: User | null = await ctx.db.user.findFirst({
        where: {
          id: currentWebsite.userId,
        },
      });

      if (!weddingUser) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch wedding website data.",
        });
      }

      const events = await ctx.db.event.findMany({
        where: {
          userId: currentWebsite.userId,
        },
      });

      const weddingDate = events.find(
        (event) => event.name === "Wedding Day",
      )?.date;

      const weddingData = {
        groomFirstName: weddingUser.groomFirstName,
        groomLastName: weddingUser.groomLastName,
        brideFirstName: weddingUser.brideFirstName,
        brideLastName: weddingUser.brideLastName,
        date: {
          standardFormat:
            weddingDate?.toLocaleDateString("en-us", {
              weekday: "long",
              year: "numeric",
              month: "short",
              day: "numeric",
            }) ?? "October 30, 2024",
          numberFormat: formatDateNumber(weddingDate) ?? "10.30.2024",
        },
        password: currentWebsite.password,
        daysRemaining: 100,
        events,
      };

      return weddingData;
    }),

  submitRsvpForm: protectedProcedure
    .input(
      z.object({
        rsvpResponses: z.array(
          z.object({
            eventId: z.string(),
            guestId: z.number(),
            rsvp: z.string(),
          }),
        ),
        answersToQuestions: z.array(
          z.object({
            guestId: z.number(),
            questionId: z.string(),
            response: z.object({
              type: z.string(),
              answer: z.string().optional(),
            }),
            selectedOptionId: z.string().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await Promise.all(
        input.rsvpResponses.map(async (response) => {
          await ctx.db.invitation.update({
            where: {
              invitationId: {
                guestId: response.guestId,
                eventId: response.eventId,
              },
            },
            data: {
              rsvp: response.rsvp,
            },
          });
        }),
      );
      // TODO: will need to mutate Answer and OptionResponse tables
    }),
});
