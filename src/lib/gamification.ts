import "server-only";

import { prisma } from "@/lib/prisma";
import { XP_AMOUNTS, type XpReason } from "@/lib/constants";

/**
 * Awards XP for a real learner action.
 */
export async function awardXp(
  userId: string,
  reason: XpReason,
  metadata?: Record<string, unknown>,
) {
  const amount = XP_AMOUNTS[reason];

  await prisma.xPTransaction.create({
    data: {
      userId,
      amount,
      reason,
      metadata: metadata ? JSON.stringify(metadata) : null,
    },
  });

  return amount;
}

export async function getUserXpTotal(userId: string) {
  const result = await prisma.xPTransaction.aggregate({
    where: { userId },
    _sum: { amount: true },
  });

  return result._sum.amount ?? 0;
}

export interface LevelInfo {
  name: string;
  order: number;
  minXp: number;
  nextLevelName: string | null;
  nextLevelXp: number | null;
  progressToNext: number;
}

/**
 * Levels are system content seeded in the database.
 */
export async function getLevelForXp(xpTotal: number): Promise<LevelInfo> {
  const levels = await prisma.level.findMany({
    orderBy: { minXp: "asc" },
  });

  if (levels.length === 0) {
    return {
      name: "Learner",
      order: 0,
      minXp: 0,
      nextLevelName: null,
      nextLevelXp: null,
      progressToNext: 0,
    };
  }

  let current = levels[0];
  let next: (typeof levels)[number] | null = null;

  for (let i = 0; i < levels.length; i++) {
    if (xpTotal >= levels[i].minXp) {
      current = levels[i];
      next = levels[i + 1] ?? null;
    }
  }

  const progressToNext = next
    ? Math.min(
        1,
        (xpTotal - current.minXp) / (next.minXp - current.minXp),
      )
    : 1;

  return {
    name: current.name,
    order: current.order,
    minXp: current.minXp,
    nextLevelName: next?.name ?? null,
    nextLevelXp: next?.minXp ?? null,
    progressToNext,
  };
}

/**
 * Records meaningful study activity.
 *
 * Safe to call multiple times on the same day.
 * Only the first activity of a calendar day advances the streak.
 */
export async function recordStreakActivity(userId: string) {
  const today = startOfUtcDay(new Date());

  const streak = await prisma.streak.upsert({
    where: { userId },
    create: {
      userId,
      currentStreak: 0,
      longestStreak: 0,
    },
    update: {},
  });

  if (
    streak.lastActiveDate &&
    isSameUtcDay(streak.lastActiveDate, today)
  ) {
    return streak;
  }

  const wasYesterday =
    streak.lastActiveDate &&
    isSameUtcDay(
      streak.lastActiveDate,
      addUtcDays(today, -1),
    );

  const currentStreak = wasYesterday
    ? streak.currentStreak + 1
    : 1;

  const longestStreak = Math.max(
    streak.longestStreak,
    currentStreak,
  );

  return prisma.streak.update({
    where: { userId },
    data: {
      currentStreak,
      longestStreak,
      lastActiveDate: today,
    },
  });
}

/**
 * Recomputes topic mastery from actual question history.
 */
export async function updateTopicMastery(
  userId: string,
  topicId: string,
) {
  const attempts = await prisma.questionAttempt.findMany({
    where: {
      userId,
      question: {
        topicId,
      },
    },
    select: {
      isCorrect: true,
    },
  });

  const questionsAttempted = attempts.length;
  const questionsCorrect = attempts.filter(
    (attempt) => attempt.isCorrect,
  ).length;

  const masteryPercent =
    questionsAttempted === 0
      ? 0
      : Math.round(
          (questionsCorrect / questionsAttempted) * 100,
        );

  const mastery = await prisma.topicMastery.upsert({
    where: {
      userId_topicId: {
        userId,
        topicId,
      },
    },
    create: {
      userId,
      topicId,
      masteryPercent,
      questionsAttempted,
      questionsCorrect,
      lastReviewedAt: new Date(),
    },
    update: {
      masteryPercent,
      questionsAttempted,
      questionsCorrect,
      lastReviewedAt: new Date(),
    },
  });

  return mastery;
}

/**
 * Records actual study time against the learner's daily goal.
 */
