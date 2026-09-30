import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { getMockExamForStudent } from "@/lib/actions/mock";
import { prisma } from "@/lib/prisma";
import { startMockAttempt } from "@/lib/actions/mock";
import { MockExamPlayer } from "@/components/assessment/MockExamPlayer";

export default async function MockExamAttemptPage({
  params,
}: PageProps<"/mock/[mockExamId]">) {
  const { mockExamId } = await params;

  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  let mockExam;

  try {
    mockExam = await getMockExamForStudent(mockExamId);
  } catch {
    notFound();
  }

  const existingSubmitted = await prisma.mockExamAttempt.findFirst({
    where: {
      userId,
      mockExamId,
      status: "SUBMITTED",
    },
    orderBy: {
      submittedAt: "desc",
    },
  });

  if (existingSubmitted) {
    redirect(
      `/mock/${mockExamId}/results/${existingSubmitted.id}`,
    );
  }

  const attemptId = await startMockAttempt(mockExamId);

  const attempt = await prisma.mockExamAttempt.findUnique({
    where: {
      id: attemptId,
    },
  });

  if (!attempt) {
    notFound();
  }

  const existingAnswers = await prisma.mockExamAnswer.findMany({
    where: {
      attemptId,
    },
    select: {
      questionId: true,
      selectedOptionId: true,
    },
  });

  const answersByQuestion = new Map(
    existingAnswers.map((answer) => [
      answer.questionId,
      answer.selectedOptionId,
    ]),
  );

  const remainingSeconds = Math.max(
    0,
    Math.ceil(
      (attempt.startedAt.getTime() +
        mockExam.durationMinutes * 60 * 1000 -
        Date.now()) /
        1000,
    ),
  );

  if (remainingSeconds <= 0) {
    redirect(
      `/mock/${mockExamId}/results/${attemptId}`,
    );
  }

  return (
    <MockExamPlayer
      attemptId={attemptId}
      mockExamId={mockExamId}
      title={mockExam.title}
      instructions={mockExam.instructions}
      durationMinutes={mockExam.durationMinutes}
      remainingSeconds={remainingSeconds}
      questions={mockExam.questions.map((mockQuestion) => ({
        id: mockQuestion.question.id,
        prompt: mockQuestion.question.prompt,
        options: mockQuestion.question.options.map((option) => ({
          id: option.id,
          text: option.text,
        })),
        selectedOptionId:
          answersByQuestion.get(mockQuestion.question.id) ?? null,
      }))}
    />
  );
}
