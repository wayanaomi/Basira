import Link from "next/link";
import { redirect } from "next/navigation";
import { createPersonalizedUtmeMock, getStudentUtmeSubjects } from "@/lib/actions/mock";

export default async function MockPage() {
  let data;

  try {
    data = await getStudentUtmeSubjects();
  } catch {
    redirect("/onboarding");
  }

  const { subjects } = data;

  async function startMock() {
    "use server";

    const mock = await createPersonalizedUtmeMock();

    redirect(`/mock/${mock.id}`);
  }

  return (
    <main className="min-h-screen bg-cloud-mist px-5 py-10 text-ink">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="font-mono-basira text-xs font-semibold uppercase tracking-[0.2em] text-violet">
            UTME Practice
          </p>

          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-indigo">
            Your mock follows your subjects.
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-ink/60">
            Basira uses the subjects you selected during onboarding.
            There is no fixed science mock or fixed arts mock.
          </p>
        </div>

        <section className="rounded-3xl border border-indigo/10 bg-paper p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-ink">
                Your UTME combination
              </p>

              <p className="mt-1 text-sm text-ink/50">
                Use of English + three other subjects
              </p>
            </div>

            <Link
              href="/onboarding"
              className="text-sm font-semibold text-indigo underline underline-offset-4"
            >
              Change subjects
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className="rounded-2xl border border-indigo/10 bg-cloud-mist px-4 py-4"
              >
                <p className="font-semibold text-indigo">
                  {subject.name}
                </p>

                <p className="mt-1 text-xs text-ink/50">
                  Included in your practice mock
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-gold/30 bg-gold/10 p-5">
            <p className="font-semibold text-indigo">
              Basira Practice Mock
            </p>

            <p className="mt-2 text-sm leading-6 text-ink/60">
              20 questions · 20 minutes · randomized questions ·
              subject-specific scoring
            </p>
          </div>

          <form action={startMock} className="mt-6">
            <button
              type="submit"
              className="w-full rounded-2xl bg-indigo px-6 py-4 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Start my mock
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}