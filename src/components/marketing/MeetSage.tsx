import { Sparkles } from "lucide-react";
import { Sage } from "@/components/brand/Mascots";

export function MeetSage() {
  return (
    <section
      id="sage"
      className="mx-auto max-w-7xl px-5 py-28 lg:px-8"
    >
      <div className="relative overflow-hidden rounded-[2.75rem] border border-ink/10 bg-violet/10 p-8 sm:p-12 lg:p-16">
        <div className="absolute right-[-10%] top-[-20%] h-80 w-80 rounded-full bg-gold/15 blur-3xl" />

        <div className="relative grid gap-12 lg:grid-cols-[220px_1fr] lg:items-center">
          <div className="mx-auto grid h-48 w-48 place-items-center rounded-full border border-gold/30 bg-paper shadow-xl">
            <Sage className="h-36 w-36" />
          </div>

          <div>
            <div className="inline-flex items-center gap-2 font-mono-basira text-xs font-semibold uppercase tracking-[0.2em] text-violet">
              <Sparkles className="h-3.5 w-3.5" />
              Meet Sage
            </div>

            <h2 className="mt-5 max-w-2xl font-display text-3xl font-bold leading-tight tracking-tight text-indigo sm:text-4xl">
              A guide for the gaps, not a mascot shouting from the sidelines.
            </h2>

            <p className="mt-6 max-w-2xl leading-7 text-ink/60">
              Sage is Basira&apos;s calm study companion. Sage points you
              toward the next useful thing, celebrates real progress and keeps
              the experience human.
            </p>

            <div className="mt-8 inline-flex max-w-lg rounded-2xl border border-ink/10 bg-paper px-5 py-4 shadow-sm">
              <p className="text-sm font-semibold text-ink">
                &ldquo;You&apos;re close. Let&apos;s clean up this topic
                before we move on.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}