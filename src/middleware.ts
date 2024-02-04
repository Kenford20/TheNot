import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

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
  afterAuth: (auth, req) => {
    // Store current request url in a custom header, which you can read later
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-url", req.nextUrl.pathname);

    return NextResponse.next({
      request: {
        // Apply new request headers
        headers: requestHeaders,
      },
    });
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
