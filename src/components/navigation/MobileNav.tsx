import Link from "next/link";
import { NAV_ITEMS } from "@/components/navigation/nav-items";

export function MobileNav({ role }: { role: string }) {
  const items = NAV_ITEMS.filter(
    (item) => (!item.adminOnly || role === "ADMIN") && item.href !== "/settings",
  );

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-ink/10 bg-paper md:hidden">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-ink/60"
        >
          <item.icon className="h-5 w-5" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
