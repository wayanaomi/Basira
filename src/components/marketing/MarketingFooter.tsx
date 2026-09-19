import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export function MarketingFooter() {
  return (
    <footer className="border-t border-ink/10 bg-paper py-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 lg:px-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <Logo />

            <p className="mt-3 text-xs text-ink/40">
              A little insight, every day.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-xs font-semibold text-ink/50">
            <Link
              href="/login"
              className="transition hover:text-indigo"
            >
              Log in
            </Link>

            <Link
              href="/register"
              className="transition hover:text-indigo"
            >
              Start learning
            </Link>

            <Link
              href="#faq"
              className="transition hover:text-indigo"
            >
              FAQ
            </Link>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-3 border-t border-ink/10 pt-6 text-xs text-ink/30 sm:flex-row">
          <span>Built for exam mastery.</span>

          <span>
            © {new Date().getFullYear()} Basira
          </span>
        </div>
      </div>
    </footer>
  );
}