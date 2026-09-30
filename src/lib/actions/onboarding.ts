"use server";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const UTME_SLUG = "jamb-utme";
const ENGLISH_SLUG = "english";

export async function completeOnboarding(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const examId = String(formData.get("examId") ?? "");

  const targetScore = formData.get("targetScore")
    ? String(formData.get("targetScore"))
    : null;

  const dailyGoalMinutes = Number(
    formData.get("dailyGoalMinutes") ?? 10,
  );

  const studyLevel = formData.get("studyLevel")
    ? String(formData.get("studyLevel"))
    : null;

  const subjectIds = [
    ...new Set(
      formData
        .getAll("subjectIds")
        .map(String)
        .filter(Boolean),
    ),
  ];

  if (!examId) {
    throw new Error("Choose an exam to continue.");
  }

  if (subjectIds.length === 0) {
    throw new Error("Choose your subjects to continue.");
  }

  const exam = await prisma.exam.findUnique({
    where: {
      id: examId,
    },
    include: {
      subjects: {
        where: {
          id: {
            in: subjectIds,
          },
        },
      },
    },
  });

  if (!exam) {
    throw new Error("Selected exam was not found.");
  }

  if (exam.slug === UTME_SLUG) {
    if (subjectIds.length !== 4) {
      throw new Error(
        "UTME requires exactly four subjects: Use of English plus three other subjects.",
      );
    }

    const selectedSubjects = exam.subjects;

    if (selectedSubjects.length !== 4) {
      throw new Error(
        "One or more selected subjects do not belong to this exam.",
      );
    }

    const english = selectedSubjects.find(
      (subject) => subject.slug === ENGLISH_SLUG,
    );

    if (!english) {
      throw new Error(
        "Use of English is compulsory for UTME.",
      );
    }

    const otherSubjects = selectedSubjects.filter(
      (subject) => subject.slug !== ENGLISH_SLUG,
    );

    if (otherSubjects.length !== 3) {
      throw new Error(
        "Choose Use of English plus three other UTME subjects.",
      );
    }
  } else if (exam.subjects.length !== subjectIds.length) {
    throw new Error(
      "One or more selected subjects do not belong to this exam.",
    );
  }

  const userId = session.user.id;

  await prisma.studentProfile.upsert({
    where: {
      userId,
    },
    create: {
      userId,
      examId,
      targetScore,
      dailyGoalMinutes,
      studyLevel,
      onboardingCompletedAt: new Date(),
      subjects: {
        create: subjectIds.map((subjectId) => ({
          subjectId,
        })),
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
        create: subjectIds.map((subjectId) => ({
          subjectId,
        })),
      },
    },
  });

  await prisma.streak.upsert({
    where: {
      userId,
    },
    create: {
      userId,
    },
    update: {},
  });

  redirect("/dashboard");
}
