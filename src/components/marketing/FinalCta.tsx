import { ArrowRight, Sparkles } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { Sage } from "@/components/brand/Mascots";

export function FinalCta() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-28 pt-4 lg:px-8">
      <div className="relative overflow-hidden rounded-[2.75rem] bg-gold px-7 py-16 text-center sm:px-12 sm:py-20">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-paper/20 blur-3xl" />

        <div className="relative">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-paper/70 shadow-sm">
            <Sage className="h-16 w-16" />
          </div>

          <div className="mt-7 inline-flex items-center gap-2 font-mono-basira text-xs font-semibold uppercase tracking-[0.2em] text-ink/50">
            <Sparkles className="h-3.5 w-3.5" />
            Your next insight is waiting
          </div>

          <h2 className="mx-auto mt-5 max-w-2xl font-display text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
            Start with one lesson. Let the journey build from there.
          </h2>

          <div className="mt-9">
            <LinkButton href="/register" size="lg">
              Start learning
              <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </div>

          <p className="mt-4 text-xs font-medium text-ink/45">
            Start free · No card required
          </p>
        </div>
      </div>
    </section>
  );
}