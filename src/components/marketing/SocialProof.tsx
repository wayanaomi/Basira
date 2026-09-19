export function SocialProof() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-28 lg:px-8">
      <div className="overflow-hidden rounded-[2.75rem] bg-indigo">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="p-8 text-paper sm:p-12 lg:p-16">
            <p className="font-mono-basira text-xs uppercase tracking-[0.2em] text-gold">
              The Basira principle
            </p>

            <h2 className="mt-5 max-w-lg font-display text-3xl font-bold leading-tight sm:text-4xl">
              Small sessions. Serious progress.
            </h2>

            <p className="mt-6 max-w-md leading-7 text-paper/60">
              You do not need a perfect four-hour study day.
              You need a system that helps you make the next
              useful move — then come back tomorrow.
            </p>
          </div>

          <div className="grid grid-cols-2 border-t border-paper/10 lg:grid-cols-2 lg:border-l lg:border-t-0">
            {[
              ["01", "Lesson"],
              ["02", "Practice"],
              ["03", "Mastery"],
              ["04", "Readiness"],
            ].map(([number, label]) => (
              <div
                key={number}
                className="min-h-40 border-b border-r border-paper/10 p-6 sm:min-h-52"
              >
                <span className="font-mono-basira text-xs text-gold">
                  {number}
                </span>

                <p className="mt-20 font-display text-xl font-bold text-paper">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}