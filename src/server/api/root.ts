import { createTRPCRouter } from "~/server/api/trpc";
import { websiteRouter } from "./routers/website";
import { dashboardRouter } from "./routers/dashboard";
import { guestRouter } from "./routers/guest";
import { eventRouter } from "./routers/event";
import { householdRouter } from "./routers/household";
import { giftRouter } from "./routers/gift";
import { userRouter } from "./routers/user";
import { invitationRouter } from "./routers/invitation";
import { questionRouter } from "./routers/question";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  website: websiteRouter,
  dashboard: dashboardRouter,
  guest: guestRouter,
  event: eventRouter,
  invitation: invitationRouter,
  user: userRouter,
  household: householdRouter,
  gift: giftRouter,
  question: questionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