export async function logDailyGoalMinutes(
  userId: string,
  minutes: number,
) {
  const safeMinutes = Math.max(
    0,
    Math.round(minutes),
  );

  if (safeMinutes === 0) {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
      select: { dailyGoalMinutes: true },
    });

    return {
      minutesStudied: 0,
      goalMinutes: profile?.dailyGoalMinutes ?? 10,
      goalMet: false,
      justMetGoal: false,
    };
  }

  const today = startOfUtcDay(new Date());

  const profile = await prisma.studentProfile.findUnique({
    where: { userId },
    select: {
      dailyGoalMinutes: true,
    },
  });

  const goalMinutes =
    profile?.dailyGoalMinutes ?? 10;

  const existing = await prisma.dailyGoalLog.findUnique({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
  });

  const minutesStudied =
    (existing?.minutesStudied ?? 0) + safeMinutes;

  const goalMet = minutesStudied >= goalMinutes;

  const justMetGoal =
    goalMet && !(existing?.goalMet ?? false);

  await prisma.dailyGoalLog.upsert({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
    create: {
      userId,
      date: today,
      minutesStudied,
      goalMinutes,
      goalMet,
    },
    update: {
      minutesStudied,
      goalMinutes,
      goalMet,
    },
  });

  if (justMetGoal) {
    await awardXp(userId, "DAILY_GOAL");
    await evaluateAchievements(userId);
  }

  return {
    minutesStudied,
    goalMinutes,
    goalMet,
    justMetGoal,
  };
}

/**
 * Checks real learner activity against achievement definitions.
 *
 * Achievement definitions are seeded system content.
 * UserAchievement rows are created only when the learner actually earns one.
 */
export async function evaluateAchievements(userId: string) {
  const [
    lessonsCompleted,
    questionsAnswered,
    streak,
    masteredTopics,
    mockAttempts,
  ] = await Promise.all([
    prisma.lessonProgress.count({
      where: {
        userId,
        status: "COMPLETED",
      },
    }),

    prisma.questionAttempt.count({
      where: {
        userId,
      },
    }),

    prisma.streak.findUnique({
      where: { userId },
    }),

    prisma.topicMastery.count({
      where: {
        userId,
        masteryPercent: {
          gte: 80,
        },
      },
    }),

    prisma.mockExamAttempt.count({
      where: {
        userId,
        status: "SUBMITTED",
      },
    }),
  ]);

  const earnedKeys: string[] = [];

  if (lessonsCompleted >= 1) {
    earnedKeys.push("FIRST_LESSON");
  }

  if ((streak?.currentStreak ?? 0) >= 3) {
    earnedKeys.push("STREAK_3");
  }

  if ((streak?.currentStreak ?? 0) >= 7) {
    earnedKeys.push("STREAK_7");
  }

  if (questionsAnswered >= 10) {
    earnedKeys.push("QUESTIONS_10");
  }

  if (questionsAnswered >= 50) {
    earnedKeys.push("QUESTIONS_50");
  }

  if (questionsAnswered >= 100) {
    earnedKeys.push("QUESTIONS_100");
  }

  if (masteredTopics >= 1) {
    earnedKeys.push("TOPIC_MASTERY");
  }

  if (mockAttempts >= 1) {
    earnedKeys.push("FIRST_MOCK");
  }

  const achievements = await prisma.achievement.findMany({
    where: {
      key: {
        in: earnedKeys,
      },
    },
  });

  const newlyEarned: string[] = [];

  for (const achievement of achievements) {
    await prisma.userAchievement.upsert({
      where: {
        userId_achievementId: {
          userId,
          achievementId: achievement.id,
        },
      },
      create: {
        userId,
        achievementId: achievement.id,
      },
      update: {},
    });

    const existingXp = await prisma.xPTransaction.findFirst({
      where: {
        userId,
        reason: "ACHIEVEMENT",
        metadata: JSON.stringify({
          achievementId: achievement.id,
        }),
      },
    });

    if (!existingXp) {
      await awardXp(userId, "ACHIEVEMENT", {
        achievementId: achievement.id,
        achievementKey: achievement.key,
      });

      newlyEarned.push(achievement.key);
    }
  }

  return newlyEarned;
}

export function startOfUtcDay(date: Date) {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
    ),
  );
}

function addUtcDays(date: Date, days: number) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function isSameUtcDay(a: Date, b: Date) {
  return (
    startOfUtcDay(a).getTime() ===
    startOfUtcDay(b).getTime()
  );
}
