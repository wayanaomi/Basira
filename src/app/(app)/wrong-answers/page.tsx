import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isPro } from "@/lib/subscription";
import { getWrongAnswers } from "@/lib/actions/wrong-answers";

export default async function WrongAnswersPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const pro = await isPro(session.user.id);

  if (!pro) {
    return (
      <main className="min-h-screen bg-cloud-mist px-5 py-10 text-ink">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/dashboard"
            className="text-sm text-ink/50 hover:text-indigo"
          >
            ← Dashboard
          </Link>

          <section className="mt-8 rounded-3xl border border-indigo/10 bg-paper p-8 shadow-sm">
            <p className="font-mono-basira text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              BASIRA PRO
            </p>

            <h1 className="mt-3 font-display text-3xl font-bold text-indigo">
              Your Wrong Answers Bank
            </h1>

            <p className="mt-4 max-w-2xl text-ink/60 leading-7">
              Keep every mistake that still needs attention in one place.
              Basira uses your real question history to help you revisit the
              questions you have not mastered yet.
            </p>

            <Link
              href="/upgrade"
              className="mt-7 inline-flex rounded-xl bg-indigo px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              Upgrade to Pro
            </Link>
          </section>
        </div>
      </main>
    );
  }

  const wrongAnswers = await getWrongAnswers();

  return (
    <main className="min-h-screen bg-cloud-mist px-5 py-10 text-ink">
      <div className="mx-auto max-w-5xl">
        <div>
          <Link
            href="/dashboard"
            className="text-sm text-ink/50 hover:text-indigo"
          >
            ← Dashboard
          </Link>

          <p className="mt-7 font-mono-basira text-xs font-semibold uppercase tracking-[0.2em] text-violet">
            BASIRA PRO
          </p>

          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-indigo">
            Wrong Answers Bank
          </h1>

          <p className="mt-3 max-w-2xl text-ink/60">
            Questions you have missed and still need to master.
          </p>
        </div>

        {wrongAnswers.length === 0 ? (
          <section className="mt-8 rounded-3xl border border-sage/20 bg-paper p-8">
            <div className="max-w-xl">
              <p className="font-display text-2xl font-semibold text-indigo">
                Your bank is clear.
              </p>

              <p className="mt-3 leading-7 text-ink/60">
                You currently have no unanswered mistakes that need another
                review. Keep learning and practising.
              </p>

              <Link
                href="/learn"
                className="mt-6 inline-flex rounded-xl bg-indigo px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
              >
                Continue learning
              </Link>
            </div>
          </section>
        ) : (
          <div className="mt-8 space-y-5">
            {wrongAnswers.map((item) => (
              <article
                key={item.id}
                className="rounded-3xl border border-indigo/10 bg-paper p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-indigo/10 px-3 py-1 font-medium text-indigo">
                    {item.subject}
                  </span>

                  <span className="rounded-full bg-ink/5 px-3 py-1 text-ink/55">
                    {item.topic}
                  </span>

                  <span className="ml-auto font-mono-basira text-ink/45">
                    Missed {item.missCount}×
                  </span>
                </div>

                <h2 className="mt-5 text-lg font-semibold leading-7 text-indigo">
                  {item.prompt}
                </h2>

                <div className="mt-5 space-y-2">
                  {item.options.map((option) => {
                    const selected =
                      option.id === item.selectedOptionId;

                    return (
                      <div
                        key={option.id}
                        className={
                          option.isCorrect
                            ? "rounded-xl border border-sage/30 bg-sage/10 px-4 py-3 text-sm"
                            : selected
                              ? "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm"
                              : "rounded-xl border border-indigo/10 px-4 py-3 text-sm text-ink/70"
                        }
                      >
                        <div className="flex items-center justify-between gap-4">
                          <span>{option.text}</span>

                          {option.isCorrect && (
                            <span className="text-xs font-semibold text-sage">
                              Correct answer
                            </span>
                          )}

                          {!option.isCorrect && selected && (
                            <span className="text-xs font-semibold text-red-600">
                              Your answer
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {item.explanation && (
                  <div className="mt-5 rounded-2xl bg-cloud-mist p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-violet">
                      Explanation
                    </p>

                    <p className="mt-2 text-sm leading-6 text-ink/65">
                      {item.explanation}
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
