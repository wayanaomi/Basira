import {
  LayoutDashboard,
  Route,
  ClipboardCheck,
  Settings,
  ShieldCheck,
} from "lucide-react";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, adminOnly: false },
  { href: "/learn", label: "Learn", icon: Route, adminOnly: false },
  { href: "/mock", label: "Mock Exams", icon: ClipboardCheck, adminOnly: false },
  { href: "/settings", label: "Settings", icon: Settings, adminOnly: false },
  { href: "/admin", label: "Admin", icon: ShieldCheck, adminOnly: true },
] as const;
