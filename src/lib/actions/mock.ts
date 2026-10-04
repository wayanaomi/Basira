"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { requirePro } from "@/lib/subscription";

const ENGLISH_SLUG = "english";
const UTME_SLUG = "jamb-utme";

const ENGLISH_QUESTIONS = 8;
const OTHER_SUBJECT_QUESTIONS = 4;
const MOCK_DURATION_MINUTES = 20;

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

async function requireUserId() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session.user.id;
}

export async function getStudentUtmeSubjects() {
  const userId = await requireUserId();

  const profile = await prisma.studentProfile.findUnique({
    where: {
      userId,
    },
    include: {
      exam: true,
      subjects: {
        include: {
          subject: true,
        },
        orderBy: {
          subject: {
            order: "asc",
          },
        },
      },
    },
  });

  if (!profile) {
    throw new Error("Complete onboarding before starting a mock exam.");
  }

  if (profile.exam?.slug !== UTME_SLUG) {
    throw new Error("This mock generator is currently for UTME students.");
  }

  const subjects = profile.subjects.map((item) => item.subject);

  const hasEnglish = subjects.some(
    (subject) => subject.slug === ENGLISH_SLUG,
  );

  if (!hasEnglish) {
    throw new Error(
      "Use of English is compulsory for UTME. Please update your subject combination.",
    );
  }

  if (subjects.length !== 4) {
    throw new Error(
      "UTME requires exactly four subjects: Use of English plus three other subjects.",
    );
  }

  const otherSubjects = subjects.filter(
    (subject) => subject.slug !== ENGLISH_SLUG,
  );

  if (otherSubjects.length !== 3) {
    throw new Error(
      "Your UTME combination must contain Use of English plus three other subjects.",
    );
  }

  const uniqueSubjectIds = new Set(subjects.map((subject) => subject.id));

  if (uniqueSubjectIds.size !== 4) {
    throw new Error("Your UTME subject combination contains duplicates.");
  }

  return {
    profile,
    subjects,
  };
}

async function getQuestionsForSubject(
  subjectId: string,
  count: number,
) {
  const questions = await prisma.question.findMany({
    where: {
      isPublished: true,
      topic: {
        subjectId,
      },
    },
    select: {
      id: true,
    },
  });

  if (questions.length < count) {
    return null;
  }

  return shuffle(questions).slice(0, count);
}

export async function createPersonalizedUtmeMock() {
  const userId = await requireUserId();
  await requirePro(userId);

  const { subjects } = await getStudentUtmeSubjects();

  const english = subjects.find(
    (subject) => subject.slug === ENGLISH_SLUG,
  );

  const otherSubjects = subjects.filter(
    (subject) => subject.slug !== ENGLISH_SLUG,
  );

  if (!english || otherSubjects.length !== 3) {
    throw new Error(
      "Your UTME combination must contain Use of English and three other subjects.",
    );
  }

  const distribution = [
    {
      subject: english,
      count: ENGLISH_QUESTIONS,
    },
    ...otherSubjects.map((subject) => ({
      subject,
      count: OTHER_SUBJECT_QUESTIONS,
    })),
  ];

  const selectedQuestions: string[] = [];

  for (const item of distribution) {
    const questions = await getQuestionsForSubject(
      item.subject.id,
      item.count,
    );

    if (!questions) {
      throw new Error(
        `Not enough published questions for ${item.subject.name}. ` +
          `Basira needs at least ${item.count} questions for this practice mock.`,
      );
    }

    selectedQuestions.push(...questions.map((question) => question.id));
  }

  const randomizedQuestionIds = shuffle(selectedQuestions);

  const title = `UTME Practice Mock — ${subjects
    .map((subject) => subject.name)
    .join(" · ")}`;

  return prisma.mockExam.create({
    data: {
      examId: english.examId,
      title,
      instructions:
        "This Basira practice mock follows your selected UTME subject combination. Answer every question and review your subject performance afterwards.",
      durationMinutes: MOCK_DURATION_MINUTES,
      isPublished: true,
      questions: {
        create: randomizedQuestionIds.map((questionId, index) => ({
          questionId,
          order: index,
        })),
      },
    },
    select: {
      id: true,
      title: true,
    },
  });
}

export async function getMockExamForStudent(mockExamId: string) {
  const { subjects } = await getStudentUtmeSubjects();

  const allowedSubjectIds = new Set(
    subjects.map((subject) => subject.id),
  );

  const mock = await prisma.mockExam.findFirst({
    where: {
      id: mockExamId,
      isPublished: true,
    },
    include: {
      questions: {
        orderBy: {
          order: "asc",
        },
        include: {
          question: {
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
          },
        },
      },
    },
  });

  if (!mock) {
    throw new Error("Mock exam not found.");
  }

  if (mock.questions.length !== 20) {
    throw new Error("This mock is incomplete.");
  }

  const containsUnauthorizedSubject = mock.questions.some(
    (item) => !allowedSubjectIds.has(item.question.topic.subjectId),
  );

  if (containsUnauthorizedSubject) {
    throw new Error("This mock does not match your current subjects.");
  }

  return mock;
}

