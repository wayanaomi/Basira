import { prisma } from "@/lib/prisma";
import { DIFFICULTIES } from "@/lib/constants";
import { createQuestion } from "@/lib/actions/admin-content";
import { Button } from "@/components/ui/Button";
import { PublishToggle } from "@/components/admin/PublishToggle";

export default async function AdminQuestionsPage() {
  const [topics, questions] = await Promise.all([
    prisma.topic.findMany({
      include: { subject: { include: { exam: true } } },
      orderBy: [{ subject: { name: "asc" } }, { order: "asc" }],
    }),
    prisma.question.findMany({
      include: { topic: true, options: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="font-display text-2xl font-semibold text-indigo">Questions</h1>

      <form action={createQuestion} className="mt-6 flex flex-col gap-4 rounded-3xl bg-paper p-6">
        <h2 className="font-display font-semibold text-indigo">Add a question</h2>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-ink/80">Topic</span>
          <select name="topicId" required className="input">
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.subject.exam.shortName} · {topic.subject.name} · {topic.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-ink/80">Prompt</span>
          <textarea name="prompt" required rows={2} className="input" />
        </label>

        <div className="grid grid-cols-2 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <label key={i} className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-ink/80">Option {i + 1}</span>
              <input name={`option-${i}`} required={i < 2} className="input" />
            </label>
          ))}
        </div>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-ink/80">Correct option (index)</span>
          <select name="correctIndex" className="input">
            {[0, 1, 2, 3].map((i) => (
              <option key={i} value={i}>
                Option {i + 1}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-ink/80">Difficulty</span>
          <select name="difficulty" className="input">
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-ink/80">Explanation</span>
          <textarea name="explanation" required rows={2} className="input" />
        </label>

        <Button type="submit" className="self-start">
          Add question
        </Button>
      </form>

      <div className="mt-8 flex flex-col gap-3">
        {questions.map((q) => (
          <div key={q.id} className="rounded-2xl bg-paper p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-ink/40">{q.topic.name}</p>
                <p className="mt-1 text-sm font-medium text-ink/90">{q.prompt}</p>
              </div>
              <PublishToggle questionId={q.id} isPublished={q.isPublished} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
