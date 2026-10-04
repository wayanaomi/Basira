import type { NextAuthConfig } from "next-auth";

// Edge-safe config: no Prisma adapter, no bcrypt, no providers that touch the
// database directly. Imported by both auth.ts and middleware.ts.
export const authConfig = {
  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  providers: [],

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      const isAdminRoute = pathname.startsWith("/admin");

      const protectedPaths = [
        "/dashboard",
        "/onboarding",
        "/learn",
        "/mock",
        "/leaderboard",
        "/performance",
        "/recommendations",
        "/wrong-answers",
        "/mock-analysis",
        "/settings",
      ];

      const isProtected = protectedPaths.some((path) =>
        pathname.startsWith(path),
      );

      // Admin routes require both authentication and ADMIN role.
      if (isAdminRoute) {
        return isLoggedIn && auth?.user?.role === "ADMIN";
      }

      if (isProtected) {
        return isLoggedIn;
      }

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