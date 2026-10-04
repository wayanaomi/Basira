"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { requirePro } from "@/lib/subscription";

export async function getWrongAnswers() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Not authenticated.");
  }

  const userId = session.user.id;

  await requirePro(userId);

  const attempts = await prisma.questionAttempt.findMany({
    where: {
      userId,
    },
    orderBy: {
      attemptedAt: "desc",
    },
    select: {
      questionId: true,
      selectedOptionId: true,
      isCorrect: true,
      attemptedAt: true,
    },
  });

  const latestAttempts = new Map<
    string,
    {
      questionId: string;
      selectedOptionId: string | null;
      isCorrect: boolean;
      attemptedAt: Date;
    }
  >();

  for (const attempt of attempts) {
    if (!latestAttempts.has(attempt.questionId)) {
      latestAttempts.set(attempt.questionId, attempt);
    }
  }

  const wrongQuestionIds = Array.from(latestAttempts.values())
    .filter((attempt) => !attempt.isCorrect)
    .map((attempt) => attempt.questionId);

  if (wrongQuestionIds.length === 0) {
    return [];
  }

  const questions = await prisma.question.findMany({
    where: {
      id: {
        in: wrongQuestionIds,
      },
    },
    include: {
      options: {
        orderBy: {
          order: "asc",
        },
      },
      topic: {
        include: {
          subject: true,
        },
      },
    },
  });

  const questionMap = new Map(
    questions.map((question) => [question.id, question]),
  );

  const missCounts = await prisma.questionAttempt.groupBy({
    by: ["questionId"],
    where: {
      userId,
      questionId: {
        in: wrongQuestionIds,
      },
      isCorrect: false,
    },
    _count: {
      questionId: true,
    },
  });

  const missCountMap = new Map(
    missCounts.map((item) => [
      item.questionId,
      item._count.questionId,
    ]),
  );

  return wrongQuestionIds
    .map((questionId) => {
      const question = questionMap.get(questionId);
      const latestAttempt = latestAttempts.get(questionId);

      if (!question || !latestAttempt) {
        return null;
      }

      return {
        id: question.id,
        prompt: question.prompt,
        explanation: question.explanation,
        subject: question.topic.subject.name,
        subjectSlug: question.topic.subject.slug,
        topic: question.topic.name,
        selectedOptionId: latestAttempt.selectedOptionId,
        attemptedAt: latestAttempt.attemptedAt,
        missCount: missCountMap.get(questionId) ?? 1,
        options: question.options.map((option) => ({
          id: option.id,
          text: option.text,
          isCorrect: option.isCorrect,
        })),
      };
    })
    .filter(
  (
    item,
  ): item is NonNullable<typeof item> => item !== null,
);
}
