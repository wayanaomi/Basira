import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function LearnIndexPage() {
  const session = await auth();
  const userId = session!.user.id;

  const profile = await prisma.studentProfile.findUnique({
    where: { userId },
    include: { subjects: { include: { subject: true }, orderBy: { createdAt: "asc" } } },
  });

  const firstSubject = profile?.subjects[0]?.subject;
  if (!firstSubject) redirect("/onboarding");

  redirect(`/learn/${firstSubject.slug}`);
}
