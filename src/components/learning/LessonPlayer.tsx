"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { submitAnswer, completeLesson } from "@/lib/actions/lesson";
import { QuestionCard } from "@/components/learning/QuestionCard";
import { FeedbackPanel } from "@/components/learning/FeedbackPanel";
import { SparkIcon } from "@/components/gamification/XPBadge";
import { Sage } from "@/components/brand/Mascots";
import { Button } from "@/components/ui/Button";

interface ContentStep {
  type: string;
  text: string;
}
interface QuestionData {
  id: string;
  prompt: string;
  options: { id: string; text: string }[];
}

export function LessonPlayer({
  lessonId,
  lessonTitle,
  subjectSlug,
  topicSlug,
  content,
  questions,
}: {
  lessonId: string;
  lessonTitle: string;
  subjectSlug: string;
  topicSlug: string;
  content: ContentStep[];
  questions: QuestionData[];
}) {
  const router = useRouter();
  const [phase, setPhase] = useState<"content" | "question" | "complete">(
    content.length > 0 ? "content" : "question",
  );
  const [contentIndex, setContentIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; explanation: string; correctOptionId: string | null } | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [startedAt] = useState(() => Date.now());
  const [summary, setSummary] = useState<{ xpAwarded: number; streak: number } | null>(null);

  const totalSteps = content.length + questions.length;
  const currentStep = phase === "content" ? contentIndex : content.length + questionIndex;

  async function handleSelect(optionId: string) {
    setSelectedId(optionId);
    const question = questions[questionIndex];
    const result = await submitAnswer({
      questionId: question.id,
      selectedOptionId: optionId,
      timeSpentMs: Date.now() - startedAt,
    });
    if (result.isCorrect) setCorrectCount((c) => c + 1);
    setFeedback(result);
  }

  function handleFeedbackContinue() {
    setFeedback(null);
    setSelectedId(null);
    if (questionIndex + 1 < questions.length) {
      setQuestionIndex((i) => i + 1);
    } else {
      finishLesson();
    }
  }

  async function finishLesson() {
    const timeSpentSeconds = Math.round((Date.now() - startedAt) / 1000);
    const result = await completeLesson({
      lessonId,
      correctCount,
      totalCount: questions.length,
      timeSpentSeconds,
    });
    setSummary({ xpAwarded: result.xpAwarded, streak: result.streak });
    setPhase("complete");
  }

  if (phase === "complete" && summary) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
        <Sage className="h-28 w-28" />
        <h1 className="mt-4 font-display text-2xl font-semibold text-indigo">Lesson complete</h1>
        <p className="mt-2 text-sm text-ink/60">
          {correctCount}/{questions.length} correct &middot; longest streak {summary.streak}
        </p>
        <div className="mt-4 flex items-center gap-2 rounded-full bg-gold/10 px-4 py-2 text-gold">
          <SparkIcon className="h-5 w-5" />
          <span className="font-mono-basira font-semibold">+{summary.xpAwarded} XP</span>
        </div>
        <Button className="mt-8" size="lg" onClick={() => router.push(`/learn/${subjectSlug}/${topicSlug}`)}>
          Back to path
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-8 pb-32">
      <div className="mb-6 flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i <= currentStep ? "bg-indigo" : "bg-ink/10"}`}
          />
        ))}
      </div>
      <p className="mb-4 text-xs font-medium uppercase tracking-wide text-ink/40">{lessonTitle}</p>

      <AnimatePresence mode="wait">
        {phase === "content" && (
          <motion.div
            key={`content-${contentIndex}`}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-violet">
              {content[contentIndex].type}
            </p>
            <p className="mt-3 font-display text-2xl leading-snug text-ink">
              {content[contentIndex].text}
            </p>
            <Button
              size="lg"
              className="mt-8"
              onClick={() => {
                if (contentIndex + 1 < content.length) setContentIndex((i) => i + 1);
                else setPhase("question");
              }}
            >
              Continue
            </Button>
          </motion.div>
        )}

        {phase === "question" && questions[questionIndex] && (
          <motion.div
            key={`question-${questionIndex}`}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
          >
            <QuestionCard
              prompt={questions[questionIndex].prompt}
              options={questions[questionIndex].options}
              selectedId={selectedId}
              correctId={feedback?.correctOptionId ?? null}
              revealed={!!feedback}
              onSelect={handleSelect}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {feedback && (
        <FeedbackPanel
          isCorrect={feedback.isCorrect}
          explanation={feedback.explanation}
          onContinue={handleFeedbackContinue}
        />
      )}
    </div>
  );
}
