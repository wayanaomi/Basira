"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return session;
}

export async function activatePro(userId: string, months = 1) {
  await requireAdmin();

  const startedAt = new Date();
  const expiresAt = new Date(startedAt);

  expiresAt.setMonth(expiresAt.getMonth() + months);

  return prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      plan: "PRO",
      status: "ACTIVE",
      startedAt,
      expiresAt,
    },
    update: {
      plan: "PRO",
      status: "ACTIVE",
      startedAt,
      expiresAt,
    },
  });
}

export async function deactivatePro(userId: string) {
  await requireAdmin();

  return prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      plan: "FREE",
      status: "CANCELLED",
      expiresAt: new Date(),
    },
    update: {
      plan: "FREE",
      status: "CANCELLED",
      expiresAt: new Date(),
    },
  });
}