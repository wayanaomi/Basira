const JOURNEY = [
  {
    number: "01",
    title: "Choose",
    body: "Pick the exam you are preparing for.",
  },
  {
    number: "02",
    title: "Learn",
    body: "Understand the concept in a short focused lesson.",
  },
  {
    number: "03",
    title: "Practice",
    body: "Answer questions and get immediate feedback.",
  },
  {
    number: "04",
    title: "Master",
    body: "Your real performance shapes what comes next.",
  },
  {
    number: "05",
    title: "Return",
    body: "Build consistency one useful session at a time.",
  },
];

export function ProblemSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-28 lg:px-8">
      <div className="grid gap-14 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <p className="font-mono-basira text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            The problem
          </p>

          <h2 className="mt-5 max-w-lg font-display text-4xl font-bold leading-tight tracking-tight text-indigo sm:text-5xl">
            Studying more doesn't always mean knowing more.
          </h2>

          <p className="mt-6 max-w-md leading-7 text-ink/60">
            The hardest part of exam preparation is often not
            finding content. It is knowing what to do with it,
            what you actually understand, and what needs another
            look.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              number: "01",
              title: "Too much content",
              body: "Notes, videos and past questions can leave you with more material and less direction.",
            },
            {
              number: "02",
              title: "Invisible gaps",
              body: "You can understand a topic today and still miss it when the question changes tomorrow.",
            },
            {
              number: "03",
              title: "Revision guesswork",
              body: "Without a clear feedback loop, every study session becomes another decision to make.",
            },
          ].map((item) => (
            <article
              key={item.number}
              className="group rounded-[1.75rem] border border-ink/10 bg-paper p-6 transition duration-300 hover:-translate-y-1 hover:border-gold/40"
            >
              <span className="font-mono-basira text-xs font-semibold text-gold">
                {item.number}
              </span>

              <h3 className="mt-12 font-display text-lg font-bold text-ink">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-ink/55">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section
      id="journey"
      className="relative overflow-hidden bg-indigo py-28 text-paper"
    >
      <div className="absolute right-[-10%] top-[-20%] h-[500px] w-[500px] rounded-full bg-gold/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-mono-basira text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            How Basira works
          </p>

          <h2 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Your exam becomes a path.
          </h2>

          <p className="mt-6 text-base leading-7 text-paper/60">
            Instead of asking you to figure out the next step,
            Basira turns preparation into a sequence of small,
            useful decisions.
          </p>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-[2rem] border border-paper/10 bg-paper/10 md:grid-cols-5">
          {JOURNEY.map((item, index) => (
            <div
              key={item.number}
              className="group relative bg-indigo p-6 transition hover:bg-paper/[0.05]"
            >
              <span className="font-mono-basira text-xs text-gold">
                {item.number}
              </span>

              <div className="mt-16">
                <h3 className="font-display text-xl font-bold">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-paper/50">
                  {item.body}
                </p>
              </div>

              {index < JOURNEY.length - 1 && (
                <div className="absolute right-[-7px] top-1/2 z-10 hidden h-3 w-3 -translate-y-1/2 rotate-45 border-r border-t border-gold/40 bg-indigo md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}