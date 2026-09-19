import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Edge-safe entry point — never import "@/auth" (Node-only, Prisma/bcrypt) here.
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/learn/:path*",
    "/mock/:path*",
    "/admin/:path*",
    "/settings/:path*",
  ],
};
