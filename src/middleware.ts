import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  publicRoutes: (req) => {
    const protectedRoutes = ["/dashboard", "/guest-list"];
    return protectedRoutes.every((route) => !req.url.includes(route));
  },
  ignoredRoutes: [],
  //   debug: true,
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
