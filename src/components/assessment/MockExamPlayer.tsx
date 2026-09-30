"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import {
  saveMockAnswer,
  submitMockExam,
} from "@/lib/actions/mock";
import { ExamTimer } from "@/components/assessment/ExamTimer";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface QuestionData {
  id: string;
  prompt: string;
  options: {
    id: string;
    text: string;
  }[];
  selectedOptionId: string | null;
}

export function MockExamPlayer({
  attemptId,
  mockExamId,
  title,
  instructions,
  durationMinutes,
  remainingSeconds,
  questions: initialQuestions,
}: {
  attemptId: string;
  mockExamId: string;
  title: string;
  instructions: string;
  durationMinutes: number;
  remainingSeconds: number;
  questions: QuestionData[];
}) {
  const router = useRouter();

  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState(initialQuestions);
  const [index, setIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const current = questions[index];

  const answeredCount = questions.filter(
    (question) => question.selectedOptionId,
  ).length;

  const handleSubmit = useCallback(async () => {
    if (submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      await submitMockExam(attemptId);
      router.push(
        `/mock/${mockExamId}/results/${attemptId}`,
      );
      router.refresh();
    } catch (submitError) {
      setSubmitting(false);

      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to submit your mock.",
      );
    }
  }, [attemptId, mockExamId, router, submitting]);

  async function selectOption(optionId: string) {
    if (submitting) return;

    setError(null);

    setQuestions((previous) =>
      previous.map((question, questionIndex) =>
        questionIndex === index
          ? {
              ...question,
              selectedOptionId: optionId,
            }
          : question,
      ),
    );

    try {
      await saveMockAnswer({
        attemptId,
        questionId: current.id,
        selectedOptionId: optionId,
      });
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save your answer.",
      );
    }
  }

  if (!current) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg items-center px-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-indigo">
            No questions available
          </h1>

          <p className="mt-2 text-sm text-ink/60">
            This mock does not contain any questions.
          </p>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-8">
        <p className="font-mono-basira text-xs font-semibold uppercase tracking-[0.18em] text-violet">
          UTME Practice Mock
        </p>

        <h1 className="mt-3 font-display text-3xl font-semibold text-indigo">
          {title}
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-ink/70">
          {instructions}
        </p>

        <div className="mt-5 rounded-2xl border border-indigo/10 bg-cloud-mist p-4">
          <p className="text-sm font-semibold text-indigo">
            {questions.length} questions
          </p>

          <p className="mt-1 text-xs text-ink/50">
            {durationMinutes} minutes
          </p>
        </div>

        {error && (
          <p className="mt-4 rounded-xl bg-alert/10 px-4 py-3 text-sm text-alert">
            {error}
          </p>
        )}

        <Button
          size="lg"
          className="mt-6"
          onClick={() => setStarted(true)}
        >
          Begin exam
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-6 pb-28">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-ink/60">
          Question {index + 1} of {questions.length}
        </p>

        <ExamTimer
          initialSeconds={remainingSeconds}
          onExpire={handleSubmit}
        />
      </div>

      {error && (
        <div className="mt-4 rounded-xl bg-alert/10 px-4 py-3 text-sm text-alert">
          {error}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-1.5">
        {questions.map((question, questionIndex) => (
          <button
            key={question.id}
            type="button"
            onClick={() => setIndex(questionIndex)}
            disabled={submitting}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold",
              questionIndex === index &&
                "ring-2 ring-indigo",
              question.selectedOptionId
                ? "bg-indigo/10 text-indigo"
                : "bg-ink/5 text-ink/40",
            )}
          >
            {questionIndex + 1}
          </button>
        ))}
      </div>

      <div className="mt-8">
        <p className="font-display text-xl font-semibold leading-8 text-ink">
          {current.prompt}
        </p>

        <div className="mt-6 flex flex-col gap-3">
          {current.options.map((option) => (
            <button
              key={option.id}
              type="button"
              disabled={submitting}
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
          onClick={() =>
            setIndex((currentIndex) =>
              Math.max(0, currentIndex - 1),
            )
          }
          disabled={index === 0 || submitting}
        >
          Previous
        </Button>

        <p className="text-xs text-ink/50">
          {answeredCount}/{questions.length} answered
        </p>

        {index + 1 < questions.length ? (
          <Button
            onClick={() =>
              setIndex((currentIndex) => currentIndex + 1)
            }
            disabled={submitting}
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Submitting…" : "Submit"}
          </Button>
        )}
      </div>
    </div>
  );
}
