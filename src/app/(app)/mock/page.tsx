import Link from "next/link";
import { redirect } from "next/navigation";
import { createPersonalizedUtmeMock, getStudentUtmeSubjects } from "@/lib/actions/mock";
import { auth } from "@/auth";
import { isPro } from "@/lib/subscription";

export default async function MockPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  let data;

  try {
    data = await getStudentUtmeSubjects();
  } catch {
    redirect("/onboarding");
  }

  const { subjects } = data;
  const pro = await isPro(session.user.id);

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

                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-gold/30 bg-gold/10 p-5">
            <p className="font-semibold text-indigo">
               Practice Mock
            </p>

            <p className="mt-2 text-sm leading-6 text-ink/60">
              20 questions · 20 minutes · randomized questions

            </p>
          </div>

          {pro ? (
            <form action={startMock} className="mt-6">
              <button
                type="submit"
                className="w-full rounded-2xl bg-indigo px-6 py-4 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Start mock
              </button>
            </form>
          ) : (
            <div className="mt-6 rounded-2xl border border-indigo/10 bg-cloud-mist p-6">
              <p className="font-display text-xl font-semibold text-indigo">
                Personalized mocks are part of Basira Pro.
              </p>

              <p className="mt-2 text-sm leading-6 text-ink/60">
                Get randomized practice built around your exact UTME subject
                combination, with subject-specific scoring and detailed
                performance results.
              </p>

              <Link
                href="/upgrade"
                className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-indigo px-6 py-4 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Upgrade to Pro
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
