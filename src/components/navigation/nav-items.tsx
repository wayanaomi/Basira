import {
  LayoutDashboard,
  Route,
  ClipboardCheck,
  BarChart3,
  Target,
  RotateCcw,
  Trophy,
  Settings,
  ShieldCheck,
  Crown,
  LineChart,
} from "lucide-react";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, adminOnly: false },
  { href: "/learn", label: "Learn", icon: Route, adminOnly: false },
  { href: "/mock", label: "Mock Exams", icon: ClipboardCheck, adminOnly: false },
  { href: "/mock-analysis", label: "Mock Analysis", icon: LineChart, adminOnly: false },
  { href: "/performance", label: "Performance", icon: BarChart3, adminOnly: false },
  { href: "/recommendations", label: "Study Plan", icon: Target, adminOnly: false },
  { href: "/wrong-answers", label: "Wrong Answers", icon: RotateCcw, adminOnly: false },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy, adminOnly: false },
  { href: "/settings", label: "Settings", icon: Settings, adminOnly: false },
  { href: "/upgrade", label: "Basira Pro", icon: Crown, adminOnly: false },
  { href: "/admin", label: "Admin", icon: ShieldCheck, adminOnly: true },
] as const;
