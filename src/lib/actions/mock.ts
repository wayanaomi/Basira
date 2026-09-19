"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { awardXp, recordStreakActivity, updateTopicMastery, logDailyGoalMinutes } from "@/lib/gamification";

export async function startMockAttempt(mockExamId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated.");
  const userId = session.user.id;

  const existing = await prisma.mockExamAttempt.findFirst({
    where: { userId, mockExamId, status: "IN_PROGRESS" },
  });
  if (existing) return existing.id;

  const mockExam = await prisma.mockExam.findUniqueOrThrow({
    where: { id: mockExamId },
    include: { questions: true },
  });

  const attempt = await prisma.mockExamAttempt.create({
    data: {
      userId,
      mockExamId,
      totalQuestions: mockExam.questions.length,
    },
  });

  return attempt.id;
}

export async function saveMockAnswer({
  attemptId,
  questionId,
  selectedOptionId,
}: {
  attemptId: string;
  questionId: string;
  selectedOptionId: string;
}) {
  const question = await prisma.question.findUniqueOrThrow({
    where: { id: questionId },
    include: { options: true },
  });
  const isCorrect = question.options.some((o) => o.id === selectedOptionId && o.isCorrect);

  await prisma.mockExamAnswer.upsert({
    where: { attemptId_questionId: { attemptId, questionId } },
    create: { attemptId, questionId, selectedOptionId, isCorrect },
    update: { selectedOptionId, isCorrect },
  });
}

export async function submitMockExam(attemptId: string, timeSpentSeconds: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated.");
  const userId = session.user.id;

  const attempt = await prisma.mockExamAttempt.findUniqueOrThrow({
    where: { id: attemptId },
    include: { answers: { include: { question: true } } },
  });

  const correctCount = attempt.answers.filter((a) => a.isCorrect).length;
  const score =
    attempt.totalQuestions === 0
      ? 0
      : Math.round((correctCount / attempt.totalQuestions) * 100);

  await prisma.mockExamAttempt.update({
    where: { id: attemptId },
    data: { status: "SUBMITTED", submittedAt: new Date(), score, timeSpentSeconds },
  });

  // Record each answer as a real question attempt too, so mastery/readiness reflect it.
  const topicIds = new Set<string>();
  for (const answer of attempt.answers) {
    await prisma.questionAttempt.create({
      data: {
        userId,
        questionId: answer.questionId,
        selectedOptionId: answer.selectedOptionId,
        isCorrect: answer.isCorrect,
        source: "MOCK",
      },
    });
    topicIds.add(answer.question.topicId);
  }
  for (const topicId of topicIds) {
    await updateTopicMastery(userId, topicId);
  }

  await awardXp(userId, "MOCK_COMPLETE", { mockExamId: attempt.mockExamId, score });
  await recordStreakActivity(userId);
  await logDailyGoalMinutes(userId, Math.max(1, Math.round(timeSpentSeconds / 60)));

  return { score, correctCount, totalQuestions: attempt.totalQuestions };
}
