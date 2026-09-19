import Link from "next/link";
import {
  ArrowRight,
  Check,
  Flame,
  Lock,
} from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { Sage } from "@/components/brand/Mascots";

const PATH = [
  {
    number: "01",
    label: "Algebra",
    status: "complete",
  },
  {
    number: "02",
    label: "Quadratics",
    status: "current",
  },
  {
    number: "03",
    label: "Functions",
    status: "next",
  },
  {
    number: "04",
    label: "Sequences",
    status: "locked",
  },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-ink/10">
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[8%] top-[12%] h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute right-[5%] top-[20%] h-80 w-80 rounded-full bg-violet/10 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-16 px-5 pb-24 pt-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8 lg:pb-32 lg:pt-24">
        {/* LEFT */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/35 bg-paper px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-indigo shadow-sm">
            
            A little insight, every day.
          </div>

          <h1 className="mt-7 max-w-3xl font-display text-5xl font-bold leading-[0.94] tracking-[-0.055em] text-indigo sm:text-6xl lg:text-[5.4rem]">
            Turn exam anxiety into{" "}
            <span className="relative inline-block text-ink">
              exam readiness.
              <span className="absolute -bottom-2 left-0 h-1.5 w-2/3 rounded-full bg-gold sm:h-2" />
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-ink/65 sm:text-xl">
            Basira turns exam preparation into a daily learning
            journey — one lesson, one question, one insight at a
            time.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <LinkButton href="/register" size="lg">
              Start my journey
              <ArrowRight className="h-4 w-4" />
            </LinkButton>

            <Link
              href="#journey"
              className="group inline-flex items-center gap-2 rounded-full border border-ink/10 bg-paper px-5 py-3.5 text-sm font-bold text-ink shadow-sm transition hover:-translate-y-0.5 hover:border-gold/50"
            >
              See the journey
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink/40">
            <span>JAMB / UTME</span>
            <span>IELTS</span>
            <span>SSCE</span>
            <span>More exams</span>
          </div>
        </div>

        {/* RIGHT — SIGNATURE BASIRA PATH */}
        <div className="relative mx-auto w-full max-w-[620px]">
          {/* XP FLOATING CARD */}
          <div className="absolute -right-3 -top-8 z-20 hidden rotate-3 rounded-2xl border border-gold/30 bg-paper px-4 py-3 shadow-xl sm:block">
            <p className="font-mono-basira text-xs font-semibold text-gold">
              +25 XP
            </p>
            <p className="mt-1 text-xs text-ink/45">
              lesson mastered
            </p>
          </div>

          {/* MAIN PANEL */}
          <div className="relative overflow-hidden rounded-[2.5rem] border border-ink/10 bg-paper p-5 shadow-[0_35px_100px_-45px_rgba(46,26,94,.6)] sm:p-7">
            {/* top bar */}
            <div className="flex items-center justify-between border-b border-ink/10 pb-5">
              <div>
                <p className="font-mono-basira text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/35">
                  Today&apos;s mission
                </p>

                <h2 className="mt-1 font-display text-xl font-bold text-indigo">
                  Build your algebra base
                </h2>
              </div>

              <div className="flex items-center gap-1.5 rounded-full bg-ember/10 px-3 py-1.5">
                <Flame className="h-4 w-4 text-ember" />
                <span className="font-mono-basira text-xs font-semibold text-ember">
                  4 days
                </span>
              </div>
            </div>

            {/* PATH */}
            <div className="relative mt-8">
              <div className="absolute left-[24px] top-7 bottom-7 w-px bg-ink/10" />

              <div className="space-y-3">
                {PATH.map((item) => {
                  const complete = item.status === "complete";
                  const current = item.status === "current";

                  return (
                    <div
                      key={item.label}
                      className={`
                        relative flex items-center gap-4 rounded-2xl border p-4
                        transition
                        ${
                          current
                            ? "border-gold/50 bg-gold/8 shadow-sm"
                            : "border-transparent"
                        }
                      `}
                    >
                      {/* node */}
                      <div
                        className={`
                          relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full border
                          ${
                            complete
                              ? "border-sage bg-sage text-white"
                              : current
                                ? "border-gold bg-gold text-ink"
                                : "border-ink/10 bg-mist text-ink/35"
                          }
                        `}
                      >
                        {complete ? (
                          <Check className="h-4 w-4" />
                        ) : current ? null : (
                          
                
                          <Lock className="h-4 w-4" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-mono-basira text-[10px] font-semibold text-ink/35">
                              {item.number}
                            </p>

                            <p
                              className={`font-display font-bold ${
                                current
                                  ? "text-indigo"
                                  : "text-ink"
                              }`}
                            >
                              {item.label}
                            </p>
                          </div>

                          {complete && (
                            <span className="font-mono-basira text-[10px] font-semibold uppercase tracking-wider text-sage">
                              mastered
                            </span>
                          )}

                          {current && (
                            <span className="rounded-full bg-gold px-2.5 py-1 font-mono-basira text-[10px] font-semibold uppercase text-ink">
                              next
                            </span>
                          )}
                        </div>

                        {current && (
                          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink/10">
                            <div className="h-full w-[72%] rounded-full bg-gold" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* bottom */}
            <div className="mt-6 flex items-center justify-between rounded-2xl bg-indigo p-4 text-paper">
              <div>
                <p className="font-mono-basira text-[10px] uppercase tracking-[0.16em] text-paper/45">
                  Topic mastery
                </p>

                <p className="mt-1 font-mono-basira text-2xl font-semibold text-gold">
                  72%
                </p>
              </div>

              <div className="grid h-11 w-11 place-items-center rounded-full bg-paper/10">
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* SAGE FLOAT */}
          <div className="absolute -bottom-8 -left-5 hidden items-center gap-3 rounded-2xl border border-ink/10 bg-paper p-3 shadow-xl sm:flex">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-violet/10">
              <Sage className="h-10 w-10" />
            </div>

            <div>
              <p className="font-display text-sm font-bold text-ink">
                Keep going.
              </p>

              <p className="mt-0.5 text-xs text-ink/45">
                One useful step at a time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}