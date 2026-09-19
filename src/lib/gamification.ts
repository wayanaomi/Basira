import "server-only";

import { prisma } from "@/lib/prisma";
import { XP_AMOUNTS, type XpReason } from "@/lib/constants";

/** Records an XP transaction. Never call this for meaningless actions (see brand rules). */
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
  progressToNext: number; // 0-1
}

/** Levels are system content (seeded), never hard-coded per user. */
export async function getLevelForXp(xpTotal: number): Promise<LevelInfo> {
  const levels = await prisma.level.findMany({ orderBy: { minXp: "asc" } });

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
    ? Math.min(1, (xpTotal - current.minXp) / (next.minXp - current.minXp))
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
 * Updates the user's streak based on today's activity. Safe to call multiple
 * times per day — only the first call of a given day advances the streak.
 */
export async function recordStreakActivity(userId: string) {
  const today = startOfUtcDay(new Date());

  const streak = await prisma.streak.upsert({
    where: { userId },
    create: { userId, currentStreak: 0, longestStreak: 0 },
    update: {},
  });

  if (streak.lastActiveDate && isSameUtcDay(streak.lastActiveDate, today)) {
    return streak; // already counted today
  }

  const wasYesterday =
    streak.lastActiveDate &&
    isSameUtcDay(streak.lastActiveDate, addUtcDays(today, -1));

  const currentStreak = wasYesterday ? streak.currentStreak + 1 : 1;
  const longestStreak = Math.max(streak.longestStreak, currentStreak);

  return prisma.streak.update({
    where: { userId },
    data: { currentStreak, longestStreak, lastActiveDate: today },
  });
}

/** Recomputes mastery for a topic from real question-attempt history — never fabricated. */
export async function updateTopicMastery(userId: string, topicId: string) {
  const attempts = await prisma.questionAttempt.findMany({
    where: { userId, question: { topicId } },
    select: { isCorrect: true },
  });

  const questionsAttempted = attempts.length;
  const questionsCorrect = attempts.filter((a) => a.isCorrect).length;
  const masteryPercent =
    questionsAttempted === 0
      ? 0
      : Math.round((questionsCorrect / questionsAttempted) * 100);

  return prisma.topicMastery.upsert({
    where: { userId_topicId: { userId, topicId } },
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
}

export async function logDailyGoalMinutes(userId: string, minutes: number) {
  const today = startOfUtcDay(new Date());
  const profile = await prisma.studentProfile.findUnique({ where: { userId } });
  const goalMinutes = profile?.dailyGoalMinutes ?? 10;

  const existing = await prisma.dailyGoalLog.findUnique({
    where: { userId_date: { userId, date: today } },
  });

  const minutesStudied = (existing?.minutesStudied ?? 0) + minutes;
  const goalMet = minutesStudied >= goalMinutes;
  const justMetGoal = goalMet && !(existing?.goalMet ?? false);

  await prisma.dailyGoalLog.upsert({
    where: { userId_date: { userId, date: today } },
    create: { userId, date: today, minutesStudied, goalMinutes, goalMet },
    update: { minutesStudied, goalMinutes, goalMet },
  });

  if (justMetGoal) {
    await awardXp(userId, "DAILY_GOAL");
  }

  return { minutesStudied, goalMinutes, goalMet, justMetGoal };
}

export function startOfUtcDay(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function addUtcDays(date: Date, days: number) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function isSameUtcDay(a: Date, b: Date) {
  return startOfUtcDay(a).getTime() === startOfUtcDay(b).getTime();
}
