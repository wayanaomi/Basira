const FAQS = [
  [
    "What exams does Basira support?",
    "Basira is built to support JAMB / UTME, SSCE, POST UTME, IELTS and a growing architecture for additional exams and certifications.",
  ],
  [
    "How is Basira different from a bank of past questions?",
    "Past questions are useful, but Basira adds a learning path, short lessons, feedback, mastery and a record of what you actually need to revisit.",
  ],
  [
    "What happens if I miss a day?",
    "Your learning does not disappear. Basira helps you understand what to pick up next and gives you a clear way to rebuild consistency.",
  ],
  [
    "Can I use Basira at night?",
    "Yes. Basira supports light and dark themes, and your preference is saved on your device.",
  ],
];

export function Faq() {
  return (
    <section
      id="faq"
      className="mx-auto max-w-4xl px-5 py-28 lg:px-8"
    >
      <div className="mb-10">
        <p className="font-mono-basira text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          Questions
        </p>

        <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-indigo">
          Before you start.
        </h2>
      </div>

      <div className="divide-y divide-ink/10 border-y border-ink/10">
        {FAQS.map(([question, answer]) => (
          <details
            key={question}
            className="group py-7"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display font-bold text-ink">
              {question}

              <span className="text-2xl font-normal text-gold transition group-open:rotate-45">
                +
              </span>
            </summary>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-ink/55">
              {answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}