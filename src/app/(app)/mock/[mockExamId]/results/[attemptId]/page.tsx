import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { LinkButton } from "@/components/ui/Button";
import { MasteryBar } from "@/components/gamification/MasteryBar";
import { isPro } from "@/lib/subscription";

type TopicResult = {
  id: string;
  name: string;
  correct: number;
  total: number;
};

type SubjectResult = {
  id: string;
  name: string;
  correct: number;
  total: number;
  topics: TopicResult[];
};

export default async function MockResultsPage({
  params,
}: PageProps<"/mock/[mockExamId]/results/[attemptId]">) {
  const { mockExamId, attemptId } = await params;

  const session = await auth();

  if (!session?.user?.id) {
    notFound();
  }

  const userId = session.user.id;
  const pro = await isPro(userId);

  const attempt = await prisma.mockExamAttempt.findUnique({
    where: { id: attemptId },
    include: {
      mockExam: true,
      answers: {
        include: {
          question: {
            include: {
              topic: {
                include: {
                  subject: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!attempt || attempt.userId !== userId) {
    notFound();
  }

  /*
   * Build the result hierarchy from actual submitted answers:
   *
   * Subject
   *   └── Topic
   *        └── correct / total
   *
   * Nothing here is mocked or calculated from demo data.
   */
  const subjects = new Map<string, SubjectResult>();

  for (const answer of attempt.answers) {
    const subject = answer.question.topic.subject;
    const topic = answer.question.topic;

    let subjectResult = subjects.get(subject.id);

    if (!subjectResult) {
      subjectResult = {
        id: subject.id,
        name: subject.name,
        correct: 0,
        total: 0,
        topics: [],
      };

      subjects.set(subject.id, subjectResult);
    }

    subjectResult.total += 1;

    if (answer.isCorrect) {
      subjectResult.correct += 1;
    }

    let topicResult = subjectResult.topics.find(
      (item) => item.id === topic.id,
    );

    if (!topicResult) {
      topicResult = {
        id: topic.id,
        name: topic.name,
        correct: 0,
        total: 0,
      };

      subjectResult.topics.push(topicResult);
    }

    topicResult.total += 1;

    if (answer.isCorrect) {
      topicResult.correct += 1;
    }
  }

  const subjectResults = Array.from(subjects.values());

  const correctAnswers = attempt.answers.filter(
    (answer) => answer.isCorrect,
  ).length;

  const answeredQuestions = attempt.answers.length;
  const unansweredQuestions = Math.max(
    attempt.totalQuestions - answeredQuestions,
    0,
  );

  const minutes = Math.floor(attempt.timeSpentSeconds / 60);
  const seconds = attempt.timeSpentSeconds % 60;

  const score = attempt.totalQuestions
    ? Math.round((correctAnswers / attempt.totalQuestions) * 100)
    : 0;

  const wrongAnswers = attempt.answers.filter(
    (answer) => !answer.isCorrect,
  ).length;

  const rankedSubjects = subjectResults
    .map((subject) => ({
      ...subject,
      accuracy: subject.total
        ? Math.round((subject.correct / subject.total) * 100)
        : 0,
    }))
    .sort((a, b) => a.accuracy - b.accuracy);

  const weakestSubject = rankedSubjects[0] ?? null;
  const strongestSubject =
    rankedSubjects[rankedSubjects.length - 1] ?? null;

  const rankedTopics = subjectResults
    .flatMap((subject) =>
      subject.topics.map((topic) => ({
        ...topic,
        subjectId: subject.id,
        subjectName: subject.name,
        accuracy: topic.total
          ? Math.round((topic.correct / topic.total) * 100)
          : 0,
      })),
    )
    .sort((a, b) => a.accuracy - b.accuracy);

  const weakestTopic = rankedTopics[0] ?? null;

  return (
    <main className="min-h-screen bg-cloudMist px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-medium text-indigo/60">
            {attempt.mockExam.title}
          </p>

          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-indigo/50">
                Mock result
              </p>

              <h1 className="mt-1 font-display text-4xl font-semibold tracking-tight text-indigo sm:text-5xl">
                {score}%
              </h1>

              <p className="mt-2 text-sm text-ink/60">
                {correctAnswers} of {attempt.totalQuestions} questions correct
              </p>
            </div>

            <div className="rounded-2xl border border-indigo/10 bg-paperWhite px-5 py-4 shadow-sm">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-indigo/45">
                Time spent
              </p>

              <p className="mt-1 font-mono text-lg font-semibold text-indigo">
                {minutes}m {seconds.toString().padStart(2, "0")}s
              </p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <section className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-indigo/10 bg-paperWhite p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-ink/45">
              Score
            </p>

            <p className="mt-2 font-mono text-2xl font-semibold text-indigo">
              {score}%
            </p>
          </div>

          <div className="rounded-2xl border border-indigo/10 bg-paperWhite p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-ink/45">
              Correct
            </p>

            <p className="mt-2 font-mono text-2xl font-semibold text-sage">
              {correctAnswers}
            </p>
          </div>

          <div className="rounded-2xl border border-indigo/10 bg-paperWhite p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-ink/45">
              Unanswered
            </p>

            <p className="mt-2 font-mono text-2xl font-semibold text-ember">
              {unansweredQuestions}
            </p>
          </div>
        </section>

        <p className="mt-5 max-w-2xl text-sm leading-6 text-ink/55">
          Your result is calculated from your submitted answers. It is a
          preparation indicator, not a guarantee of your real exam score.
        </p>

        {/* Subject breakdown */}
        <section className="mt-10">
          <div className="mb-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-indigo/45">
              Performance
            </p>

            <h2 className="mt-1 font-display text-2xl font-semibold text-indigo">
              Subject breakdown
            </h2>
          </div>

          <div className="space-y-4">
            {subjectResults.map((subject) => {
              const subjectPercent = subject.total
                ? Math.round((subject.correct / subject.total) * 100)
                : 0;

              return (
                <div
                  key={subject.id}
                  className="rounded-2xl border border-indigo/10 bg-paperWhite p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-display text-lg font-semibold text-indigo">
                        {subject.name}
                      </h3>

                      <p className="mt-1 text-sm text-ink/55">
                        {subject.correct} of {subject.total} correct
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="font-mono text-xl font-semibold text-indigo">
                        {subjectPercent}%
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-indigo/10">
                    <div
                      className="h-full rounded-full bg-indigo transition-all"
                      style={{ width: `${subjectPercent}%` }}
                    />
                  </div>

                  {subject.topics.length > 0 && (
                    <div className="mt-6 border-t border-indigo/10 pt-5">
                      <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-ink/45">
                        Topic performance
                      </p>

                      <div className="space-y-4">
                        {subject.topics.map((topic) => (
                          <MasteryBar
                            key={topic.id}
                            label={`${topic.name} · ${topic.correct}/${topic.total}`}
                            percent={
                              topic.total
                                ? Math.round(
                                    (topic.correct / topic.total) * 100,
                                  )
                                : 0
                            }
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Pro intelligence */}
        <section className="mt-10 rounded-3xl border border-indigo/10 bg-paperWhite p-6 shadow-sm sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-gold">
                Basira Pro
              </p>

              <h2 className="mt-1 font-display text-2xl font-semibold text-indigo">
                What this result tells you
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/55">
                Turn this mock result into a focused revision plan instead of
                guessing what to study next.
              </p>
            </div>
          </div>

          {!pro ? (
            <div className="mt-6 rounded-2xl border border-indigo/10 bg-cloudMist p-5">
              <h3 className="font-display text-lg font-semibold text-indigo">
                Unlock your personalised mock insights
              </h3>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/55">
                Basira Pro turns your mock results into weakness detection,
                revision recommendations, performance trends and a connected
                wrong-answer review flow.
              </p>

              <div className="mt-5">
                <LinkButton href="/upgrade" variant="primary">
                  Upgrade to Basira Pro
                </LinkButton>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-indigo/10 bg-cloudMist p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-ink/45">
                    Strongest subject
                  </p>

                  <p className="mt-2 font-display text-lg font-semibold text-indigo">
                    {strongestSubject?.name ?? "—"}
                  </p>

                  <p className="mt-1 font-mono text-sm text-sage">
                    {strongestSubject?.accuracy ?? 0}%
                  </p>
                </div>

                <div className="rounded-2xl border border-indigo/10 bg-cloudMist p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-ink/45">
                    Needs attention
                  </p>

                  <p className="mt-2 font-display text-lg font-semibold text-indigo">
                    {weakestSubject?.name ?? "—"}
                  </p>

                  <p className="mt-1 font-mono text-sm text-ember">
                    {weakestSubject?.accuracy ?? 0}%
                  </p>
                </div>

                <div className="rounded-2xl border border-indigo/10 bg-cloudMist p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-ink/45">
                    Weakest topic
                  </p>

                  <p className="mt-2 font-display text-lg font-semibold text-indigo">
                    {weakestTopic?.name ?? "—"}
                  </p>

                  <p className="mt-1 font-mono text-sm text-ember">
                    {weakestTopic?.accuracy ?? 0}%
                  </p>
                </div>

                <div className="rounded-2xl border border-indigo/10 bg-cloudMist p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-ink/45">
                    Wrong answers
                  </p>

                  <p className="mt-2 font-mono text-2xl font-semibold text-indigo">
                    {wrongAnswers}
                  </p>

                  <p className="mt-1 text-xs text-ink/45">
                    Questions to review
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-indigo/10 bg-indigo p-5 text-paperWhite">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-gold">
                  Recommended next step
                </p>

                <h3 className="mt-2 font-display text-xl font-semibold">
                  {weakestTopic
                    ? `Review ${weakestTopic.name}`
                    : weakestSubject
                      ? `Review ${weakestSubject.name}`
                      : "Keep practising"}
                </h3>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-paperWhite/70">
                  {weakestTopic
                    ? `${weakestTopic.name} was your weakest topic in this mock. Start there before taking another full mock.`
                    : "Use your performance history and wrong answers to decide what to revise next."}
                </p>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <LinkButton href="/wrong-answers" variant="ghost">
                  Review wrong answers
                </LinkButton>

                <LinkButton href="/recommendations" variant="ghost">
                  Open study plan
                </LinkButton>

                <LinkButton href="/performance" variant="ghost">
                  View performance
                </LinkButton>

                <LinkButton href="/mock-analysis" variant="ghost">
                  Analyse your mocks
                </LinkButton>
              </div>
            </>
          )}
        </section>

        {/* Actions */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <LinkButton href="/mock" variant="ghost">
            All mock exams
          </LinkButton>

          <LinkButton href={`/mock/${mockExamId}`} variant="primary">
            Retake mock
          </LinkButton>
        </div>
      </div>
    </main>
  );
}
