import {
  BookOpenCheck,
  Flame,
  Gauge,
  Target,
} from "lucide-react";

const FEATURES = [
  {
    icon: Target,
    number: "01",
    title: "A clear daily mission",
    body: "Open Basira and know what matters today instead of building another study timetable from scratch.",
  },
  {
    icon: BookOpenCheck,
    number: "02",
    title: "Learn before you drill",
    body: "Understand the idea first, then retrieve it through questions and feedback.",
  },
  {
    icon: Gauge,
    number: "03",
    title: "Mastery you can see",
    body: "Your actual answers build a picture of what you know and what needs more work.",
  },
  {
    icon: Flame,
    number: "04",
    title: "A reason to return",
    body: "XP and streaks make consistency visible without becoming the point of studying.",
  },
];

export function FeatureShowcase() {
  return (
    <section
      id="mastery"
      className="mx-auto max-w-7xl px-5 py-28 lg:px-8"
    >
      <div className="grid gap-14 lg:grid-cols-[0.7fr_1.3fr]">
        <div>
          <p className="font-mono-basira text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Built around mastery
          </p>

          <h2 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight text-indigo sm:text-5xl">
            Not more studying. Better feedback.
          </h2>

          <p className="mt-6 max-w-md leading-7 text-ink/60">
            Every part of Basira exists to answer one question:
            what should you do next to become more ready for the
            exam?
          </p>

          <div className="mt-10 hidden rounded-3xl border border-ink/10 bg-indigo p-6 text-paper lg:block">
            <p className="font-mono-basira text-xs uppercase tracking-[0.16em] text-gold">
              The Basira loop
            </p>

            <p className="mt-4 font-display text-2xl font-bold">
              Learn → Answer → Understand → Return
            </p>

            <p className="mt-4 text-sm leading-6 text-paper/55">
              Progress comes from what you actually do, not from
              numbers invented for the screen.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {FEATURES.map(
            ({ icon: Icon, number, title, body }, index) => (
              <article
                key={title}
                className={`
                  group rounded-[2rem]
                  border border-ink/10
                  bg-paper
                  p-7
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-gold/50
                  ${
                    index % 2 === 1
                      ? "sm:translate-y-8"
                      : ""
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo text-gold">
                    <Icon className="h-5 w-5" />
                  </div>

                  <span className="font-mono-basira text-xs text-ink/25">
                    {number}
                  </span>
                </div>

                <h3 className="mt-14 font-display text-xl font-bold text-ink">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-ink/55">
                  {body}
                </p>
              </article>
            ),
          )}
        </div>
      </div>
    </section>
  );
}