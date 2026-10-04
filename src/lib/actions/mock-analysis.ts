"use server";

import { prisma } from "@/lib/prisma";
import { isPro } from "@/lib/subscription";
import { auth } from "@/auth";

type SubjectStats = {
  subjectId: string;
  subject: string;
  subjectSlug: string;
  correct: number;
  total: number;
  accuracy: number;
};

type TopicStats = {
  topicId: string;
  topic: string;
  topicSlug: string;
  subject: string;
  subjectSlug: string;
  correct: number;
  total: number;
  accuracy: number;
};

export async function getAdvancedMockAnalysis() {
  const session = await auth();

if (!session?.user?.id) {
  throw new Error("Unauthorized");
}

const userId = session.user.id;

  const pro = await isPro(userId);

  if (!pro) {
    return {
      hasData: false,
      isPro: false,
      attempts: [],
      latest: null,
      comparison: null,
      strongestSubject: null,
      weakestSubject: null,
      strongestTopic: null,
      weakestTopic: null,
      totalMocks: 0,
    };
  }

  const attempts = await prisma.mockExamAttempt.findMany({
    where: {
      userId,
      status: "SUBMITTED",
    },
    orderBy: {
      submittedAt: "asc",
    },
    include: {
      mockExam: true,
      answers: {
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
      },
    },
  });

  if (attempts.length === 0) {
    return {
      hasData: false,
      isPro: true,
      attempts: [],
      latest: null,
      comparison: null,
      strongestSubject: null,
      weakestSubject: null,
      strongestTopic: null,
      weakestTopic: null,
    };
  }

  const analysedAttempts = attempts.map((attempt) => {
    const total = attempt.answers.length;
    const correct = attempt.answers.filter(
      (answer) => answer.isCorrect
    ).length;

    const accuracy =
      total > 0 ? Math.round((correct / total) * 100) : 0;

    const subjectMap = new Map<string, SubjectStats>();
    const topicMap = new Map<string, TopicStats>();

    for (const answer of attempt.answers) {
      const subject = answer.question.topic.subject;
      const topic = answer.question.topic;

      const existingSubject = subjectMap.get(subject.id);

      if (existingSubject) {
        existingSubject.total += 1;

        if (answer.isCorrect) {
          existingSubject.correct += 1;
        }

        existingSubject.accuracy = Math.round(
          (existingSubject.correct / existingSubject.total) * 100
        );
      } else {
        subjectMap.set(subject.id, {
          subjectId: subject.id,
          subject: subject.name,
          subjectSlug: subject.slug,
          correct: answer.isCorrect ? 1 : 0,
          total: 1,
          accuracy: answer.isCorrect ? 100 : 0,
        });
      }

      const existingTopic = topicMap.get(topic.id);

      if (existingTopic) {
        existingTopic.total += 1;

        if (answer.isCorrect) {
          existingTopic.correct += 1;
        }

        existingTopic.accuracy = Math.round(
          (existingTopic.correct / existingTopic.total) * 100
        );
      } else {
        topicMap.set(topic.id, {
          topicId: topic.id,
          topic: topic.name,
          topicSlug: topic.slug,
          subject: subject.name,
          subjectSlug: subject.slug,
          correct: answer.isCorrect ? 1 : 0,
          total: 1,
          accuracy: answer.isCorrect ? 100 : 0,
        });
      }
    }

    return {
      id: attempt.id,
      mockExamId: attempt.mockExamId,
      mockTitle: attempt.mockExam.title,
      submittedAt: attempt.submittedAt,
      startedAt: attempt.startedAt,
      score: correct,
      totalQuestions: total,
      accuracy,
      timeSpentSeconds: attempt.timeSpentSeconds,
      subjects: Array.from(subjectMap.values()).sort(
        (a, b) => b.accuracy - a.accuracy
      ),
      topics: Array.from(topicMap.values()).sort(
        (a, b) => a.accuracy - b.accuracy
      ),
    };
  });

  const latest = analysedAttempts[analysedAttempts.length - 1];

  const subjectTotals = new Map<string, SubjectStats>();
  const topicTotals = new Map<string, TopicStats>();

  for (const attempt of analysedAttempts) {
    for (const subject of attempt.subjects) {
      const existing = subjectTotals.get(subject.subjectId);

      if (existing) {
        existing.correct += subject.correct;
        existing.total += subject.total;
        existing.accuracy = Math.round(
          (existing.correct / existing.total) * 100
        );
      } else {
        subjectTotals.set(subject.subjectId, { ...subject });
      }
    }

    for (const topic of attempt.topics) {
      const existing = topicTotals.get(topic.topicId);

      if (existing) {
        existing.correct += topic.correct;
        existing.total += topic.total;
        existing.accuracy = Math.round(
          (existing.correct / existing.total) * 100
        );
      } else {
        topicTotals.set(topic.topicId, { ...topic });
      }
    }
  }

  const allSubjects = Array.from(subjectTotals.values()).filter(
    (subject) => subject.total > 0
  );

  const allTopics = Array.from(topicTotals.values()).filter(
    (topic) => topic.total > 0
  );

  const strongestSubject =
    allSubjects.length > 0
      ? [...allSubjects].sort((a, b) => {
          if (b.accuracy !== a.accuracy) {
            return b.accuracy - a.accuracy;
          }

          return b.total - a.total;
        })[0]
      : null;

  const weakestSubject =
    allSubjects.length > 0
      ? [...allSubjects].sort((a, b) => {
          if (a.accuracy !== b.accuracy) {
            return a.accuracy - b.accuracy;
          }

          return b.total - a.total;
        })[0]
      : null;

  const strongestTopic =
    allTopics.length > 0
      ? [...allTopics].sort((a, b) => {
          if (b.accuracy !== a.accuracy) {
            return b.accuracy - a.accuracy;
          }

          return b.total - a.total;
        })[0]
      : null;

  const weakestTopic =
    allTopics.length > 0
      ? [...allTopics].sort((a, b) => {
          if (a.accuracy !== b.accuracy) {
            return a.accuracy - b.accuracy;
          }

          return b.total - a.total;
        })[0]
      : null;

  const previous = analysedAttempts.length > 1
    ? analysedAttempts[analysedAttempts.length - 2]
    : null;

  const comparison = previous
    ? {
        previousScore: previous.score,
        previousTotal: previous.totalQuestions,
        previousAccuracy: previous.accuracy,
        currentScore: latest.score,
        currentTotal: latest.totalQuestions,
        currentAccuracy: latest.accuracy,
        accuracyChange: latest.accuracy - previous.accuracy,
        scoreChange: latest.score - previous.score,
        timeChangeSeconds:
          latest.timeSpentSeconds - previous.timeSpentSeconds,
      }
    : null;

  return {
    hasData: true,
    isPro: true,
    attempts: analysedAttempts,
    latest,
    comparison,
    strongestSubject,
    weakestSubject,
    strongestTopic,
    weakestTopic,
    totalMocks: analysedAttempts.length,
  };
}