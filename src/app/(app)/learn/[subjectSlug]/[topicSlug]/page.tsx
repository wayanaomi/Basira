import { notFound } from "next/navigation";
import Link from "next/link";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { MasteryBar } from "@/components/gamification/MasteryBar";
import { LinkButton } from "@/components/ui/Button";

export default async function TopicPage({
  params,
}: PageProps<"/learn/[subjectSlug]/[topicSlug]">) {
  const { subjectSlug, topicSlug } = await params;
  const session = await auth();
  const userId = session!.user.id;

  const topic = await prisma.topic.findFirst({
    where: { slug: topicSlug, subject: { slug: subjectSlug } },
    include: {
      subject: true,
      lessons: { where: { isPublished: true }, orderBy: { order: "asc" } },
      mastery: { where: { userId } },
    },
  });
  if (!topic) notFound();

  const progressRows = await prisma.lessonProgress.findMany({
    where: { userId, lessonId: { in: topic.lessons.map((l) => l.id) } },
  });
  const progressByLesson = new Map(progressRows.map((p) => [p.lessonId, p]));

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <Link href={`/learn/${subjectSlug}`} className="text-sm font-medium text-ink/50">
        &larr; {topic.subject.name}
      </Link>
      <h1 className="mt-2 font-display text-2xl font-semibold text-indigo">{topic.name}</h1>
      <p className="mt-1 text-sm text-ink/60">{topic.description}</p>

      <MasteryBar
        percent={topic.mastery[0]?.masteryPercent ?? 0}
        label="Mastery"
        className="mt-6"
      />

      <div className="mt-8 flex flex-col gap-3">
        {topic.lessons.map((lesson) => {
          const status = progressByLesson.get(lesson.id)?.status ?? "NOT_STARTED";
          return (
            <div
              key={lesson.id}
              className="flex items-center justify-between rounded-2xl bg-paper p-4"
            >
              <div>
                <p className="font-medium text-ink/90">{lesson.title}</p>
                <p className="text-xs text-ink/50">{lesson.estimatedMinutes} min</p>
              </div>
              <LinkButton
                href={`/lesson/${lesson.id}`}
                size="sm"
                variant={status === "COMPLETED" ? "ghost" : "primary"}
              >
                {status === "COMPLETED" ? "Review" : status === "IN_PROGRESS" ? "Continue" : "Start"}
              </LinkButton>
            </div>
          );
        })}
      </div>
    </div>
  );
}
