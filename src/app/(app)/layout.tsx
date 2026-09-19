import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getUserXpTotal } from "@/lib/gamification";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { MobileNav } from "@/components/navigation/MobileNav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [profile, streak, xp] = await Promise.all([
    prisma.studentProfile.findUnique({ where: { userId: session.user.id } }),
    prisma.streak.findUnique({ where: { userId: session.user.id } }),
    getUserXpTotal(session.user.id),
  ]);

  if (!profile?.onboardingCompletedAt) redirect("/onboarding");

  return (
    <div className="flex min-h-screen bg-mist">
      <AppSidebar
        userName={session.user.name ?? "Student"}
        role={session.user.role}
        streak={streak?.currentStreak ?? 0}
        xp={xp}
      />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <MobileNav role={session.user.role} />
    </div>
  );
}
