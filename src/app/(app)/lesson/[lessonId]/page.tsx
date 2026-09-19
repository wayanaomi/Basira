import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { startLesson } from "@/lib/actions/lesson";
import { LessonPlayer } from "@/components/learning/LessonPlayer";

export default async function LessonPage({ params }: PageProps<"/lesson/[lessonId]">) {
  const { lessonId } = await params;

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      topic: { include: { subject: true } },
      questions: {
        where: { isPublished: true },
        include: { options: { orderBy: { order: "asc" } } },
      },
    },
  });
  if (!lesson) notFound();

  await startLesson(lessonId);

  const content = JSON.parse(lesson.content) as { type: string; text: string }[];

  return (
    <LessonPlayer
      lessonId={lesson.id}
      lessonTitle={lesson.title}
      subjectSlug={lesson.topic.subject.slug}
      topicSlug={lesson.topic.slug}
      content={content}
      questions={lesson.questions.map((q) => ({
        id: q.id,
        prompt: q.prompt,
        options: q.options.map((o) => ({ id: o.id, text: o.text })),
      }))}
    />
  );
}
