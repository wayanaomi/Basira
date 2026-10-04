import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { auth } from "@/auth";
import { isPro } from "@/lib/subscription";
import { getPerformanceAnalytics } from "@/lib/actions/performance";

function formatDate(date: Date | string | null) {
  if (!date) return "Not reviewed";

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function getAccuracyLabel(accuracy: number) {
  if (accuracy >= 80) return "Strong";
  if (accuracy >= 60) return "Developing";
  return "Needs work";
}

export default async function PerformancePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const pro = await isPro(session.user.id);

  if (!pro) {
    return (
      <main className="min-h-screen bg-[#F6F3FC] px-6 py-10 text-[#1B1030]">
        <div className="mx-auto max-w-3xl rounded-3xl border border-[#E8A93F]/30 bg-[#FFFEFC] p-8 shadow-sm md:p-12">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2E1A5E] text-white">
            <BarChart3 size={22} />
          </div>

          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[#684FA0]">
            Basira Pro
          </p>

          <h1 className="max-w-xl text-3xl font-bold tracking-tight md:text-5xl">
            Know exactly where you stand.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-[#5F5870]">
            Basira Pro turns your real study activity into useful performance
            insights — so you know what you understand, what needs attention,
            and where to focus next.
          </p>

          <Link
            href="/upgrade"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#2E1A5E] px-5 py-3 font-semibold text-white transition hover:bg-[#684FA0]"
          >
            Upgrade to Basira Pro
            <ArrowRight size={17} />
          </Link>
        </div>
      </main>
    );
  }

  const data = await getPerformanceAnalytics();

  const hasActivity = data.summary.totalQuestions > 0;

  if (!hasActivity) {
    return (
      <main className="min-h-screen bg-[#F6F3FC] px-6 py-8 text-[#1B1030]">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#684FA0]">
              Performance
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Your performance, without the guesswork.
            </h1>

            <p className="mt-3 max-w-2xl text-[#686176]">
              Complete lessons and answer questions to start building your
              performance picture.
            </p>
          </div>

          <div className="rounded-3xl border border-[#DDD6EA] bg-[#FFFEFC] p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F6F3FC] text-[#2E1A5E]">
              <BookOpen size={25} />
            </div>

            <h2 className="mt-5 text-xl font-bold">
              Your analytics will appear here.
            </h2>

            <p className="mx-auto mt-2 max-w-md leading-7 text-[#686176]">
              Basira does not invent progress. Keep studying and your real
              performance data will build up here automatically.
            </p>

            <Link
              href="/learn"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#2E1A5E] px-5 py-3 font-semibold text-white"
            >
              Continue learning
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F6F3FC] px-6 py-8 text-[#1B1030]">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#684FA0]">
            Performance
          </p>

          <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Your performance, without the guesswork.
              </h1>

              <p className="mt-2 text-[#686176]">
                {data.exam?.name ?? "Your exam"} · Based on your actual study
                activity.
              </p>
            </div>

            {data.targetScore && (
              <div className="rounded-2xl border border-[#DDD6EA] bg-[#FFFEFC] px-5 py-3">
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#7A7388]">
                  Target
                </p>
                <p className="mt-1 font-mono text-xl font-bold">
                  {data.targetScore}
                </p>
              </div>
            )}
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Overall accuracy",
              value: `${data.summary.overallAccuracy}%`,
              icon: Target,
            },
            {
              label: "Questions answered",
              value: data.summary.totalQuestions,
              icon: BookOpen,
            },
            {
              label: "Lessons completed",
              value: data.summary.completedLessons,
              icon: BarChart3,
            },
            {
              label: "Recent accuracy",
              value: `${data.summary.recentAccuracy}%`,
              icon: TrendingUp,
            },
          ].map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-[#DDD6EA] bg-[#FFFEFC] p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[#686176]">{stat.label}</p>
                  <Icon size={18} className="text-[#684FA0]" />
                </div>

                <p className="mt-4 font-mono text-3xl font-bold">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl border border-[#DDD6EA] bg-[#FFFEFC] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#7A7388]">
                  Subjects
                </p>
                <h2 className="mt-1 text-xl font-bold">
                  Where you stand
                </h2>
              </div>

              <TrendingUp size={20} className="text-[#3FAE6B]" />
            </div>

            <div className="mt-6 space-y-5">
              {data.subjects.map((subject) => (
                <div key={subject.id}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold">{subject.name}</p>
                      <p className="text-xs text-[#7A7388]">
                        {subject.attempted} questions
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-mono font-bold">
                        {subject.accuracy}%
                      </p>
                      <p className="text-xs text-[#7A7388]">
                        {getAccuracyLabel(subject.accuracy)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#EAE5F2]">
                    <div
                      className="h-full rounded-full bg-[#684FA0]"
                      style={{ width: `${subject.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[#DDD6EA] bg-[#2E1A5E] p-6 text-white">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#D9CFF0]">
              Focus
            </p>

            <h2 className="mt-2 text-xl font-bold">
              Your next best move
            </h2>

            {data.weakestTopic ? (
              <>
                <div className="mt-6 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                  <TrendingDown size={20} />
                </div>

                <p className="mt-5 text-sm text-[#D9CFF0]">
                  Needs the most attention
                </p>

                <p className="mt-1 text-lg font-bold">
                  {data.weakestTopic.name}
                </p>

                <p className="mt-1 text-sm text-[#D9CFF0]">
                  {data.weakestTopic.subject} ·{" "}
                  {data.weakestTopic.masteryPercent}% mastery
                </p>

                <Link
                  href={`/learn/${data.weakestTopic.subjectSlug}/${data.weakestTopic.slug}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white underline underline-offset-4"
                >
                  Review this area
                  <ArrowRight size={15} />
                </Link>
              </>
            ) : (
              <p className="mt-6 text-sm leading-6 text-[#D9CFF0]">
                Keep answering questions and Basira will identify where your
                attention will have the greatest impact.
              </p>
            )}
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-[#DDD6EA] bg-[#FFFEFC] p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#7A7388]">
                Topic mastery
              </p>
              <h2 className="mt-1 text-xl font-bold">
                What you actually know
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {data.topics.slice(0, 10).map((topic) => (
              <div
                key={topic.id}
                className="rounded-2xl border border-[#E8E2F0] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{topic.name}</p>
                    <p className="mt-1 text-xs text-[#7A7388]">
                      {topic.subject}
                    </p>
                  </div>

                  <span className="font-mono text-sm font-bold">
                    {topic.masteryPercent}%
                  </span>
                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#EAE5F2]">
                  <div
                    className="h-full rounded-full bg-[#3FAE6B]"
                    style={{ width: `${topic.masteryPercent}%` }}
                  />
                </div>

                <p className="mt-2 text-xs text-[#7A7388]">
                  {topic.questionsCorrect}/{topic.questionsAttempted} correct
                  · Last reviewed {formatDate(topic.lastReviewedAt)}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
