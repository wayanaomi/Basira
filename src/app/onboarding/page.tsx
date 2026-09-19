import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const existingProfile = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (existingProfile?.onboardingCompletedAt) redirect("/dashboard");

  const exams = await prisma.exam.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    include: { subjects: { orderBy: { order: "asc" } } },
  });

  return (
    <div className="min-h-screen bg-mist px-4 py-10">
      <OnboardingWizard exams={exams} studentName={session.user.name ?? "there"} />
    </div>
  );
}
