import { prisma } from "@/lib/prisma";

export async function getUserSubscription(userId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!subscription) return null;

  if (
    subscription.status !== "ACTIVE" ||
    (subscription.expiresAt && subscription.expiresAt <= new Date())
  ) {
    return null;
  }

  return subscription;
}

export async function isPro(userId: string) {
  const subscription = await getUserSubscription(userId);
  return subscription?.plan === "PRO";
}
