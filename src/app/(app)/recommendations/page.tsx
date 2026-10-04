import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  CircleAlert,
  Target,
  TrendingDown,
} from "lucide-react";

import { auth } from "@/auth";
import { isPro } from "@/lib/subscription";
import { getPersonalizedRecommendations } from "@/lib/actions/recommendations";

const priorityLabel = {
  HIGH: "High priority",
  MEDIUM: "Worth attention",
  LOW: "Good next step",
};

export default async function RecommendationsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const pro = await isPro(session.user.id);

  if (!pro) {
    return (
      <main className="min-h-screen bg-[#F6F3FC] px-6 py-10 text-[#1B1030]">
        <div className="mx-auto max-w-3xl rounded-3xl border border-[#E8A93F]/30 bg-[#FFFEFC] p-8 shadow-sm md:p-12">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2E1A5E] text-white">
            <Target size={22} />
          </div>

          <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-[#684FA0]">
            Basira Pro
          </p>

          <h1 className="mt-2 max-w-xl text-3xl font-bold tracking-tight md:text-5xl">
            Know what to study next.
          </h1>

          <p className="mt-5 max-w-2xl leading-7 text-[#5F5870]">
            Basira studies your real performance and recommends the areas
            that deserve your attention instead of giving everyone the same
            study plan.
          </p>

          <Link
            href="/upgrade"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#2E1A5E] px-5 py-3 font-semibold text-white"
          >
            Upgrade to Basira Pro
            <ArrowRight size={17} />
          </Link>
        </div>
      </main>
    );
  }

  const { recommendations, weaknesses } =
    await getPersonalizedRecommendations();

  return (
    <main className="min-h-screen bg-[#F6F3FC] px-6 py-8 text-[#1B1030]">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#684FA0]">
            Your study plan
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Know what deserves your attention.
          </h1>

          <p className="mt-3 max-w-2xl text-[#686176]">
            These recommendations are generated from your actual Basira
            activity. No generic study plan. No invented progress.
          </p>
        </header>

        <section>
          <div className="mb-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#7A7388]">
              Recommended next
            </p>
            <h2 className="mt-1 text-xl font-bold">
              Three useful moves
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {recommendations.map((recommendation) => (
              <Link
                key={recommendation.id}
                href={recommendation.href}
                className="group rounded-3xl border border-[#DDD6EA] bg-[#FFFEFC] p-6 transition hover:-translate-y-0.5 hover:border-[#684FA0]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F6F3FC] text-[#2E1A5E]">
                    {recommendation.type === "WEAK_TOPIC" ? (
                      <TrendingDown size={19} />
                    ) : recommendation.type === "WRONG_ANSWERS" ? (
                      <CircleAlert size={19} />
                    ) : (
                      <BookOpen size={19} />
                    )}
                  </div>

                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#7A7388]">
                    {priorityLabel[recommendation.priority]}
                  </span>
                </div>

                <h3 className="mt-6 text-lg font-bold">
                  {recommendation.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#686176]">
                  {recommendation.description}
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#2E1A5E]">
                  {recommendation.actionLabel}
                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-[#DDD6EA] bg-[#FFFEFC] p-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#7A7388]">
              Weakness map
            </p>

            <h2 className="mt-1 text-xl font-bold">
              Areas that need more work
            </h2>

            <p className="mt-2 text-sm text-[#686176]">
              Basira only marks an area as weak after you have actually
              attempted questions from it.
            </p>
          </div>

          {weaknesses.length === 0 ? (
            <div className="mt-6 rounded-2xl bg-[#F6F3FC] p-6 text-center">
              <p className="font-semibold">
                No weak areas detected yet.
              </p>
              <p className="mt-1 text-sm text-[#686176]">
                Keep practicing. Basira will identify patterns as your real
                performance history grows.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {weaknesses.map((weakness) => (
                <Link
                  key={weakness.id}
                  href={`/learn/${weakness.subjectSlug}/${weakness.topicSlug}`}
                  className="group rounded-2xl border border-[#E8E2F0] p-4 transition hover:border-[#684FA0]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">
                        {weakness.topic}
                      </p>

                      <p className="mt-1 text-xs text-[#7A7388]">
                        {weakness.subject}
                      </p>
                    </div>

                    <span className="font-mono text-sm font-bold">
                      {weakness.masteryPercent}%
                    </span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#EAE5F2]">
                    <div
                      className="h-full rounded-full bg-[#E5595B]"
                      style={{
                        width: `${weakness.masteryPercent}%`,
                      }}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-[#7A7388]">
                    <span>
                      {weakness.questionsCorrect}/
                      {weakness.questionsAttempted} correct
                    </span>

                    <span className="font-semibold text-[#2E1A5E]">
                      {weakness.priority === "HIGH"
                        ? "High priority"
                        : "Needs attention"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
