"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { requirePro } from "@/lib/subscription";

export async function getPerformanceAnalytics() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Not authenticated.");
  }

  const userId = session.user.id;

  await requirePro(userId);

  const [profile, attempts, topicMastery, lessonProgress, mockAttempts] =
    await Promise.all([
      prisma.studentProfile.findUnique({
        where: { userId },
        include: {
          exam: true,
          subjects: {
            include: {
              subject: true,
            },
          },
        },
      }),

      prisma.questionAttempt.findMany({
        where: { userId },
        orderBy: { attemptedAt: "desc" },
        include: {
          question: {
            include: {
              topic: {
                include: {
                  subject: true,
                },
              },
            },
          },
        },
      }),

      prisma.topicMastery.findMany({
        where: { userId },
        include: {
          topic: {
            include: {
              subject: true,
            },
          },
        },
        orderBy: {
          masteryPercent: "asc",
        },
      }),

      prisma.lessonProgress.findMany({
        where: { userId },
        include: {
          lesson: {
            include: {
              topic: {
                include: {
                  subject: true,
                },
              },
            },
          },
        },
        orderBy: {
          completedAt: "desc",
        },
      }),

      prisma.mockExamAttempt.findMany({
        where: {
          userId,
          submittedAt: {
            not: null,
          },
        },
        orderBy: {
          startedAt: "desc",
        },
      }),
    ]);

  const totalQuestions = attempts.length;
  const correctQuestions = attempts.filter(
    (attempt) => attempt.isCorrect,
  ).length;

  const incorrectQuestions = totalQuestions - correctQuestions;

  const overallAccuracy =
    totalQuestions === 0
      ? 0
      : Math.round((correctQuestions / totalQuestions) * 100);

  const subjectMap = new Map<
    string,
    {
      id: string;
      name: string;
      slug: string;
      attempted: number;
      correct: number;
    }
  >();

  for (const attempt of attempts) {
    const subject = attempt.question.topic.subject;

    const existing = subjectMap.get(subject.id) ?? {
      id: subject.id,
      name: subject.name,
      slug: subject.slug,
      attempted: 0,
      correct: 0,
    };

    existing.attempted += 1;

    if (attempt.isCorrect) {
      existing.correct += 1;
    }

    subjectMap.set(subject.id, existing);
  }

  const subjects = Array.from(subjectMap.values())
    .map((subject) => ({
      ...subject,
      accuracy:
        subject.attempted === 0
          ? 0
          : Math.round((subject.correct / subject.attempted) * 100),
    }))
    .sort((a, b) => b.accuracy - a.accuracy);

  const topics = topicMastery
    .map((mastery) => ({
      id: mastery.topic.id,
      name: mastery.topic.name,
      slug: mastery.topic.slug,
      subject: mastery.topic.subject.name,
      subjectSlug: mastery.topic.subject.slug,
      masteryPercent: mastery.masteryPercent,
      questionsAttempted: mastery.questionsAttempted,
      questionsCorrect: mastery.questionsCorrect,
      lastReviewedAt: mastery.lastReviewedAt,
    }))
    .sort((a, b) => a.masteryPercent - b.masteryPercent);

  const completedLessons = lessonProgress.filter(
    (progress) => progress.status === "COMPLETED",
  ).length;

  const recentAttempts = attempts.slice(0, 10).map((attempt) => ({
    id: attempt.id,
    isCorrect: attempt.isCorrect,
    attemptedAt: attempt.attemptedAt,
    subject: attempt.question.topic.subject.name,
    topic: attempt.question.topic.name,
  }));

  const recentCorrect = recentAttempts.filter(
    (attempt) => attempt.isCorrect,
  ).length;

  const recentAccuracy =
    recentAttempts.length === 0
      ? 0
      : Math.round((recentCorrect / recentAttempts.length) * 100);

  const strongestSubject = subjects[0] ?? null;
  const weakestSubject = subjects[subjects.length - 1] ?? null;

  const strongestTopic =
    topics.length > 0 ? [...topics].sort(
      (a, b) => b.masteryPercent - a.masteryPercent,
    )[0] : null;

  const weakestTopic = topics[0] ?? null;

  const submittedMocks = mockAttempts.length;

  const averageMockScore =
    submittedMocks === 0
      ? null
      : Math.round(
          mockAttempts.reduce(
            (sum, attempt) => sum + (attempt.score ?? 0),
            0,
          ) / submittedMocks,
        );

  return {
    exam: profile?.exam
      ? {
          name: profile.exam.name,
          shortName: profile.exam.shortName,
        }
      : null,

    targetScore: profile?.targetScore ?? null,

    summary: {
      totalQuestions,
      correctQuestions,
      incorrectQuestions,
      overallAccuracy,
      recentAccuracy,
      completedLessons,
      submittedMocks,
      averageMockScore,
    },

    subjects,

    topics,

    recentAttempts,

    strongestSubject,

    weakestSubject,

    strongestTopic,

    weakestTopic,
  };
}
