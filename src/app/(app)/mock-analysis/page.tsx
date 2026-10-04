import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BarChart3,
  Clock3,
  Target,
  Trophy,
} from "lucide-react";

import { getAdvancedMockAnalysis } from "@/lib/actions/mock-analysis";
import { Button } from "@/components/ui/Button";

function formatTime(seconds: number) {
  if (seconds <= 0) return "—";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes === 0) {
    return `${remainingSeconds}s`;
  }

  return `${minutes}m ${remainingSeconds}s`;
}

function accuracyLabel(accuracy: number) {
  if (accuracy >= 80) return "Strong";
  if (accuracy >= 60) return "Developing";
  return "Needs attention";
}

function AccuracyBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-[#F0ECF6]">
      <div
        className="h-full rounded-full bg-[#2E1A5E] transition-all"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
}

export default async function MockAnalysisPage() {
  const analysis = await getAdvancedMockAnalysis();

  if (!analysis.isPro) {
    return (
      <main className="mx-auto max-w-5xl px-5 py-10">
        <div className="rounded-3xl border border-[#E8E2F1] bg-[#FFFEFC] p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0EBF8]">
            <BarChart3 className="h-7 w-7 text-[#2E1A5E]" />
          </div>

          <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#684FA0]">
            Basira Pro
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#1B1030]">
            Unlock advanced mock analysis
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#665D76]">
            See your mock performance by subject and topic, compare your
            progress over time and get focused revision guidance with Basira
            Pro.
          </p>

          <div className="mt-6">
            <Link href="/upgrade">
              <Button>Upgrade to Basira Pro</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!analysis.hasData || !analysis.latest) {
    return (
      <main className="mx-auto max-w-5xl px-5 py-10">
        <div className="rounded-3xl border border-[#E8E2F1] bg-[#FFFEFC] p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0EBF8]">
            <BarChart3 className="h-7 w-7 text-[#2E1A5E]" />
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-[#1B1030]">
            Your mock analysis will appear here
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#665D76]">
            Complete a mock exam and Basira will break down your performance
            by subject, topic, accuracy, time and progress over time.
          </p>

          <div className="mt-6">
            <Link href="/mock">
              <Button>Take a mock exam</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const latest = analysis.latest;
  const comparison = analysis.comparison;

  return (
    <main className="mx-auto max-w-6xl px-5 py-8 lg:px-8">
      <div className="mb-8">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#684FA0]">
          Basira Pro
        </p>

        <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#1B1030]">
              Mock analysis
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#665D76]">
              See exactly where you performed well, where you lost marks and
              what deserves your attention next.
            </p>
          </div>

          <Link href="/mock">
            <Button variant="secondary">Take another mock</Button>
          </Link>
        </div>
      </div>

      {/* Latest mock overview */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#E8E2F1] bg-[#FFFEFC] p-5">
          <div className="flex items-center gap-2 text-[#665D76]">
            <Target className="h-4 w-4" />
            <span className="text-xs font-medium">Score</span>
          </div>

          <p className="mt-3 font-mono text-3xl font-bold text-[#1B1030]">
            {latest.score}
            <span className="text-base font-normal text-[#8B829A]">
              /{latest.totalQuestions}
            </span>
          </p>

          <p className="mt-1 text-xs text-[#8B829A]">
            {latest.accuracy}% accuracy
          </p>
        </div>

        <div className="rounded-2xl border border-[#E8E2F1] bg-[#FFFEFC] p-5">
          <div className="flex items-center gap-2 text-[#665D76]">
            <BarChart3 className="h-4 w-4" />
            <span className="text-xs font-medium">Accuracy</span>
          </div>

          <p className="mt-3 font-mono text-3xl font-bold text-[#1B1030]">
            {latest.accuracy}%
          </p>

          <p className="mt-1 text-xs text-[#8B829A]">
            {accuracyLabel(latest.accuracy)}
          </p>
        </div>

        <div className="rounded-2xl border border-[#E8E2F1] bg-[#FFFEFC] p-5">
          <div className="flex items-center gap-2 text-[#665D76]">
            <Clock3 className="h-4 w-4" />
            <span className="text-xs font-medium">Time used</span>
          </div>

          <p className="mt-3 font-mono text-3xl font-bold text-[#1B1030]">
            {formatTime(latest.timeSpentSeconds)}
          </p>

          <p className="mt-1 text-xs text-[#8B829A]">
            Across {latest.totalQuestions} questions
          </p>
        </div>

        <div className="rounded-2xl border border-[#E8E2F1] bg-[#FFFEFC] p-5">
          <div className="flex items-center gap-2 text-[#665D76]">
            <Trophy className="h-4 w-4" />
            <span className="text-xs font-medium">Mocks completed</span>
          </div>

          <p className="mt-3 font-mono text-3xl font-bold text-[#1B1030]">
            {analysis.totalMocks}
          </p>

          <p className="mt-1 text-xs text-[#8B829A]">
            Keep building your history
          </p>
        </div>
      </section>

      {/* Comparison */}
      {comparison && (
        <section className="mt-6 rounded-2xl border border-[#E8E2F1] bg-[#F6F3FC] p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#684FA0]">
                Since your previous mock
              </p>

              <h2 className="mt-1 text-xl font-semibold text-[#1B1030]">
                {comparison.accuracyChange > 0
                  ? "You're moving in the right direction."
                  : comparison.accuracyChange < 0
                    ? "This is a useful signal for your next revision."
                    : "Your accuracy stayed level."}
              </h2>
            </div>

            <div className="flex flex-wrap gap-6">
              <div>
                <p className="text-xs text-[#8B829A]">Accuracy</p>
                <div className="mt-1 flex items-center gap-1 font-mono font-semibold">
                  {comparison.accuracyChange > 0 ? (
                    <ArrowUp className="h-4 w-4 text-[#3FAE6B]" />
                  ) : comparison.accuracyChange < 0 ? (
                    <ArrowDown className="h-4 w-4 text-[#E5595B]" />
                  ) : null}

                  <span>
                    {comparison.accuracyChange > 0 ? "+" : ""}
                    {comparison.accuracyChange}%
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs text-[#8B829A]">Score</p>
                <p className="mt-1 font-mono font-semibold">
                  {comparison.scoreChange > 0 ? "+" : ""}
                  {comparison.scoreChange}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#8B829A]">Time</p>
                <p className="mt-1 font-mono font-semibold">
                  {comparison.timeChangeSeconds > 0 ? "+" : ""}
                  {formatTime(comparison.timeChangeSeconds)}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        {/* Subject performance */}
        <section className="rounded-2xl border border-[#E8E2F1] bg-[#FFFEFC] p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#1B1030]">
              Subject performance
            </h2>

            <p className="mt-1 text-sm text-[#665D76]">
              Your performance across the latest mock.
            </p>
          </div>

          <div className="space-y-6">
            {latest.subjects.map((subject) => (
              <div key={subject.subjectId}>
                <div className="mb-2 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[#1B1030]">
                      {subject.subject}
                    </p>

                    <p className="mt-0.5 text-xs text-[#8B829A]">
                      {subject.correct}/{subject.total} correct
                    </p>
                  </div>

                  <span className="font-mono text-sm font-semibold text-[#2E1A5E]">
                    {subject.accuracy}%
                  </span>
                </div>

                <AccuracyBar value={subject.accuracy} />
              </div>
            ))}
          </div>
        </section>

        {/* Strengths */}
        <section className="space-y-6">
          <div className="rounded-2xl border border-[#E8E2F1] bg-[#FFFEFC] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#3FAE6B]">
              Strongest
            </p>

            {analysis.strongestSubject ? (
              <>
                <h2 className="mt-2 text-lg font-semibold text-[#1B1030]">
                  {analysis.strongestSubject.subject}
                </h2>

                <p className="mt-1 font-mono text-2xl font-bold text-[#3FAE6B]">
                  {analysis.strongestSubject.accuracy}%
                </p>

                <p className="mt-1 text-xs text-[#8B829A]">
                  Across {analysis.strongestSubject.total} questions
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm text-[#665D76]">
                Not enough data yet.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-[#F0D9D9] bg-[#FFF9F8] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#E5595B]">
              Needs attention
            </p>

            {analysis.weakestSubject ? (
              <>
                <h2 className="mt-2 text-lg font-semibold text-[#1B1030]">
                  {analysis.weakestSubject.subject}
                </h2>

                <p className="mt-1 font-mono text-2xl font-bold text-[#E5595B]">
                  {analysis.weakestSubject.accuracy}%
                </p>

                <p className="mt-1 text-xs text-[#8B829A]">
                  Review this subject before your next mock.
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm text-[#665D76]">
                Not enough data yet.
              </p>
            )}
          </div>
        </section>
      </div>

      {/* Topic performance */}
      <section className="mt-6 rounded-2xl border border-[#E8E2F1] bg-[#FFFEFC] p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#1B1030]">
            Topic performance
          </h2>

          <p className="mt-1 text-sm text-[#665D76]">
            The topics where your answers were strongest and weakest.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#E5595B]" />
              <h3 className="text-sm font-semibold text-[#1B1030]">
                Focus first
              </h3>
            </div>

            <div className="space-y-4">
              {latest.topics.slice(0, 5).map((topic) => (
                <div
                  key={topic.topicId}
                  className="rounded-xl border border-[#EFEAF4] p-4"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[#1B1030]">
                        {topic.topic}
                      </p>
                      <p className="mt-1 text-xs text-[#8B829A]">
                        {topic.subject}
                      </p>
                    </div>

                    <span className="font-mono text-sm font-semibold text-[#E5595B]">
                      {topic.accuracy}%
                    </span>
                  </div>

                  <div className="mt-3">
                    <AccuracyBar value={topic.accuracy} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#3FAE6B]" />
              <h3 className="text-sm font-semibold text-[#1B1030]">
                Strongest topics
              </h3>
            </div>

            <div className="space-y-4">
              {[...latest.topics]
                .sort((a, b) => b.accuracy - a.accuracy)
                .slice(0, 5)
                .map((topic) => (
                  <div
                    key={topic.topicId}
                    className="rounded-xl border border-[#EFEAF4] p-4"
                  >
                    <div className="flex justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-[#1B1030]">
                          {topic.topic}
                        </p>
                        <p className="mt-1 text-xs text-[#8B829A]">
                          {topic.subject}
                        </p>
                      </div>

                      <span className="font-mono text-sm font-semibold text-[#3FAE6B]">
                        {topic.accuracy}%
                      </span>
                    </div>

                    <div className="mt-3">
                      <AccuracyBar value={topic.accuracy} />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Revision recommendation */}
      {analysis.weakestTopic && (
        <section className="mt-6 rounded-2xl bg-[#2E1A5E] p-6 text-white">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#E8A93F]">
                Your next revision
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Spend some time on {analysis.weakestTopic.topic}.
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
                It is currently your weakest topic based on your mock
                performance. Strengthening it should be more useful than
                revising everything at once.
              </p>
            </div>

            <Link
              href={`/learn/${analysis.weakestTopic.subjectSlug}/${analysis.weakestTopic.topicSlug}`}
            >
              <Button className="bg-white text-[#2E1A5E] hover:bg-white/90">
                Review topic
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Mock history */}
      <section className="mt-6 rounded-2xl border border-[#E8E2F1] bg-[#FFFEFC] p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#1B1030]">
            Mock history
          </h2>

          <p className="mt-1 text-sm text-[#665D76]">
            Your recent submitted mocks.
          </p>
        </div>

        <div className="divide-y divide-[#EFEAF4]">
          {[...analysis.attempts]
            .reverse()
            .slice(0, 8)
            .map((attempt) => (
              <div
                key={attempt.id}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-[#1B1030]">
                    {attempt.mockTitle}
                  </p>

                  <p className="mt-1 text-xs text-[#8B829A]">
                    {attempt.submittedAt
                      ? new Date(attempt.submittedAt).toLocaleDateString()
                      : "Submitted"}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-xs text-[#8B829A]">Score</p>
                    <p className="font-mono text-sm font-semibold">
                      {attempt.score}/{attempt.totalQuestions}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#8B829A]">Accuracy</p>
                    <p className="font-mono text-sm font-semibold">
                      {attempt.accuracy}%
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#8B829A]">Time</p>
                    <p className="font-mono text-sm font-semibold">
                      {formatTime(attempt.timeSpentSeconds)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Timing limitation */}
      <div className="mt-5 flex items-start gap-3 rounded-xl border border-[#E8E2F1] bg-[#F8F6FB] p-4">
        <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[#684FA0]" />

        <p className="text-xs leading-5 text-[#665D76]">
          Basira currently records total mock time, but not time spent on
          individual questions. Question-level speed analysis will become
          available once per-question timing is added to mock answers.
        </p>
      </div>
    </main>
  );
}