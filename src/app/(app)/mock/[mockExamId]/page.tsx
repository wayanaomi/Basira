import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { startMockAttempt } from "@/lib/actions/mock";
import { MockExamPlayer } from "@/components/assessment/MockExamPlayer";

export default async function MockExamAttemptPage({
  params,
}: PageProps<"/mock/[mockExamId]">) {
  const { mockExamId } = await params;
  const session = await auth();
  const userId = session!.user.id;

  const mockExam = await prisma.mockExam.findUnique({
    where: { id: mockExamId },
    include: {
      questions: {
        orderBy: { order: "asc" },
        include: { question: { include: { options: { orderBy: { order: "asc" } } } } },
      },
    },
  });
  if (!mockExam) notFound();

  const existingSubmitted = await prisma.mockExamAttempt.findFirst({
    where: { userId, mockExamId, status: "SUBMITTED" },
    orderBy: { submittedAt: "desc" },
  });

  const attemptId = await startMockAttempt(mockExamId);

  const existingAnswers = await prisma.mockExamAnswer.findMany({ where: { attemptId } });
  const answersByQuestion = new Map(existingAnswers.map((a) => [a.questionId, a.selectedOptionId]));

  if (existingSubmitted) redirect(`/mock/${mockExamId}/results/${existingSubmitted.id}`);

  return (
    <MockExamPlayer
      attemptId={attemptId}
      mockExamId={mockExamId}
      title={mockExam.title}
      instructions={mockExam.instructions}
      durationMinutes={mockExam.durationMinutes}
      questions={mockExam.questions.map((mq) => ({
        id: mq.question.id,
        prompt: mq.question.prompt,
        options: mq.question.options.map((o) => ({ id: o.id, text: o.text })),
        selectedOptionId: answersByQuestion.get(mq.question.id) ?? null,
      }))}
    />
  );
}
