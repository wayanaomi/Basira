import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { LinkButton } from "@/components/ui/Button";
import { MasteryBar } from "@/components/gamification/MasteryBar";

export default async function MockResultsPage({
  params,
}: PageProps<"/mock/[mockExamId]/results/[attemptId]">) {
  const { mockExamId, attemptId } = await params;
  const session = await auth();
  const userId = session!.user.id;

  const attempt = await prisma.mockExamAttempt.findUnique({
    where: { id: attemptId },
    include: {
      mockExam: true,
      answers: { include: { question: { include: { topic: true } } } },
    },
  });
  if (!attempt || attempt.userId !== userId) notFound();

  // Group correctness by topic for the breakdown.
  const byTopic = new Map<string, { name: string; correct: number; total: number }>();
  for (const answer of attempt.answers) {
    const topic = answer.question.topic;
    const entry = byTopic.get(topic.id) ?? { name: topic.name, correct: 0, total: 0 };
    entry.total += 1;
    if (answer.isCorrect) entry.correct += 1;
    byTopic.set(topic.id, entry);
  }

  const minutes = Math.floor(attempt.timeSpentSeconds / 60);
  const seconds = attempt.timeSpentSeconds % 60;

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <p className="text-sm text-ink/50">{attempt.mockExam.title}</p>
      <h1 className="mt-1 font-display text-4xl font-semibold text-indigo">
        {attempt.score}%
      </h1>
      <p className="mt-1 text-sm text-ink/60">
        {attempt.answers.filter((a) => a.isCorrect).length}/{attempt.totalQuestions} correct
        &middot; {minutes}m {seconds}s
      </p>
      <p className="mt-4 max-w-md text-xs text-ink/50">
        This mock result is a preparation indicator, not a guarantee of your real exam score.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        <h2 className="font-display font-semibold text-indigo">Topic breakdown</h2>
        {Array.from(byTopic.values()).map((topic) => (
          <MasteryBar
            key={topic.name}
            label={topic.name}
            percent={Math.round((topic.correct / topic.total) * 100)}
          />
        ))}
      </div>

      <div className="mt-10 flex gap-3">
        <LinkButton href="/mock" variant="ghost">
          All mock exams
        </LinkButton>
        <LinkButton href={`/mock/${mockExamId}`} variant="primary">
          Retake
        </LinkButton>
      </div>
    </div>
  );
}
