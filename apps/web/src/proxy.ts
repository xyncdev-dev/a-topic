import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publishableKey =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  process.env.CLERK_PUBLISHABLE_KEY ||
  "pk_test_bW9kZXJuLWdyb3VwZXItNDYwMC5jbGVyay5hY2NvdW50cy5kZXYk";

const secretKey =
  process.env.CLERK_SECRET_KEY ||
  "sk_test_9c9CX7CuMlAqHjFBVLmVnZ3l5mx1MSzxaR7jySivOa";

export default function proxy(req: NextRequest, event: any) {
  try {
    return clerkMiddleware({
      publishableKey,
      secretKey,
    })(req, event);
  } catch (err) {
    console.error("Clerk proxy error, passing through:", err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
