"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function createQuestion(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Forbidden.");

  const topicId = String(formData.get("topicId") ?? "");
  const prompt = String(formData.get("prompt") ?? "").trim();
  const explanation = String(formData.get("explanation") ?? "").trim();
  const difficulty = String(formData.get("difficulty") ?? "MEDIUM");
  const correctIndex = Number(formData.get("correctIndex") ?? 0);
  const options = [0, 1, 2, 3]
    .map((i) => String(formData.get(`option-${i}`) ?? "").trim())
    .filter(Boolean);

  if (!topicId || !prompt || !explanation || options.length < 2) {
    throw new Error("Fill in the topic, prompt, explanation, and at least two options.");
  }

  await prisma.question.create({
    data: {
      topicId,
      prompt,
      explanation,
      difficulty,
      type: "MULTIPLE_CHOICE",
      options: {
        create: options.map((text, i) => ({ text, isCorrect: i === correctIndex, order: i })),
      },
    },
  });

  revalidatePath("/admin/questions");
}

export async function togglePublished(questionId: string, isPublished: boolean) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Forbidden.");

  await prisma.question.update({ where: { id: questionId }, data: { isPublished } });
  revalidatePath("/admin/questions");
}
