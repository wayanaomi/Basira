/**
 * SYSTEM / EDUCATIONAL CONTENT SEED ONLY.
 *
 * This script must never create User, Streak, XPTransaction, QuestionAttempt,
 * LessonProgress, MockExamAttempt, or any other learner-activity row. See
 * Master Prompt §56–§68 and docs/DECISIONS.md — Zero demo/fake learner data.
 *
 * Run with: npm run db:seed
 */
import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  // ---- Levels (progression thresholds — system content) ------------------
  const levels = [
    { name: "Beginner", minXp: 0, order: 0 },
    { name: "Explorer", minXp: 100, order: 1 },
    { name: "Learner", minXp: 300, order: 2 },
    { name: "Scholar", minXp: 700, order: 3 },
    { name: "Achiever", minXp: 1500, order: 4 },
  ];
  for (const level of levels) {
    await prisma.level.upsert({
      where: { minXp: level.minXp },
      create: level,
      update: level,
    });
  }

  // ---- Achievements (definitions — system content) ------------------------
  const achievements = [
    { key: "FIRST_LESSON", name: "First Lesson", description: "Completed your first lesson.", icon: "spark" },
    { key: "STREAK_7", name: "7-Day Streak", description: "Studied seven days in a row.", icon: "flame" },
    { key: "QUESTIONS_100", name: "100 Questions", description: "Answered 100 practice questions.", icon: "check" },
    { key: "TOPIC_MASTERY", name: "Topic Mastery", description: "Reached 80% mastery on a topic.", icon: "diamond" },
    { key: "FIRST_MOCK", name: "First Mock Exam", description: "Completed your first mock exam.", icon: "clock" },
  ];
  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { key: achievement.key },
      create: achievement,
      update: achievement,
    });
  }

  // ---- Exams (extensible exam architecture — content, not fake activity) --
  const jamb = await prisma.exam.upsert({
    where: { slug: "jamb-utme" },
    create: {
      slug: "jamb-utme",
      name: "JAMB UTME",
      shortName: "UTME",
      description: "Unified Tertiary Matriculation Examination for Nigerian universities.",
      order: 0,
    },
    update: {},
  });

  await prisma.exam.upsert({
    where: { slug: "ssce" },
    create: {
      slug: "ssce",
      name: "Senior School Certificate Examination",
      shortName: "SSCE",
      description: "WAEC/NECO senior secondary certificate examinations.",
      order: 1,
    },
    update: {},
  });

  await prisma.exam.upsert({
    where: { slug: "ielts" },
    create: {
      slug: "ielts",
      name: "IELTS",
      shortName: "IELTS",
      description: "International English Language Testing System — skill-based preparation.",
      order: 2,
    },
    update: {},
  });

  // ---- JAMB UTME → Mathematics → Algebra (fully authored slice) ----------
  const mathematics = await prisma.subject.upsert({
    where: { examId_slug: { examId: jamb.id, slug: "mathematics" } },
    create: { examId: jamb.id, slug: "mathematics", name: "Mathematics", order: 0 },
    update: {},
  });

  await prisma.subject.upsert({
    where: { examId_slug: { examId: jamb.id, slug: "english" } },
    create: { examId: jamb.id, slug: "english", name: "English Language", order: 1 },
    update: {},
  });
  await prisma.subject.upsert({
    where: { examId_slug: { examId: jamb.id, slug: "physics" } },
    create: { examId: jamb.id, slug: "physics", name: "Physics", order: 2 },
    update: {},
  });
  await prisma.subject.upsert({
    where: { examId_slug: { examId: jamb.id, slug: "chemistry" } },
    create: { examId: jamb.id, slug: "chemistry", name: "Chemistry", order: 3 },
    update: {},
  });

  await prisma.topic.upsert({
    where: { subjectId_slug: { subjectId: mathematics.id, slug: "foundations" } },
    create: {
      subjectId: mathematics.id,
      slug: "foundations",
      name: "Foundations",
      description: "Number bases, indices, and the building blocks of algebra.",
      order: 0,
    },
    update: {},
  });

  const linearEquations = await prisma.topic.upsert({
    where: { subjectId_slug: { subjectId: mathematics.id, slug: "linear-equations" } },
    create: {
      subjectId: mathematics.id,
      slug: "linear-equations",
      name: "Linear Equations",
      description: "Solving and applying equations of the first degree.",
      order: 1,
    },
    update: {},
  });

  const quadratics = await prisma.topic.upsert({
    where: { subjectId_slug: { subjectId: mathematics.id, slug: "quadratics" } },
    create: {
      subjectId: mathematics.id,
      slug: "quadratics",
      name: "Quadratics",
      description: "Factorisation, the quadratic formula, and completing the square.",
      order: 2,
    },
    update: {},
  });

  await prisma.topic.upsert({
    where: { subjectId_slug: { subjectId: mathematics.id, slug: "functions" } },
    create: {
      subjectId: mathematics.id,
      slug: "functions",
      name: "Functions",
      description: "Mappings, domain and range, and composite functions.",
      order: 3,
    },
    update: {},
  });

  // Lessons + questions for Linear Equations (the fully playable slice).
  const lesson1 = await prisma.lesson.create({
    data: {
      topicId: linearEquations.id,
      title: "What makes an equation linear",
      order: 0,
      estimatedMinutes: 6,
      content: JSON.stringify([
        { type: "intro", text: "A linear equation is any equation where the highest power of the variable is 1." },
        { type: "concept", text: "Think of it as a balance: whatever you do to one side, you must do to the other, to keep both sides equal." },
        { type: "example", text: "2x + 3 = 11 → subtract 3 from both sides → 2x = 8 → divide by 2 → x = 4." },
      ]),
    },
  });

  const lesson2 = await prisma.lesson.create({
    data: {
      topicId: linearEquations.id,
      title: "Solving for x with fractions",
      order: 1,
      estimatedMinutes: 8,
      content: JSON.stringify([
        { type: "intro", text: "Fractions in an equation aren't scary — clear them first." },
        { type: "concept", text: "Multiply every term by the denominator to remove the fraction, then solve as usual." },
        { type: "example", text: "x/3 + 2 = 5 → multiply by 3 → x + 6 = 15 → x = 9." },
      ]),
    },
  });

  await prisma.question.create({
    data: {
      topicId: linearEquations.id,
      lessonId: lesson1.id,
      type: "MULTIPLE_CHOICE",
      prompt: "Solve for x: 2x + 3 = 11",
      difficulty: "EASY",
      explanation: "Subtract 3 from both sides to get 2x = 8, then divide by 2 to get x = 4.",
      options: {
        create: [
          { text: "x = 4", isCorrect: true, order: 0 },
          { text: "x = 7", isCorrect: false, order: 1 },
          { text: "x = 5.5", isCorrect: false, order: 2 },
          { text: "x = 14", isCorrect: false, order: 3 },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      topicId: linearEquations.id,
      lessonId: lesson1.id,
      type: "MULTIPLE_CHOICE",
      prompt: "Solve for x: 5x - 4 = 16",
      difficulty: "EASY",
      explanation: "Add 4 to both sides to get 5x = 20, then divide by 5 to get x = 4.",
      options: {
        create: [
          { text: "x = 4", isCorrect: true, order: 0 },
          { text: "x = 3", isCorrect: false, order: 1 },
          { text: "x = 20", isCorrect: false, order: 2 },
          { text: "x = 2.4", isCorrect: false, order: 3 },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      topicId: linearEquations.id,
      lessonId: lesson2.id,
      type: "MULTIPLE_CHOICE",
      prompt: "Solve for x: x/3 + 2 = 5",
      difficulty: "MEDIUM",
      explanation: "Multiply every term by 3 to clear the fraction: x + 6 = 15, so x = 9.",
      options: {
        create: [
          { text: "x = 9", isCorrect: true, order: 0 },
          { text: "x = 15", isCorrect: false, order: 1 },
          { text: "x = 1", isCorrect: false, order: 2 },
          { text: "x = 21", isCorrect: false, order: 3 },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      topicId: linearEquations.id,
      lessonId: lesson2.id,
      type: "MULTIPLE_CHOICE",
      prompt: "Solve for x: (x + 1)/2 = 4",
      difficulty: "MEDIUM",
      explanation: "Multiply both sides by 2: x + 1 = 8, so x = 7.",
      options: {
        create: [
          { text: "x = 7", isCorrect: true, order: 0 },
          { text: "x = 9", isCorrect: false, order: 1 },
          { text: "x = 8", isCorrect: false, order: 2 },
          { text: "x = 3.5", isCorrect: false, order: 3 },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      topicId: linearEquations.id,
      type: "MULTIPLE_CHOICE",
      prompt: "A number increased by 7 gives 20. What is the number?",
      difficulty: "EASY",
      explanation: "Let the number be x: x + 7 = 20, so x = 13.",
      options: {
        create: [
          { text: "13", isCorrect: true, order: 0 },
          { text: "27", isCorrect: false, order: 1 },
          { text: "14", isCorrect: false, order: 2 },
          { text: "7", isCorrect: false, order: 3 },
        ],
      },
    },
  });

  // A handful of standalone Quadratics questions so the mock exam + weak-topic
  // recommendation logic have real, curriculum-accurate content to draw on.
  await prisma.question.create({
    data: {
      topicId: quadratics.id,
      type: "MULTIPLE_CHOICE",
      prompt: "Factorise: x² + 5x + 6",
      difficulty: "MEDIUM",
      explanation: "Look for two numbers that multiply to 6 and add to 5: 2 and 3. So (x+2)(x+3).",
      options: {
        create: [
          { text: "(x + 2)(x + 3)", isCorrect: true, order: 0 },
          { text: "(x + 1)(x + 6)", isCorrect: false, order: 1 },
          { text: "(x - 2)(x - 3)", isCorrect: false, order: 2 },
          { text: "(x + 5)(x + 1)", isCorrect: false, order: 3 },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      topicId: quadratics.id,
      type: "MULTIPLE_CHOICE",
      prompt: "Solve: x² - 9 = 0",
      difficulty: "EASY",
      explanation: "x² = 9, so x = 3 or x = -3.",
      options: {
        create: [
          { text: "x = 3 or x = -3", isCorrect: true, order: 0 },
          { text: "x = 9", isCorrect: false, order: 1 },
          { text: "x = 3 only", isCorrect: false, order: 2 },
          { text: "x = -9", isCorrect: false, order: 3 },
        ],
      },
    },
  });

  // ---- A published mock exam over the seeded question bank ---------------
  const allQuestions = await prisma.question.findMany({
    where: { topic: { subjectId: mathematics.id } },
    orderBy: { createdAt: "asc" },
  });

  const mock = await prisma.mockExam.create({
    data: {
      examId: jamb.id,
      title: "Mathematics Diagnostic — Algebra",
      instructions:
        "Answer every question. You can move between questions freely before submitting. There is no penalty for guessing.",
      durationMinutes: 15,
      isPublished: true,
    },
  });

  await prisma.mockExamQuestion.createMany({
    data: allQuestions.map((q, index) => ({
      mockExamId: mock.id,
      questionId: q.id,
      order: index,
    })),
  });

  console.log("Seeded system/content data:");
  console.log(`  Exams: 3, Subjects: ${5}, Topics: 4, Lessons: 2, Questions: ${allQuestions.length}`);
  console.log("  Zero learner/user rows created (per Master Prompt §56-68).");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
