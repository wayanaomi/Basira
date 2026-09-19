"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { saveMockAnswer, submitMockExam } from "@/lib/actions/mock";
import { ExamTimer } from "@/components/assessment/ExamTimer";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface QuestionData {
  id: string;
  prompt: string;
  options: { id: string; text: string }[];
  selectedOptionId: string | null;
}

export function MockExamPlayer({
  attemptId,
  mockExamId,
  title,
  instructions,
  durationMinutes,
  questions: initialQuestions,
}: {
  attemptId: string;
  mockExamId: string;
  title: string;
  instructions: string;
  durationMinutes: number;
  questions: QuestionData[];
}) {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState(initialQuestions);
  const [index, setIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [startedAt] = useState(() => Date.now());

  const current = questions[index];
  const answeredCount = questions.filter((q) => q.selectedOptionId).length;

  async function selectOption(optionId: string) {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, selectedOptionId: optionId } : q)),
    );
    await saveMockAnswer({ attemptId, questionId: current.id, selectedOptionId: optionId });
  }

  async function handleSubmit() {
    setSubmitting(true);
    const timeSpentSeconds = Math.round((Date.now() - startedAt) / 1000);
    await submitMockExam(attemptId, timeSpentSeconds);
    router.push(`/mock/${mockExamId}/results/${attemptId}`);
  }

  if (!started) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-8">
        <h1 className="font-display text-2xl font-semibold text-indigo">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink/70">{instructions}</p>
        <p className="mt-3 text-xs text-ink/50">
          {questions.length} questions &middot; {durationMinutes} minutes
        </p>
        <Button size="lg" className="mt-6" onClick={() => setStarted(true)}>
          Begin exam
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-6 pb-28">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink/60">
          Question {index + 1} of {questions.length}
        </p>
        <ExamTimer durationMinutes={durationMinutes} onExpire={handleSubmit} />
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {questions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => setIndex(i)}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold",
              i === index && "ring-2 ring-indigo",
              q.selectedOptionId ? "bg-indigo/10 text-indigo" : "bg-ink/5 text-ink/40",
            )}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div className="mt-8">
        <p className="font-display text-xl font-semibold text-ink">{current.prompt}</p>
        <div className="mt-6 flex flex-col gap-3">
          {current.options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => selectOption(option.id)}
              className={cn(
                "rounded-2xl border-2 px-4 py-3.5 text-left text-sm font-medium transition-colors",
                current.selectedOptionId === option.id
                  ? "border-indigo bg-indigo/5"
                  : "border-ink/10 hover:border-indigo/40",
              )}
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 flex items-center justify-between border-t border-ink/10 bg-paper p-4">
        <Button
          variant="ghost"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
        >
          Previous
        </Button>
        <p className="text-xs text-ink/50">{answeredCount}/{questions.length} answered</p>
        {index + 1 < questions.length ? (
          <Button onClick={() => setIndex((i) => i + 1)}>Next</Button>
        ) : (
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting…" : "Submit"}
          </Button>
        )}
      </div>
    </div>
  );
}