export async function startMockAttempt(mockExamId: string) {
  const userId = await requireUserId();

  const mock = await getMockExamForStudent(mockExamId);

  const submittedAttempt = await prisma.mockExamAttempt.findFirst({
    where: {
      userId,
      mockExamId,
      status: "SUBMITTED",
    },
    orderBy: {
      submittedAt: "desc",
    },
  });

  if (submittedAttempt) {
    return submittedAttempt.id;
  }

  const existingAttempt = await prisma.mockExamAttempt.findFirst({
    where: {
      userId,
      mockExamId,
      status: "IN_PROGRESS",
    },
    orderBy: {
      startedAt: "desc",
    },
  });

  if (existingAttempt) {
    const expiresAt =
      existingAttempt.startedAt.getTime() +
      mock.durationMinutes * 60 * 1000;

    if (Date.now() < expiresAt) {
      return existingAttempt.id;
    }

    const timeSpentSeconds = Math.max(
      0,
      Math.floor(
        (expiresAt - existingAttempt.startedAt.getTime()) / 1000,
      ),
    );

    await prisma.mockExamAttempt.update({
      where: {
        id: existingAttempt.id,
      },
      data: {
        status: "SUBMITTED",
        submittedAt: new Date(expiresAt),
        score: 0,
        totalQuestions: mock.questions.length,
        timeSpentSeconds,
      },
    });
  }

  const attempt = await prisma.mockExamAttempt.create({
    data: {
      userId,
      mockExamId,
      startedAt: new Date(),
      totalQuestions: mock.questions.length,
      score: 0,
      timeSpentSeconds: 0,
      status: "IN_PROGRESS",
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
  const userId = await requireUserId();

  const attempt = await prisma.mockExamAttempt.findFirst({
    where: {
      id: attemptId,
      userId,
      status: "IN_PROGRESS",
    },
    include: {
      mockExam: {
        include: {
          questions: {
            where: {
              questionId,
            },
            include: {
              question: {
                include: {
                  options: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!attempt) {
    throw new Error("Active mock attempt not found.");
  }

  const expiresAt =
    attempt.startedAt.getTime() +
    attempt.mockExam.durationMinutes * 60 * 1000;

  if (Date.now() >= expiresAt) {
    throw new Error("This mock has expired. Please submit the exam.");
  }

  const mockQuestion = attempt.mockExam.questions[0];

  if (!mockQuestion) {
    throw new Error("Question does not belong to this mock.");
  }

  const optionBelongsToQuestion =
    mockQuestion.question.options.some(
      (option) => option.id === selectedOptionId,
    );

  if (!optionBelongsToQuestion) {
    throw new Error("Invalid answer option.");
  }

  return prisma.mockExamAnswer.upsert({
    where: {
      attemptId_questionId: {
        attemptId,
        questionId,
      },
    },
    create: {
      attemptId,
      questionId,
      selectedOptionId,
      isCorrect: false,
    },
    update: {
      selectedOptionId,
    },
  });
}

export async function submitMockExam(
  attemptId: string,
  clientTimeSpentSeconds?: number,
) {
  const userId = await requireUserId();

  const attempt = await prisma.mockExamAttempt.findFirst({
    where: {
      id: attemptId,
      userId,
    },
    include: {
      mockExam: {
        include: {
          questions: {
            include: {
              question: {
                include: {
                  options: true,
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
      },
      answers: true,
    },
  });

  if (!attempt) {
    throw new Error("Mock attempt not found.");
  }

  if (attempt.status === "SUBMITTED") {
    return attempt;
  }

  const now = new Date();

  const elapsedSeconds = Math.max(
    0,
    Math.floor(
      (now.getTime() - attempt.startedAt.getTime()) / 1000,
    ),
  );

  const maxSeconds = attempt.mockExam.durationMinutes * 60;

  const timeSpentSeconds = Math.min(
    maxSeconds,
    Math.max(
      elapsedSeconds,
      Math.min(clientTimeSpentSeconds ?? 0, maxSeconds),
    ),
  );

  const answerMap = new Map(
    attempt.answers.map((answer) => [
      answer.questionId,
      answer.selectedOptionId,
    ]),
  );

  let correctCount = 0;

  const updates = attempt.mockExam.questions.map((mockQuestion) => {
    const selectedOptionId = answerMap.get(
      mockQuestion.questionId,
    );

    const correctOption = mockQuestion.question.options.find(
      (option) => option.isCorrect,
    );

    const isCorrect =
      !!selectedOptionId &&
      !!correctOption &&
      selectedOptionId === correctOption.id;

    if (isCorrect) {
      correctCount += 1;
    }

    return {
      questionId: mockQuestion.questionId,
      selectedOptionId: selectedOptionId ?? null,
      isCorrect,
    };
  });

  const score =
    attempt.mockExam.questions.length > 0
      ? Math.round(
          (correctCount / attempt.mockExam.questions.length) * 100,
        )
      : 0;

    return prisma.$transaction([
      prisma.mockExamAnswer.deleteMany({
        where: {
          attemptId,
        },
      }),

      prisma.mockExamAnswer.createMany({
        data: updates.map((answer) => ({
          attemptId,
          questionId: answer.questionId,
          selectedOptionId: answer.selectedOptionId,
          isCorrect: answer.isCorrect,
        })),
      }),

      prisma.mockExamAttempt.update({
        where: {
          id: attemptId,
        },
        data: {
          status: "SUBMITTED",
          submittedAt: now,
          score,
          totalQuestions: attempt.mockExam.questions.length,
          timeSpentSeconds,
        },
      }),
    ]).then(([, , submittedAttempt]) => submittedAttempt);
}
