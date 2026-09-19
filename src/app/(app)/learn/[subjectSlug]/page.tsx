import { notFound, redirect } from "next/navigation";
import Link from "next/link";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getLearningPathForSubject } from "@/lib/learning";
import { LearningPathJourney } from "@/components/learning/LearningPathJourney";
import { cn } from "@/lib/utils";

export default async function SubjectLearningPathPage({
  params,
}: PageProps<"/learn/[subjectSlug]">) {
  const { subjectSlug } = await params;
  const session = await auth();
  const userId = session!.user.id;

  const profile = await prisma.studentProfile.findUnique({
    where: { userId },
    include: { subjects: { include: { subject: true }, orderBy: { createdAt: "asc" } } },
  });

  if (!profile) redirect("/onboarding");

  const chosenSubjects = profile.subjects.map((s) => s.subject);
  const subject = chosenSubjects.find((s) => s.slug === subjectSlug);
  if (!subject) notFound();

  const nodes = await getLearningPathForSubject(userId, subject.id);

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      {chosenSubjects.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {chosenSubjects.map((s) => (
            <Link
              key={s.id}
              href={`/learn/${s.slug}`}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                s.slug === subjectSlug ? "bg-indigo text-paper" : "bg-ink/5 text-ink/60",
              )}
            >
              {s.name}
            </Link>
          ))}
        </div>
      )}

      <h1 className="font-display text-2xl font-semibold text-indigo">{subject.name}</h1>
      <p className="mt-1 text-sm text-ink/60">{subject.description || "Your learning path."}</p>

      {nodes.length === 0 ? (
        <p className="mt-10 text-center text-sm text-ink/50">
          Sage is checking the next lesson. Give it a second.
        </p>
      ) : (
        <LearningPathJourney subjectSlug={subjectSlug} nodes={nodes} />
      )}
    </div>
  );
}
