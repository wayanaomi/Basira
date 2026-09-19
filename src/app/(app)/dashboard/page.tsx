import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getUserXpTotal, getLevelForXp } from "@/lib/gamification";
import { getTodaysRecommendation, getExamReadiness } from "@/lib/learning";
import { StreakBadge } from "@/components/gamification/StreakBadge";
import { XPBadge } from "@/components/gamification/XPBadge";
import { LevelProgress } from "@/components/gamification/LevelProgress";
import { MasteryBar } from "@/components/gamification/MasteryBar";
import { LinkButton } from "@/components/ui/Button";
import { Sage } from "@/components/brand/Mascots";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  const profile = await prisma.studentProfile.findUniqueOrThrow({
    where: { userId },
    include: {
      exam: true,
      subjects: { include: { subject: true } },
    },
  });

  const primarySubject = profile.subjects[0]?.subject ?? null;

  const [streak, xp, dailyGoalLog, masteryRows, recommendation, readiness, upcomingMock] =
    await Promise.all([
      prisma.streak.findUnique({ where: { userId } }),
      getUserXpTotal(userId),
      prisma.dailyGoalLog.findFirst({
        where: { userId },
        orderBy: { date: "desc" },
      }),
      primarySubject
        ? prisma.topicMastery.findMany({
            where: { userId, topic: { subjectId: primarySubject.id } },
            include: { topic: true },
          })
        : Promise.resolve([]),
      primarySubject ? getTodaysRecommendation(userId, primarySubject.id) : Promise.resolve(null),
      profile.examId ? getExamReadiness(userId, profile.examId) : Promise.resolve(null),
      profile.examId
        ? prisma.mockExam.findFirst({ where: { examId: profile.examId, isPublished: true } })
        : Promise.resolve(null),
    ]);

  const level = await getLevelForXp(xp);
  const todayMinutes = isToday(dailyGoalLog?.date) ? dailyGoalLog?.minutesStudied ?? 0 : 0;
  const goalMinutes = profile.dailyGoalMinutes;

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-ink/50">{greeting()}</p>
          <h1 className="font-display text-3xl font-semibold text-indigo">
            {session!.user.name?.split(" ")[0] ?? "there"}
          </h1>
        </div>
        <div className="flex gap-2">
          <StreakBadge streak={streak?.currentStreak ?? 0} size="lg" />
          <XPBadge xp={xp} size="lg" />
        </div>
      </header>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Today's focus / continue learning */}
          <section className="rounded-3xl bg-indigo p-6 text-paper">
            <p className="text-xs font-medium uppercase tracking-wide text-paper/60">
              Today&apos;s focus
            </p>
            {recommendation ? (
              <>
                <h2 className="mt-2 font-display text-xl font-semibold">
                  {recommendation.reason}
                </h2>
                <LinkButton
                  href={
                    recommendation.type === "CONTINUE_LESSON"
                      ? `/lesson/${recommendation.lesson.id}`
                      : `/learn/${primarySubject?.slug}`
                  }
                  variant="primary"
                  className="mt-4"
                >
                  Continue learning
                </LinkButton>
              </>
            ) : (
              <>
                <h2 className="mt-2 font-display text-xl font-semibold">
                  Your first lesson is waiting.
                </h2>
                <LinkButton href={`/learn/${primarySubject?.slug}`} variant="primary" className="mt-4">
                  Start learning
                </LinkButton>
              </>
            )}
          </section>

          {/* Daily goal */}
          <section className="rounded-3xl bg-paper p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-indigo">Today&apos;s goal</h3>
              <span className="font-mono-basira text-sm text-ink/60">
                {todayMinutes}/{goalMinutes} min
              </span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-ink/10">
              <div
                className="h-full rounded-full bg-ember transition-[width] duration-700"
                style={{ width: `${Math.min(100, (todayMinutes / goalMinutes) * 100)}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-ink/50">
              Short on time? A few questions still keeps your streak.
            </p>
          </section>

          {/* Topic mastery */}
          <section className="rounded-3xl bg-paper p-6">
            <h3 className="font-display font-semibold text-indigo">Topic mastery</h3>
            {masteryRows.length === 0 ? (
              <p className="mt-3 text-sm text-ink/50">
                Nothing to show yet. Complete a lesson and mastery will start tracking here.
              </p>
            ) : (
              <div className="mt-4 flex flex-col gap-4">
                {masteryRows.map((row) => (
                  <MasteryBar key={row.id} label={row.topic.name} percent={row.masteryPercent} />
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <LevelProgress level={level} />

          {/* Exam readiness */}
          <section className="rounded-3xl bg-paper p-6">
            <h3 className="font-display font-semibold text-indigo">Exam readiness</h3>
            {readiness?.available ? (
              <>
                <p className="mt-3 font-mono-basira text-3xl font-semibold text-sage">
                  {readiness.score}%
                </p>
                <p className="mt-1 text-xs text-ink/50">Based on your real practice so far.</p>
              </>
            ) : (
              <p className="mt-3 text-sm text-ink/50">
                Not enough data yet. Complete a few lessons and practice sessions —
                Basira will start measuring your preparation.
              </p>
            )}
          </section>

          {/* Upcoming mock */}
          <section className="rounded-3xl bg-paper p-6">
            <h3 className="font-display font-semibold text-indigo">Mock exam</h3>
            {upcomingMock ? (
              <>
                <p className="mt-2 text-sm text-ink/70">{upcomingMock.title}</p>
                <LinkButton href="/mock" variant="ghost" size="sm" className="mt-3">
                  View mock exams
                </LinkButton>
              </>
            ) : (
              <p className="mt-3 text-sm text-ink/50">No mock exam scheduled yet.</p>
            )}
          </section>

          <div className="flex justify-center">
            <Sage className="h-20 w-20 opacity-90" />
          </div>
        </div>
      </div>
    </div>
  );
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function isToday(date?: Date | null) {
  if (!date) return false;
  const today = new Date();
  return (
    date.getUTCFullYear() === today.getUTCFullYear() &&
    date.getUTCMonth() === today.getUTCMonth() &&
    date.getUTCDate() === today.getUTCDate()
  );
}
