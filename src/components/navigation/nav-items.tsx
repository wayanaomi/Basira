import {
  LayoutDashboard,
  Route,
  ClipboardCheck,
  Trophy,
  Settings,
  ShieldCheck,
  Crown,
} from "lucide-react";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, adminOnly: false },
  { href: "/learn", label: "Learn", icon: Route, adminOnly: false },
  { href: "/mock", label: "Mock Exams", icon: ClipboardCheck, adminOnly: false },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy, adminOnly: false },
  { href: "/settings", label: "Settings", icon: Settings, adminOnly: false },
  { href: "/upgrade", label: "Basira Pro", icon: Crown, adminOnly: false },
  { href: "/admin", label: "Admin", icon: ShieldCheck, adminOnly: true },
] as const;
