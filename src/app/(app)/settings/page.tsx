import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updateSettings } from "@/lib/actions/settings";
import { DAILY_GOAL_OPTIONS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { SignOutButton } from "@/components/navigation/SignOutButton";

export default async function SettingsPage() {
  const session = await auth();
  const userId = session!.user.id;

  const profile = await prisma.studentProfile.findUnique({
    where: { userId },
    include: { exam: true },
  });

  return (
    <div className="mx-auto max-w-lg px-6 py-8">
      <h1 className="font-display text-2xl font-semibold text-indigo">Settings</h1>

      <form action={updateSettings} className="mt-6 flex flex-col gap-5 rounded-3xl bg-paper p-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink/50">Exam</p>
          <p className="mt-1 text-sm text-ink/80">{profile?.exam?.name ?? "Not set"}</p>
        </div>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-ink/80">Daily goal (minutes)</span>
          <select name="dailyGoalMinutes" defaultValue={profile?.dailyGoalMinutes ?? 10} className="input">
            {DAILY_GOAL_OPTIONS.map((m) => (
              <option key={m} value={m}>
                {m} minutes
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-ink/80">Target score / band</span>
          <input
            name="targetScore"
            defaultValue={profile?.targetScore ?? ""}
            className="input"
            placeholder="e.g. 300, or Band 7.0"
          />
        </label>

        <Button type="submit" className="self-start">
          Save changes
        </Button>
      </form>

      <div className="mt-6 rounded-3xl bg-paper p-6">
        <p className="text-sm font-medium text-ink/80">Account</p>
        <p className="mt-1 text-xs text-ink/50">{session!.user.email}</p>
        <SignOutButton className="mt-4 text-sm font-medium text-alert" />
      </div>
    </div>
  );
}
