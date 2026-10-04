import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserSubscription } from "@/lib/subscription";
import { SELAR_BASIRA_PRO_URL } from "@/lib/constants";

export default async function UpgradePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const subscription = await getUserSubscription(session.user.id);
  const isPro = subscription?.plan === "PRO";

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link
        href="/dashboard"
        className="text-sm text-ink/60 hover:text-indigo"
      >
        ← Back to dashboard
      </Link>

      <div className="mt-8 rounded-3xl bg-paper p-8 shadow-sm">
        <p className="font-mono-basira text-xs uppercase tracking-wider text-gold">
          BASIRA PRO
        </p>

        <h1 className="mt-3 font-display text-3xl font-semibold text-indigo">
          Prepare smarter. Know where you stand.
        </h1>

        <p className="mt-3 max-w-xl text-ink/65">

        </p>

        <div className="mt-8">
          <p className="font-mono-basira text-4xl font-semibold text-indigo">
            ₦725
            <span className="ml-2 text-sm font-normal text-ink/50">
              / month
            </span>
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {[
            "Unlimited personalized mock practice",
            "Advanced mock performance analysis",
            "Wrong Answers Bank",
            "Advanced exam readiness",
            "Personalized study recommendations",
            "Detailed topic performance",
            "Pro study planning",
            "Streak protection",
          ].map((feature) => (
            <div
              key={feature}
              className="rounded-xl border border-indigo/10 px-4 py-3 text-sm text-ink/75"
            >
              {feature}
            </div>
          ))}
        </div>

        {isPro ? (
          <div className="mt-8 rounded-2xl bg-sage/10 p-5">
            <p className="font-semibold text-indigo">
              You already have Basira Pro.
            </p>
            <p className="mt-1 text-sm text-ink/60">
              Your Pro access is currently active.
            </p>
          </div>
        ) : (
          <div className="mt-8">
            <a
              href={SELAR_BASIRA_PRO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-xl bg-indigo px-6 py-3 font-medium text-white transition hover:opacity-90 sm:w-auto"
            >
              Upgrade to Pro — ₦725/month
            </a>

            <p className="mt-3 text-xs text-ink/45">
              Your Pro access will be activated after payment confirmation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
