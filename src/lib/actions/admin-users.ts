"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return session;
}

function revalidateProAccess() {
  revalidatePath("/admin/users");
  revalidatePath("/dashboard");
  revalidatePath("/mock");
  revalidatePath("/performance");
  revalidatePath("/recommendations");
  revalidatePath("/wrong-answers");
  revalidatePath("/mock-analysis");
  revalidatePath("/upgrade");
}

export async function activatePro(userId: string, months = 1) {
  await requireAdmin();

  const startedAt = new Date();
  const expiresAt = new Date(startedAt);

  expiresAt.setMonth(expiresAt.getMonth() + months);

  const subscription = await prisma.subscription.upsert({
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

  revalidateProAccess();

  return subscription;
}

export async function deactivatePro(userId: string) {
  await requireAdmin();

  const subscription = await prisma.subscription.upsert({
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

  revalidateProAccess();

  return subscription;
}
