"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { awardXp, recordStreakActivity, updateTopicMastery, logDailyGoalMinutes } from "@/lib/gamification";

export async function submitAnswer({
  questionId,
  selectedOptionId,
  timeSpentMs,
  source = "LESSON",
}: {
  questionId: string;
  selectedOptionId: string;
  timeSpentMs: number;
  source?: "LESSON" | "REVIEW" | "MOCK";
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated.");
  const userId = session.user.id;

  const question = await prisma.question.findUniqueOrThrow({
    where: { id: questionId },
    include: { options: true },
  });

  const selectedOption = question.options.find((o) => o.id === selectedOptionId);
  const isCorrect = selectedOption?.isCorrect ?? false;
  const correctOption = question.options.find((o) => o.isCorrect);

  await prisma.questionAttempt.create({
    data: {
      userId,
      questionId,
      selectedOptionId,
      isCorrect,
      timeSpentMs,
      source,
    },
  });

  if (isCorrect) {
    await awardXp(userId, "CORRECT_ANSWER");
  }

  await updateTopicMastery(userId, question.topicId);

  return {
    isCorrect,
    explanation: question.explanation,
    correctOptionId: correctOption?.id ?? null,
  };
}

export async function completeLesson({
  lessonId,
  correctCount,
  totalCount,
  timeSpentSeconds,
}: {
  lessonId: string;
  correctCount: number;
  totalCount: number;
  timeSpentSeconds: number;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated.");
  const userId = session.user.id;

  const score = totalCount === 0 ? 100 : Math.round((correctCount / totalCount) * 100);

  await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    create: { userId, lessonId, status: "COMPLETED", score, completedAt: new Date() },
    update: { status: "COMPLETED", score, completedAt: new Date() },
  });

  const xpAwarded = await awardXp(userId, "LESSON_COMPLETE", { lessonId });
  const streak = await recordStreakActivity(userId);
  const minutes = Math.max(1, Math.round(timeSpentSeconds / 60));
  const goal = await logDailyGoalMinutes(userId, minutes);

  return { xpAwarded, streak: streak.currentStreak, goal };
}

export async function startLesson(lessonId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated.");
  const userId = session.user.id;

  const existing = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId } },
  });
  if (existing?.status === "COMPLETED") return; // reviewing a completed lesson doesn't reset it

  await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    create: { userId, lessonId, status: "IN_PROGRESS", startedAt: new Date() },
    update: { status: "IN_PROGRESS" },
  });
}
