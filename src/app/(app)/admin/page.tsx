import { prisma } from "@/lib/prisma";
import { LinkButton } from "@/components/ui/Button";

export default async function AdminDashboardPage() {
  const [
    totalStudents,
    activeStudents,
    lessonsCompleted,
    questionsAnswered,
    correctAnswers,
    examCount,
    subjectCount,
    topicCount,
    questionCount,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.streak.count({ where: { currentStreak: { gt: 0 } } }),
    prisma.lessonProgress.count({ where: { status: "COMPLETED" } }),
    prisma.questionAttempt.count(),
    prisma.questionAttempt.count({ where: { isCorrect: true } }),
    prisma.exam.count(),
    prisma.subject.count(),
    prisma.topic.count(),
    prisma.question.count(),
  ]);

  const averageAccuracy =
    questionsAnswered === 0 ? null : Math.round((correctAnswers / questionsAnswered) * 100);

  const stats = [
    { label: "Total Students", value: totalStudents },
    { label: "Active Students", value: activeStudents },
    { label: "Lessons Completed", value: lessonsCompleted },
    { label: "Questions Answered", value: questionsAnswered },
    { label: "Average Accuracy", value: averageAccuracy === null ? "—" : `${averageAccuracy}%` },
    { label: "Revenue", value: "₦0" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="font-display text-2xl font-semibold text-indigo">Admin</h1>
      <p className="mt-1 text-sm text-ink/60">
        Real activity only — this installation starts at zero and grows with real users.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-paper p-5">
            <p className="font-mono-basira text-2xl font-semibold text-indigo">{stat.value}</p>
            <p className="mt-1 text-xs text-ink/50">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-3xl bg-paper p-6">
        <h2 className="font-display font-semibold text-indigo">Content</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-ink/70 sm:grid-cols-4">
          <p>{examCount} exams</p>
          <p>{subjectCount} subjects</p>
          <p>{topicCount} topics</p>
          <p>{questionCount} questions</p>
        </div>
        <LinkButton href="/admin/questions" size="sm" className="mt-4">
          Manage questions
        </LinkButton>
      </div>
    </div>
  );
}
