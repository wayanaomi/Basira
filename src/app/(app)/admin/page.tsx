import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [
    totalStudents,
    activeStudents,
    proUsers,
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
    prisma.subscription.count({
      where: {
        plan: "PRO",
        status: "ACTIVE",
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
    }),
    prisma.lessonProgress.count({ where: { status: "COMPLETED" } }),
    prisma.questionAttempt.count(),
    prisma.questionAttempt.count({ where: { isCorrect: true } }),
    prisma.exam.count(),
    prisma.subject.count(),
    prisma.topic.count(),
    prisma.question.count(),
  ]);

  const averageAccuracy =
    questionsAnswered === 0
      ? null
      : Math.round((correctAnswers / questionsAnswered) * 100);

  const stats = [
    { label: "Total Students", value: totalStudents },
    { label: "Active Students", value: activeStudents },
    { label: "Pro Users", value: proUsers },
    { label: "Lessons Completed", value: lessonsCompleted },
    { label: "Questions Answered", value: questionsAnswered },
    {
      label: "Average Accuracy",
      value: averageAccuracy === null ? "—" : `${averageAccuracy}%`,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="font-display text-2xl font-semibold text-indigo">
        Admin
      </h1>

      <p className="mt-1 text-sm text-ink/60">
        Real activity only — this installation starts at zero and grows with
        real users.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-paper p-5">
            <p className="font-mono-basira text-2xl font-semibold text-indigo">
              {stat.value}
            </p>

            <p className="mt-1 text-xs text-ink/50">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/users"
          className="rounded-2xl bg-paper p-6 transition hover:-translate-y-0.5"
        >
          <p className="font-display font-semibold text-indigo">
            Students & Pro
          </p>

          <p className="mt-1 text-sm text-ink/55">
            View students and manually activate or remove Pro access.
          </p>

          <p className="mt-4 text-sm font-medium text-indigo">
            Manage students →
          </p>
        </Link>

        <Link
          href="/admin/questions"
          className="rounded-2xl bg-paper p-6 transition hover:-translate-y-0.5"
        >
          <p className="font-display font-semibold text-indigo">
            Question Bank
          </p>

          <p className="mt-1 text-sm text-ink/55">
            Manage questions and publishing status.
          </p>

          <p className="mt-4 text-sm font-medium text-indigo">
            Manage questions →
          </p>
        </Link>
      </div>

      <div className="mt-8 rounded-3xl bg-paper p-6">
        <h2 className="font-display font-semibold text-indigo">
          Content
        </h2>

        <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-ink/70 sm:grid-cols-4">
          <p>{examCount} exams</p>
          <p>{subjectCount} subjects</p>
          <p>{topicCount} topics</p>
          <p>{questionCount} questions</p>
        </div>
      </div>
    </div>
  );
}
