import { prisma } from "@/lib/prisma";
import { activatePro, deactivatePro } from "@/lib/actions/admin-users";

function ActivateButton({ userId }: { userId: string }) {
  return (
    <form
      action={async () => {
        "use server";
        await activatePro(userId);
      }}
    >
      <button
        type="submit"
        className="rounded-lg bg-indigo px-3 py-2 text-xs font-medium text-white hover:opacity-90"
      >
        Activate Pro
      </button>
    </form>
  );
}

function DeactivateButton({ userId }: { userId: string }) {
  return (
    <form
      action={async () => {
        "use server";
        await deactivatePro(userId);
      }}
    >
      <button
        type="submit"
        className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
      >
        Remove Pro
      </button>
    </form>
  );
}

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    where: {
      role: "STUDENT",
    },
    include: {
      subscription: true,
      profile: {
        include: {
          exam: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div>
        <a
          href="/admin"
          className="text-sm text-ink/50 hover:text-indigo"
        >
          ← Admin dashboard
        </a>

        <h1 className="mt-4 font-display text-2xl font-semibold text-indigo">
          Students
        </h1>

        <p className="mt-1 text-sm text-ink/60">
          Manage student accounts and Pro access.
        </p>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl bg-paper">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-indigo/10 text-xs uppercase tracking-wide text-ink/45">
                <th className="px-5 py-4">Student</th>
                <th className="px-5 py-4">Exam</th>
                <th className="px-5 py-4">Plan</th>
                <th className="px-5 py-4">Joined</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => {
                const isPro =
                  user.subscription?.plan === "PRO" &&
                  user.subscription.status === "ACTIVE" &&
                  (!user.subscription.expiresAt ||
                    user.subscription.expiresAt > new Date());

                return (
                  <tr
                    key={user.id}
                    className="border-b border-indigo/5 last:border-0"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-indigo">
                        {user.name || "Unnamed student"}
                      </p>
                      <p className="text-xs text-ink/45">{user.email}</p>
                    </td>

                    <td className="px-5 py-4 text-ink/65">
                      {user.profile?.exam?.shortName || "Not selected"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={
                          isPro
                            ? "rounded-full bg-gold/15 px-3 py-1 text-xs font-medium text-indigo"
                            : "rounded-full bg-ink/5 px-3 py-1 text-xs text-ink/55"
                        }
                      >
                        {isPro ? "PRO" : "FREE"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-xs text-ink/50">
                      {user.createdAt.toLocaleDateString()}
                    </td>

                    <td className="px-5 py-4">
                      {isPro ? (
                        <DeactivateButton userId={user.id} />
                      ) : (
                        <ActivateButton userId={user.id} />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="px-5 py-12 text-center text-sm text-ink/45">
            No students yet.
          </div>
        )}
      </div>
    </div>
  );
}
