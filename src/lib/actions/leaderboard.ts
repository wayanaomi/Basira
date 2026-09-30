"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  name: string;
  xp: number;
  isCurrentUser: boolean;
};

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const session = await auth();

  if (!session?.user?.id) {
    return [];
  }

  const currentUserId = session.user.id;

  const totals = await prisma.xPTransaction.groupBy({
    by: ["userId"],
    _sum: {
      amount: true,
    },
    orderBy: {
      _sum: {
        amount: "desc",
      },
    },
  });

  if (totals.length === 0) {
    return [];
  }

  const users = await prisma.user.findMany({
    where: {
      id: {
        in: totals.map((entry) => entry.userId),
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  const userMap = new Map(users.map((user) => [user.id, user]));

  return totals.map((entry, index) => {
    const user = userMap.get(entry.userId);

    return {
      rank: index + 1,
      userId: entry.userId,
      name: user?.name?.trim() || "Learner",
      xp: entry._sum.amount ?? 0,
      isCurrentUser: entry.userId === currentUserId,
    };
  });
}
