import arcjet, { detectBot, shield, slidingWindow } from "@arcjet/next";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:PREVIEW", "CATEGORY:MONITOR"],
    }),
    slidingWindow({
      mode: "LIVE",
      interval: "1m",
      max: 40,
    }),
  ],
});

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/"]);

export default clerkMiddleware(async (auth, req) => {
  const decision = await aj.protect(req);
  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
    } else if (decision.reason.isBot()) {
      return NextResponse.json({ error: "No bots allowed" }, { status: 403 });
    } else {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
