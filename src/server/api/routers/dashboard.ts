import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { formatDateNumber } from "~/app/utils/helpers";

import { type Invitation, type User } from "~/app/utils/shared-types";

export const dashboardRouter = createTRPCRouter({
  getByUserId: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.auth.userId) return null;

    const currentUser: User | null = await ctx.db.user.findFirst({
      where: {
        id: ctx.auth.userId,
      },
    });
    if (!currentUser) return null;

    const households = await ctx.db.household.findMany({
      where: {
        userId: ctx.auth.userId,
      },
      select: {
        guests: {
          orderBy: {
            firstName: "asc",
          },
        },
        id: true,
        address1: true,
        address2: true,
        city: true,
        state: true,
        zipCode: true,
        country: true,
        phone: true,
        email: true,
        notes: true,
        gifts: {
          include: {
            event: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const invitations = await ctx.db.invitation.findMany({
      where: {
        userId: ctx.auth.userId,
      },
    });

    const events = await ctx.db.event.findMany({
      where: {
        userId: ctx.auth.userId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const website = await ctx.db.website.findFirst({
      where: {
        userId: ctx.auth.userId,
      },
    });

    const weddingDate = events.find(
      (event) => event.name === "Wedding Day",
    )?.date;

    const weddingData = {
      website,
      groomFirstName: currentUser.groomFirstName,
      groomLastName: currentUser.groomLastName,
      brideFirstName: currentUser.brideFirstName,
      brideLastName: currentUser.brideLastName,
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
      daysRemaining: 100,
    };

    const dashboardData = {
      weddingData,
      totalGuests: await ctx.db.guest.count({
        where: {
          userId: ctx.auth.userId,
        },
      }),
      totalEvents: events.length,
      households: households.map((household) => {
        return {
          ...household,
          guests: household.guests.map((guest) => {
            return {
              ...guest,
              invitations: invitations.reduce(
                (acc: Invitation[], invitation) => {
                  if (guest.id === invitation.guestId) {
                    acc.push({
                      eventId: invitation.eventId,
                      rsvp: invitation.rsvp,
                    });
                  }
                  return acc;
                },
                [],
              ),
            };
          }),
        };
      }),

      events: events.map((event) => {
        const guestResponses = {
          invited: 0,
          attending: 0,
          declined: 0,
          notInvited: 0,
        };

        invitations.forEach((rsvp) => {
          if (event.id === rsvp.eventId) {
            switch (rsvp.rsvp) {
              case "Invited":
                guestResponses.invited += 1;
                break;
              case "Attending":
                guestResponses.attending += 1;
                break;
              case "Declined":
                guestResponses.declined += 1;
                break;
              default:
                guestResponses.notInvited += 1;
                break;
            }
          }
        });

        return {
          ...event,
          guestResponses,
        };
      }),
    };

    return dashboardData;
  }),
});
