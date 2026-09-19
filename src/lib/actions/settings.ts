"use server";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function updateSettings(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const dailyGoalMinutes = Number(formData.get("dailyGoalMinutes") ?? 10);
  const targetScore = String(formData.get("targetScore") ?? "").trim() || null;

  await prisma.studentProfile.update({
    where: { userId: session.user.id },
    data: { dailyGoalMinutes, targetScore },
  });

  redirect("/settings");
}
