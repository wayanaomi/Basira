import "server-only";

import { prisma } from "@/lib/prisma";
import { READINESS_MIN_LESSONS, READINESS_MIN_QUESTIONS } from "@/lib/constants";

export type TopicNodeState =
  | "completed"
  | "current"
  | "recommended"
  | "locked"
  | "mastered";

export interface TopicNode {
  id: string;
  slug: string;
  name: string;
  order: number;
  masteryPercent: number;
  lessonsTotal: number;
  lessonsCompleted: number;
  state: TopicNodeState;
}

/**
 * Builds the visual learning-path journey for one subject: every topic in
 * order, with a computed state derived from real lesson-progress and mastery
 * rows. Topics unlock sequentially — the first topic is always open.
 */
export async function getLearningPathForSubject(userId: string, subjectId: string) {
  const topics = await prisma.topic.findMany({
    where: { subjectId },
    orderBy: { order: "asc" },
    include: {
      lessons: { where: { isPublished: true }, select: { id: true } },
      mastery: { where: { userId } },
    },
  });

  const nodes: TopicNode[] = [];
  let previousComplete = true;

  for (const topic of topics) {
    const lessonIds = topic.lessons.map((l) => l.id);
    const progressRows = lessonIds.length
      ? await prisma.lessonProgress.findMany({
          where: { userId, lessonId: { in: lessonIds }, status: "COMPLETED" },
          select: { lessonId: true },
        })
      : [];

    const lessonsCompleted = progressRows.length;
    const lessonsTotal = lessonIds.length;
    const isComplete = lessonsTotal > 0 && lessonsCompleted === lessonsTotal;
    const masteryPercent = topic.mastery[0]?.masteryPercent ?? 0;

    let state: TopicNodeState;
    if (isComplete && masteryPercent >= 80) state = "mastered";
    else if (isComplete) state = "completed";
    else if (!previousComplete) state = "locked";
    else if (lessonsCompleted > 0) state = "current";
    else state = previousComplete ? "current" : "locked";

    nodes.push({
      id: topic.id,
      slug: topic.slug,
      name: topic.name,
      order: topic.order,
      masteryPercent,
      lessonsTotal,
      lessonsCompleted,
      state,
    });

    previousComplete = isComplete;
  }

  // Only the first not-yet-complete topic should read as "current"; the rest
  // that would otherwise qualify stay "locked" until their predecessor is done.
  let currentAssigned = false;
  for (const node of nodes) {
    if (node.state === "current") {
      if (currentAssigned) node.state = "locked";
      else currentAssigned = true;
    }
  }

  return nodes;
}

export async function getNextLessonForUser(userId: string, subjectId: string) {
  const topics = await prisma.topic.findMany({
    where: { subjectId },
    orderBy: { order: "asc" },
    include: {
      lessons: {
        where: { isPublished: true },
        orderBy: { order: "asc" },
      },
    },
  });

  for (const topic of topics) {
    for (const lesson of topic.lessons) {
      const progress = await prisma.lessonProgress.findUnique({
        where: { userId_lessonId: { userId, lessonId: lesson.id } },
      });
      if (progress?.status !== "COMPLETED") {
        return { lesson, topic };
      }
    }
  }

  return null;
}

/** Simple, purposeful recommendation: weakest reviewed topic, else the next lesson. */
export async function getTodaysRecommendation(userId: string, subjectId: string) {
  const weakTopic = await prisma.topicMastery.findFirst({
    where: { userId, topic: { subjectId }, questionsAttempted: { gt: 0 }, masteryPercent: { lt: 60 } },
    orderBy: { masteryPercent: "asc" },
    include: { topic: true },
  });

  if (weakTopic) {
    return {
      type: "REVIEW_TOPIC" as const,
      topic: weakTopic.topic,
      reason: `${weakTopic.topic.name} needs another look.`,
    };
  }

  const next = await getNextLessonForUser(userId, subjectId);
  if (next) {
    return {
      type: "CONTINUE_LESSON" as const,
      lesson: next.lesson,
      topic: next.topic,
      reason: `Continue ${next.topic.name}.`,
    };
  }

  return null;
}

export interface ReadinessResult {
  available: boolean;
  score: number | null;
  lessonsCompleted: number;
  questionsAttempted: number;
}

/** A brand-new learner must never see a fabricated readiness score. */
export async function getExamReadiness(userId: string, examId: string): Promise<ReadinessResult> {
  const [lessonsCompleted, questionsAttempted, masteryRows] = await Promise.all([
    prisma.lessonProgress.count({
      where: { userId, status: "COMPLETED", lesson: { topic: { subject: { examId } } } },
    }),
    prisma.questionAttempt.count({
      where: { userId, question: { topic: { subject: { examId } } } },
    }),
    prisma.topicMastery.findMany({
      where: { userId, topic: { subject: { examId } } },
    }),
  ]);

  const available =
    lessonsCompleted >= READINESS_MIN_LESSONS &&
    questionsAttempted >= READINESS_MIN_QUESTIONS;

  if (!available) {
    return { available: false, score: null, lessonsCompleted, questionsAttempted };
  }

  const avgMastery =
    masteryRows.reduce((sum, m) => sum + m.masteryPercent, 0) /
    Math.max(1, masteryRows.length);

  return {
    available: true,
    score: Math.round(avgMastery),
    lessonsCompleted,
    questionsAttempted,
  };
}
