import type { NextAuthConfig } from "next-auth";

// Edge-safe config: no Prisma adapter, no bcrypt, no providers that touch the
// database directly. Imported by both `auth.ts` (full config) and
// `middleware.ts` (Edge runtime) so the proxy layer never pulls in Node-only
// code.
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const protectedPaths = [
        "/dashboard",
        "/onboarding",
        "/learn",
        "/mock",
        "/admin",
        "/settings",
      ];
      const isProtected = protectedPaths.some((path) =>
        nextUrl.pathname.startsWith(path),
      );

      if (isProtected) return isLoggedIn;
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "STUDENT";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) ?? "STUDENT";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
