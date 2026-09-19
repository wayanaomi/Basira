import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { LinkButton } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/marketing/ThemeToggle";

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-mist/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" aria-label="Basira home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="#journey"
            className="text-sm font-semibold text-ink/60 transition hover:text-indigo"
          >
            The journey
          </Link>

          <Link
            href="#mastery"
            className="text-sm font-semibold text-ink/60 transition hover:text-indigo"
          >
            Mastery
          </Link>

          <Link
            href="#exams"
            className="text-sm font-semibold text-ink/60 transition hover:text-indigo"
          >
            Exams
          </Link>

          <Link
            href="#faq"
            className="text-sm font-semibold text-ink/60 transition hover:text-indigo"
          >
            FAQ
          </Link>
        </nav>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />

          <Link
            href="/login"
            className="hidden px-2 text-sm font-semibold text-ink/70 transition hover:text-indigo sm:block"
          >
            Log in
          </Link>

          <LinkButton href="/register" size="sm">
            Start learning
            <ArrowRight className="h-3.5 w-3.5" />
          </LinkButton>
        </div>
      </div>
    </header>
  );
}