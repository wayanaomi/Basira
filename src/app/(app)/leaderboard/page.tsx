import { auth } from "@/auth";
import { getLeaderboard } from "@/lib/actions/leaderboard";
import { redirect } from "next/navigation";

export default async function LeaderboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const leaderboard = await getLeaderboard();

  const currentUser = leaderboard.find((entry) => entry.isCurrentUser);

  return (
    <main className="mx-auto w-full max-w-4xl px-5 py-8 pb-24 md:px-8 md:py-10 md:pb-10">
      <div className="max-w-2xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-indigo/45">
          Community
        </p>

        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-indigo sm:text-4xl">
          Leaderboard
        </h1>

        <p className="mt-2 text-sm leading-6 text-ink/60">
          See how much XP learners have earned through real study activity.
        </p>
      </div>

      {currentUser && (
        <div className="mt-8 rounded-2xl border border-indigo/15 bg-indigo/[0.04] p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-indigo/50">
                Your position
              </p>

              <p className="mt-1 font-display text-lg font-semibold text-indigo">
                #{currentUser.rank} · {currentUser.name}
              </p>
            </div>

            <p className="font-mono text-lg font-semibold text-indigo">
              {currentUser.xp.toLocaleString()} XP
            </p>
          </div>
        </div>
      )}

      <section className="mt-8">
        {leaderboard.length === 0 ? (
          <div className="rounded-3xl border border-indigo/10 bg-paper p-8 text-center">
            <h2 className="font-display text-xl font-semibold text-indigo">
              Your leaderboard is waiting.
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink/55">
              Earn XP by completing real study activities. As more learners
              earn XP, the leaderboard will grow with them.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-indigo/10 bg-paper shadow-sm">
            <div className="border-b border-ink/10 px-5 py-4">
              <div className="grid grid-cols-[48px_1fr_auto] items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/40">
                <span>Rank</span>
                <span>Learner</span>
                <span>XP</span>
              </div>
            </div>

            <div>
              {leaderboard.map((entry) => (
                <div
                  key={entry.userId}
                  className={`grid grid-cols-[48px_1fr_auto] items-center gap-4 border-b border-ink/5 px-5 py-4 last:border-b-0 ${
                    entry.isCurrentUser ? "bg-indigo/[0.04]" : ""
                  }`}
                >
                  <span className="font-mono text-sm font-semibold text-indigo/60">
                    #{entry.rank}
                  </span>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">
                      {entry.name}
                    </p>

                    {entry.isCurrentUser && (
                      <p className="mt-0.5 text-xs font-medium text-indigo">
                        You
                      </p>
                    )}
                  </div>

                  <span className="font-mono text-sm font-semibold text-indigo">
                    {entry.xp.toLocaleString()} XP
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
