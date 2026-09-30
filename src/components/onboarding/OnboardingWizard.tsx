"use client";

import { useMemo, useState } from "react";

import { completeOnboarding } from "@/lib/actions/onboarding";
import { DAILY_GOAL_OPTIONS, STUDY_LEVELS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Sage } from "@/components/brand/Mascots";
import { cn } from "@/lib/utils";

interface Subject {
  id: string;
  name: string;
  slug: string;
  kind: string;
}

interface Exam {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  subjects: Subject[];
}

const STEPS = ["exam", "subjects", "target", "goal", "review"] as const;
type Step = (typeof STEPS)[number];

const UTME_SUPPORTED_SUBJECTS = new Set([
  "english",
  "mathematics",
  "biology",
  "chemistry",
  "physics",
  "government",
  "literature-in-english",
  "christian-religious-studies",
]);

export function OnboardingWizard({
  exams,
  studentName,
}: {
  exams: Exam[];
  studentName: string;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [examId, setExamId] = useState<string | null>(null);
  const [subjectIds, setSubjectIds] = useState<string[]>([]);
  const [targetScore, setTargetScore] = useState("");
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(10);
  const [studyLevel, setStudyLevel] = useState<string>("BEGINNER");

  const step: Step = STEPS[stepIndex];

  const selectedExam = useMemo(
    () => exams.find((e) => e.id === examId),
    [exams, examId],
  );

  const isUtme = selectedExam?.slug === "jamb-utme";

  const selectedSubjects = useMemo(() => {
    if (!selectedExam) return [];

    return selectedExam.subjects.filter((subject) =>
      subjectIds.includes(subject.id),
    );
  }, [selectedExam, subjectIds]);

  const hasEnglish = selectedSubjects.some(
    (subject) => subject.slug === "english",
  );

  function next() {
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }

  function back() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  const subjectsValid = isUtme
    ? subjectIds.length === 4 && hasEnglish
    : subjectIds.length > 0;

  const canProceed =
    (step === "exam" && !!examId) ||
    (step === "subjects" && subjectsValid) ||
    step === "target" ||
    step === "goal" ||
    step === "review";

  function toggleSubject(subject: Subject) {
    const supported =
      !isUtme || UTME_SUPPORTED_SUBJECTS.has(subject.slug);

    if (!supported) return;

    setSubjectIds((prev) => {
      const alreadySelected = prev.includes(subject.id);

      if (alreadySelected) {
        return prev.filter((id) => id !== subject.id);
      }

      if (isUtme && prev.length >= 4) {
        return prev;
      }

      return [...prev, subject.id];
    });
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <ProgressDots current={stepIndex} total={STEPS.length} />

      <div className="rounded-3xl bg-paper p-8 shadow-sm">
        {step === "exam" && (
          <section>
            <h1 className="font-display text-2xl font-semibold text-indigo">
              Which exam are you preparing for, {studentName}?
            </h1>

            <p className="mt-1 text-sm text-ink/60">
              Basira maps the whole syllabus for you in seconds.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {exams.map((exam) => (
                <button
                  key={exam.id}
                  type="button"
                  onClick={() => {
                    setExamId(exam.id);
                    setSubjectIds([]);
                  }}
                  className={cn(
                    "rounded-2xl border-2 p-4 text-left transition-colors",
                    examId === exam.id
                      ? "border-indigo bg-indigo/5"
                      : "border-ink/10 hover:border-indigo/40",
                  )}
                >
                  <p className="font-display font-semibold text-indigo">
                    {exam.shortName}
                  </p>

                  <p className="text-xs text-ink/60">{exam.name}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === "subjects" && selectedExam && (
          <section>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl font-semibold text-indigo">
                  Which{" "}
                  {selectedExam.subjects[0]?.kind === "SKILL"
                    ? "skills"
                    : "subjects"}{" "}
                  do you need?
                </h1>

                <p className="mt-1 text-sm text-ink/60">
                  {isUtme
                    ? "Choose exactly 4 UTME subjects. Use of English is required."
                    : "Pick the subjects you want to study."}
                </p>
              </div>

              {isUtme && (
                <div
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1.5 font-mono text-xs font-semibold",
                    subjectsValid
                      ? "bg-sage/10 text-sage"
                      : "bg-indigo/10 text-indigo",
                  )}
                >
                  {subjectIds.length}/4
                </div>
              )}
            </div>

            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {selectedExam.subjects.map((subject) => {
                const checked = subjectIds.includes(subject.id);

                const supported =
                  !isUtme ||
                  UTME_SUPPORTED_SUBJECTS.has(subject.slug);

                const maxReached =
                  isUtme && subjectIds.length >= 4 && !checked;

                const disabled = !supported || maxReached;

                return (
                  <button
                    key={subject.id}
                    type="button"
                    onClick={() => toggleSubject(subject)}
                    disabled={disabled}
                    className={cn(
                      "flex items-center justify-between rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-colors",
                      checked
                        ? "border-indigo bg-indigo/5 text-indigo"
                        : supported
                          ? "border-ink/10 text-ink/80 hover:border-indigo/40"
                          : "border-ink/5 bg-ink/[0.02] text-ink/35",
                      disabled && !checked && "cursor-not-allowed",
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs",
                          checked
                            ? "border-indigo bg-indigo text-paper"
                            : "border-ink/20",
                        )}
                      >
                        {checked ? "✓" : ""}
                      </span>

                      {subject.name}
                    </span>

                    {!supported && (
                      <span className="ml-2 shrink-0 text-[10px] font-semibold uppercase tracking-wide text-ink/35">
                        Coming soon
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {isUtme && (
              <div className="mt-5 rounded-2xl bg-indigo/[0.04] p-4">
                <p className="text-sm font-medium text-indigo">
                  {subjectIds.length === 4
                    ? hasEnglish
                      ? "Your UTME subject combination is ready."
                      : "Use of English must be included."
                    : `${4 - subjectIds.length} more subject${
                        4 - subjectIds.length === 1 ? "" : "s"
                      } needed.`}
                </p>

                <p className="mt-1 text-xs leading-5 text-ink/50">
                  Subjects marked “Coming soon” are not yet available for
                  lessons and mock questions.
                </p>
              </div>
            )}
          </section>
        )}

        {step === "target" && (
          <section>
            <h1 className="font-display text-2xl font-semibold text-indigo">
              What&apos;s your target?
            </h1>

            <p className="mt-1 text-sm text-ink/60">
              Optional — helps Basira pace your path. You can change this
              later.
            </p>

            <input
              value={targetScore}
              onChange={(e) => setTargetScore(e.target.value)}
              placeholder="e.g. 300, or Band 7.0"
              className="input mt-6"
            />

            <div className="mt-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink/50">
                Where are you starting from?
              </p>

              <div className="flex gap-2">
                {STUDY_LEVELS.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setStudyLevel(level)}
                    className={cn(
                      "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                      studyLevel === level
                        ? "bg-indigo text-paper"
                        : "bg-ink/5 text-ink/70",
                    )}
                  >
                    {level[0] + level.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {step === "goal" && (
          <section>
            <h1 className="font-display text-2xl font-semibold text-indigo">
              How many minutes a day?
            </h1>

            <p className="mt-1 text-sm text-ink/60">
              Short on time? Even 5 minutes keeps a streak alive.
            </p>

            <div className="mt-6 grid grid-cols-4 gap-3">
              {DAILY_GOAL_OPTIONS.map((minutes) => (
                <button
                  key={minutes}
                  type="button"
                  onClick={() => setDailyGoalMinutes(minutes)}
                  className={cn(
                    "rounded-2xl border-2 py-4 text-center font-mono-basira text-lg font-semibold transition-colors",
                    dailyGoalMinutes === minutes
                      ? "border-indigo bg-indigo/5 text-indigo"
                      : "border-ink/10 text-ink/70",
                  )}
                >
                  {minutes}m
                </button>
              ))}
            </div>
          </section>
        )}

        {step === "review" && selectedExam && (
          <section className="flex flex-col items-center text-center">
            <Sage className="h-24 w-24" />

            <h1 className="mt-4 font-display text-2xl font-semibold text-indigo">
              Your Basira path is ready.
            </h1>

            <p className="mt-2 max-w-sm text-sm text-ink/60">
              {selectedExam.shortName} &middot; {subjectIds.length} subject
              {subjectIds.length === 1 ? "" : "s"} &middot; {dailyGoalMinutes}{" "}
              min/day
            </p>

            <form action={completeOnboarding} className="mt-6 w-full">
              <input type="hidden" name="examId" value={examId ?? ""} />
              <input type="hidden" name="targetScore" value={targetScore} />
              <input
                type="hidden"
                name="dailyGoalMinutes"
                value={dailyGoalMinutes}
              />
              <input type="hidden" name="studyLevel" value={studyLevel} />

              {subjectIds.map((id) => (
                <input
                  key={id}
                  type="hidden"
                  name="subjectIds"
                  value={id}
                />
              ))}

              <Button type="submit" size="lg" className="w-full">
                Start my streak
              </Button>
            </form>
          </section>
        )}
      </div>

      {step !== "review" && (
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={back}
            disabled={stepIndex === 0}
            className="text-sm font-medium text-ink/50 disabled:opacity-0"
          >
            Back
          </button>

          <Button type="button" onClick={next} disabled={!canProceed}>
            Continue
          </Button>
        </div>
      )}
    </div>
  );
}

function ProgressDots({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div className="mx-auto flex gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-1.5 w-8 rounded-full transition-colors",
            i <= current ? "bg-indigo" : "bg-ink/10",
          )}
        />
      ))}
    </div>
  );
}
