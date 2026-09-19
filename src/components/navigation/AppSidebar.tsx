import Link from "next/link";

import { Logo } from "@/components/brand/Logo";
import { StreakBadge } from "@/components/gamification/StreakBadge";
import { XPBadge } from "@/components/gamification/XPBadge";
import { SignOutButton } from "@/components/navigation/SignOutButton";
import { NAV_ITEMS } from "@/components/navigation/nav-items";

export function AppSidebar({
  userName,
  role,
  streak,
  xp,
}: {
  userName: string;
  role: string;
  streak: number;
  xp: number;
}) {
  const items = NAV_ITEMS.filter((item) => !item.adminOnly || role === "ADMIN");

  return (
    <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r border-ink/10 bg-paper p-6 md:flex">
      <Link href="/dashboard">
        <Logo />
      </Link>

      <div className="mt-6 flex gap-2">
        <StreakBadge streak={streak} size="sm" />
        <XPBadge xp={xp} size="sm" />
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink/70 transition-colors hover:bg-indigo/5 hover:text-indigo"
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-ink/10 pt-4">
        <p className="truncate text-sm font-medium text-ink/80">{userName}</p>
        <SignOutButton className="mt-2 text-xs font-medium text-ink/50 hover:text-alert" />
      </div>
    </aside>
  );
}
