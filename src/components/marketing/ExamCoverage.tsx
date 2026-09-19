const EXAMS = [
  {
    name: "JAMB / UTME",
    description: "Structured preparation for the exam that opens the next door.",
  },
  {
    name: "POST UTME",
    description: "Build topic confidence beyond the first hurdle.",
  },
  {
    name: "SSCE",
    description: "Develop understanding that lasts beyond one revision session.",
  },
  {
    name: "NECO",
    description: "Practice with a path instead of jumping between questions.",
  },
  {
    name: "GCE",
    description: "A focused system for independent preparation.",
  },
  {
    name: "IELTS",
    description: "Skill-based preparation across Listening, Reading, Writing and Speaking.",
  },
];

export function ExamCoverage() {
  return (
    <section
      id="exams"
      className="border-y border-ink/10 bg-paper py-28"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-mono-basira text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            One system. Many exams.
          </p>

          <h2 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight text-indigo sm:text-5xl">
            Your exam changes. The learning system doesn&apos;t.
          </h2>

          <p className="mt-6 leading-7 text-ink/60">
            Basira is designed around reusable exam architecture,
            so different subjects and certifications can live
            inside the same mastery experience.
          </p>
        </div>

        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {EXAMS.map((exam, index) => (
            <article
              key={exam.name}
              className="group rounded-[1.75rem] border border-ink/10 bg-mist p-6 transition duration-300 hover:-translate-y-1 hover:border-gold/50"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono-basira text-xs text-gold">
                  0{index + 1}
                </span>

                <span className="h-2 w-2 rounded-full bg-sage opacity-60 transition group-hover:scale-125" />
              </div>

              <h3 className="mt-12 font-display text-xl font-bold text-ink">
                {exam.name}
              </h3>

              <p className="mt-3 text-sm leading-6 text-ink/55">
                {exam.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}