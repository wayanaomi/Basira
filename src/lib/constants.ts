// Application-level "enums" for fields modeled as `String` in prisma/schema.prisma
// (SQLite does not support native Prisma enums). Always read/write these fields
// through the literal unions below instead of raw strings.

export const USER_ROLES = ["STUDENT", "ADMIN"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const SUBJECT_KINDS = ["SUBJECT", "SKILL"] as const;
export type SubjectKind = (typeof SUBJECT_KINDS)[number];

export const QUESTION_TYPES = [
  "MULTIPLE_CHOICE",
  "TRUE_FALSE",
  "CALCULATION",
  "FILL_IN",
  "IMAGE",
  "PASSAGE",
] as const;
export type QuestionType = (typeof QUESTION_TYPES)[number];

export const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export const LESSON_PROGRESS_STATUSES = [
  "NOT_STARTED",
  "IN_PROGRESS",
  "COMPLETED",
] as const;
export type LessonProgressStatus = (typeof LESSON_PROGRESS_STATUSES)[number];

export const ATTEMPT_SOURCES = ["LESSON", "REVIEW", "MOCK"] as const;
export type AttemptSource = (typeof ATTEMPT_SOURCES)[number];

export const XP_REASONS = [
  "LESSON_COMPLETE",
  "CORRECT_ANSWER",
  "DAILY_GOAL",
  "MOCK_COMPLETE",
  "ACHIEVEMENT",
] as const;
export type XpReason = (typeof XP_REASONS)[number];

export const XP_AMOUNTS: Record<XpReason, number> = {
  CORRECT_ANSWER: 10,
  LESSON_COMPLETE: 25,
  DAILY_GOAL: 15,
  MOCK_COMPLETE: 50,
  ACHIEVEMENT: 20,
};

export const MOCK_ATTEMPT_STATUSES = ["IN_PROGRESS", "SUBMITTED"] as const;
export type MockAttemptStatus = (typeof MOCK_ATTEMPT_STATUSES)[number];

export const RECOMMENDATION_TYPES = [
  "REVIEW_TOPIC",
  "CONTINUE_LESSON",
  "TAKE_MOCK",
] as const;
export type RecommendationType = (typeof RECOMMENDATION_TYPES)[number];

export const STUDY_LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;
export type StudyLevel = (typeof STUDY_LEVELS)[number];

// Daily goal options offered during onboarding and in settings (minutes/day).
export const DAILY_GOAL_OPTIONS = [5, 10, 20, 30] as const;

// Minimum real activity required before a readiness score is shown at all —
// prevents a brand-new learner from ever seeing a fabricated percentage.
export const READINESS_MIN_LESSONS = 3;
export const READINESS_MIN_QUESTIONS = 15;
