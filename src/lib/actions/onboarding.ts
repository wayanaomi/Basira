"use server";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function completeOnboarding(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const examId = String(formData.get("examId") ?? "");
  const targetScore = formData.get("targetScore")
    ? String(formData.get("targetScore"))
    : null;
  const dailyGoalMinutes = Number(formData.get("dailyGoalMinutes") ?? 10);
  const studyLevel = formData.get("studyLevel")
    ? String(formData.get("studyLevel"))
    : null;
  const subjectIds = formData.getAll("subjectIds").map(String);

  if (!examId || subjectIds.length === 0) {
    throw new Error("Choose an exam and at least one subject to continue.");
  }

  const userId = session.user.id;

  await prisma.studentProfile.upsert({
    where: { userId },
    create: {
      userId,
      examId,
      targetScore,
      dailyGoalMinutes,
      studyLevel,
      onboardingCompletedAt: new Date(),
      subjects: {
        create: subjectIds.map((subjectId) => ({ subjectId })),
      },
    },
    update: {
      examId,
      targetScore,
      dailyGoalMinutes,
      studyLevel,
      onboardingCompletedAt: new Date(),
      subjects: {
        deleteMany: {},
        create: subjectIds.map((subjectId) => ({ subjectId })),
      },
    },
  });

  // Streak starts at 0 — it only becomes 1 once the student completes real activity.
  await prisma.streak.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });

  redirect("/dashboard");
}
