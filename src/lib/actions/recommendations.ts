"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isPro } from "@/lib/subscription";

type Recommendation = {
  id: string;
  type: "WEAK_TOPIC" | "WRONG_ANSWERS" | "MOCK" | "CONTINUE";
  title: string;
  description: string;
  href: string;
  actionLabel: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
};

export async function getPersonalizedRecommendations() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;
  const pro = await isPro(userId);

  if (!pro) {
    return {
      isPro: false,
      recommendations: [],
      weaknesses: [],
      hasActivity: false,
    };
  }

  const [masteries, recentAttempts, mockAttempts] = await Promise.all([
    prisma.topicMastery.findMany({
      where: {
        userId,
        questionsAttempted: {
          gt: 0,
        },
      },
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

    prisma.questionAttempt.findMany({
      where: {
        userId,
      },
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
      orderBy: {
        attemptedAt: "desc",
      },
      take: 20,
    }),

    prisma.mockExamAttempt.findMany({
      where: {
        userId,
        status: "SUBMITTED",
      },
      orderBy: {
        submittedAt: "desc",
      },
      take: 5,
    }),
  ]);

  const weaknesses = masteries
    .filter((item) => item.masteryPercent < 70)
    .map((item) => ({
      id: item.topicId,
      topicId: item.topicId,
      topic: item.topic.name,
      topicName: item.topic.name,
      subject: item.topic.subject.name,
      subjectName: item.topic.subject.name,
      subjectSlug: item.topic.subject.slug,
      topicSlug: item.topic.slug,
      masteryPercent: item.masteryPercent,
      priority: item.masteryPercent < 50 ? "HIGH" as const : "MEDIUM" as const,
      questionsAttempted: item.questionsAttempted,
      questionsCorrect: item.questionsCorrect,
      level:
        item.masteryPercent < 50
          ? ("HIGH" as const)
          : ("MEDIUM" as const),
    }));

  const recentWrongAnswers = recentAttempts.filter(
    (attempt) => !attempt.isCorrect,
  );

  const wrongTopicCounts = new Map<
    string,
    {
      topicId: string;
      topicName: string;
      subjectName: string;
      subjectSlug: string;
      topicSlug: string;
      count: number;
    }
  >();

  for (const attempt of recentWrongAnswers) {
    const topic = attempt.question.topic;

    const existing = wrongTopicCounts.get(topic.id);

    if (existing) {
      existing.count += 1;
    } else {
      wrongTopicCounts.set(topic.id, {
        topicId: topic.id,
        topicName: topic.name,
        subjectName: topic.subject.name,
        subjectSlug: topic.subject.slug,
        topicSlug: topic.slug,
        count: 1,
      });
    }
  }

  const mostMissedTopic = [...wrongTopicCounts.values()].sort(
    (a, b) => b.count - a.count,
  )[0];

  const recommendations: Recommendation[] = [];

  const weakestTopic = weaknesses[0];

  if (weakestTopic) {
    recommendations.push({
      id: `weak-topic-${weakestTopic.topicId}`,
      type: "WEAK_TOPIC",
      title: `Focus on ${weakestTopic.topicName}`,
      description: `${weakestTopic.subjectName} is currently at ${weakestTopic.masteryPercent}% mastery. A focused review here will give you the biggest improvement.`,
      href: `/learn/${weakestTopic.subjectSlug}/${weakestTopic.topicSlug}`,
      actionLabel: "Review topic",
      priority: weakestTopic.level,
    });
  }

  if (mostMissedTopic) {
    recommendations.push({
      id: `wrong-topic-${mostMissedTopic.topicId}`,
      type: "WRONG_ANSWERS",
      title: `Review your ${mostMissedTopic.topicName} mistakes`,
      description: `You've missed ${mostMissedTopic.count} recent question${
        mostMissedTopic.count === 1 ? "" : "s"
      } from this topic. Review them before moving on.`,
      href: "/wrong-answers",
      actionLabel: "Review mistakes",
      priority: "HIGH",
    });
  } else if (recentWrongAnswers.length > 0) {
    recommendations.push({
      id: "wrong-answers",
      type: "WRONG_ANSWERS",
      title: "Review your recent mistakes",
      description: `You have ${recentWrongAnswers.length} recent incorrect answer${
        recentWrongAnswers.length === 1 ? "" : "s"
      }. Turn those mistakes into your next revision session.`,
      href: "/wrong-answers",
      actionLabel: "Open wrong answers",
      priority: "MEDIUM",
    });
  }

  if (mockAttempts.length === 0) {
    recommendations.push({
      id: "first-mock",
      type: "MOCK",
      title: "Take your first mock exam",
      description:
        "Use a full mock to establish a baseline and discover which areas need the most attention.",
      href: "/mock",
      actionLabel: "Take a mock",
      priority: "MEDIUM",
    });
  } else if (weakestTopic && mockAttempts.length >= 1) {
    recommendations.push({
      id: "next-mock",
      type: "MOCK",
      title: "Test yourself again",
      description:
        "You've built enough study history to make another mock useful. Use it to measure whether your weak areas are improving.",
      href: "/mock",
      actionLabel: "Take another mock",
      priority: "LOW",
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      id: "continue",
      type: "CONTINUE",
      title: "Keep building your study history",
      description:
        "Complete more lessons and questions so Basira can make your study plan more precise.",
      href: "/learn",
      actionLabel: "Continue learning",
      priority: "LOW",
    });
  }

  return {
    isPro: true,
    hasActivity:
      masteries.length > 0 ||
      recentAttempts.length > 0 ||
      mockAttempts.length > 0,
    recommendations: recommendations.slice(0, 3),
    weaknesses: weaknesses.slice(0, 8),
  };
}