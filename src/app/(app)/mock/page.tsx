import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { LinkButton } from "@/components/ui/Button";

export default async function MockExamListPage() {
  const session = await auth();
  const userId = session!.user.id;

  const profile = await prisma.studentProfile.findUnique({ where: { userId } });
  if (!profile?.examId) redirect("/onboarding");

  const mockExams = await prisma.mockExam.findMany({
    where: { examId: profile.examId, isPublished: true },
    include: {
      questions: true,
      attempts: { where: { userId }, orderBy: { startedAt: "desc" } },
    },
  });

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <h1 className="font-display text-2xl font-semibold text-indigo">Mock exams</h1>
      <p className="mt-1 text-sm text-ink/60">
        Realistic, timed practice. Results are a preparation signal — not a guarantee.
      </p>

      {mockExams.length === 0 ? (
        <p className="mt-10 text-sm text-ink/50">
          No mock exam available for your exam yet. Check back soon.
        </p>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {mockExams.map((exam) => {
            const bestScore = exam.attempts
              .filter((a) => a.status === "SUBMITTED")
              .reduce((max, a) => Math.max(max, a.score ?? 0), -1);
            const inProgress = exam.attempts.find((a) => a.status === "IN_PROGRESS");

            return (
              <div key={exam.id} className="rounded-3xl bg-paper p-6">
                <p className="font-display font-semibold text-indigo">{exam.title}</p>
                <p className="mt-1 text-sm text-ink/60">
                  {exam.questions.length} questions &middot; {exam.durationMinutes} min
                </p>
                {bestScore >= 0 && (
                  <p className="mt-1 text-xs text-sage">Best score: {bestScore}%</p>
                )}
                <LinkButton href={`/mock/${exam.id}`} size="sm" className="mt-4">
                  {inProgress ? "Resume" : bestScore >= 0 ? "Retake" : "Start"}
                </LinkButton>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
