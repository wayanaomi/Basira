/**
 * SYSTEM / EDUCATIONAL CONTENT SEED ONLY.
 *
 * This script must never create User, Streak, XPTransaction, QuestionAttempt,
 * LessonProgress, MockExamAttempt, or any other learner-activity row.
 *
 * It creates only:
 * - system progression definitions
 * - achievement definitions
 * - exam definitions
 * - subject definitions
 * - educational topics
 * - lessons
 * - questions
 * - mock-exam definitions and their question mappings
 *
 * Run with:
 * npm run db:seed
 */

import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { seedJambCoreContent } from "./seed-data/utme-core";
import { seedSsceIeltsCoreContent } from "./seed-data/ssce-ielts-core";

async function getOrCreateLesson(data: {
  topicId: string;
  subtopicId?: string;
  title: string;
  order: number;
  estimatedMinutes: number;
  content: string;
  isPublished?: boolean;
}) {
  const existing = await prisma.lesson.findFirst({
    where: {
      topicId: data.topicId,
      title: data.title,
    },
  });

  if (existing) {
    return prisma.lesson.update({
      where: {
        id: existing.id,
      },
      data: {
        subtopicId: data.subtopicId,
        order: data.order,
        estimatedMinutes: data.estimatedMinutes,
        content: data.content,
        isPublished: data.isPublished ?? true,
      },
    });
  }

  return prisma.lesson.create({
    data: {
      topicId: data.topicId,
      subtopicId: data.subtopicId,
      title: data.title,
      order: data.order,
      estimatedMinutes: data.estimatedMinutes,
      content: data.content,
      isPublished: data.isPublished ?? true,
    },
  });
}

async function getOrCreateQuestion(data: {
  topicId: string;
  lessonId?: string;
  type?: string;
  prompt: string;
  passageText?: string;
  imageUrl?: string;
  difficulty?: string;
  explanation: string;
  source?: string;
  year?: number;
  isPublished?: boolean;
  options: Array<{
    text: string;
    isCorrect: boolean;
    order: number;
  }>;
}) {
  const existing = await prisma.question.findFirst({
    where: {
      topicId: data.topicId,
      prompt: data.prompt,
    },
  });

  if (existing) {
    await prisma.questionOption.deleteMany({
      where: {
        questionId: existing.id,
      },
    });

    return prisma.question.update({
      where: {
        id: existing.id,
      },
      data: {
        lessonId: data.lessonId,
        type: data.type ?? "MULTIPLE_CHOICE",
        passageText: data.passageText,
        imageUrl: data.imageUrl,
        difficulty: data.difficulty ?? "MEDIUM",
        explanation: data.explanation,
        source: data.source,
        year: data.year,
        isPublished: data.isPublished ?? true,
        options: {
          create: data.options,
        },
      },
      include: {
        options: true,
      },
    });
  }

  return prisma.question.create({
    data: {
      topicId: data.topicId,
      lessonId: data.lessonId,
      type: data.type ?? "MULTIPLE_CHOICE",
      prompt: data.prompt,
      passageText: data.passageText,
      imageUrl: data.imageUrl,
      difficulty: data.difficulty ?? "MEDIUM",
      explanation: data.explanation,
      source: data.source,
      year: data.year,
      isPublished: data.isPublished ?? true,
      options: {
        create: data.options,
      },
    },
    include: {
      options: true,
    },
  });
}

async function main() {
  // ---------------------------------------------------------------------------
  // LEVELS
  // ---------------------------------------------------------------------------

  const levels = [
    {
      name: "Beginner",
      minXp: 0,
      order: 0,
    },
    {
      name: "Explorer",
      minXp: 100,
      order: 1,
    },
    {
      name: "Learner",
      minXp: 300,
      order: 2,
    },
    {
      name: "Scholar",
      minXp: 700,
      order: 3,
    },
    {
      name: "Achiever",
      minXp: 1500,
      order: 4,
    },
  ];

  for (const level of levels) {
    await prisma.level.upsert({
      where: {
        minXp: level.minXp,
      },
      create: level,
      update: level,
    });
  }

  // ---------------------------------------------------------------------------
  // ACHIEVEMENTS
  // System definitions only. No UserAchievement rows are created.
  // ---------------------------------------------------------------------------

  const achievements = [
  {
    key: "FIRST_LESSON",
    name: "First Lesson",
    description: "Completed your first lesson.",
    icon: "book",
  },
  {
    key: "STREAK_3",
    name: "Three-Day Run",
    description: "Studied three days in a row.",
    icon: "flame",
  },
  {
    key: "STREAK_7",
    name: "Seven-Day Streak",
    description: "Studied seven days in a row.",
    icon: "flame",
  },
  {
    key: "QUESTIONS_10",
    name: "First Ten",
    description: "Answered 10 practice questions.",
    icon: "check",
  },
  {
    key: "QUESTIONS_50",
    name: "Getting Serious",
    description: "Answered 50 practice questions.",
    icon: "check",
  },
  {
    key: "QUESTIONS_100",
    name: "Question Master",
    description: "Answered 100 practice questions.",
    icon: "check",
  },
  {
    key: "TOPIC_MASTERY",
    name: "Topic Mastery",
    description: "Reached 80% mastery on a topic.",
    icon: "diamond",
  },
  {
    key: "FIRST_MOCK",
    name: "First Mock Exam",
    description: "Completed your first mock exam.",
    icon: "clock",
  },
];

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: {
        key: achievement.key,
      },
      create: achievement,
      update: achievement,
    });
  }

  // ---------------------------------------------------------------------------
  // EXAMS
  // ---------------------------------------------------------------------------

  const jamb = await prisma.exam.upsert({
    where: {
      slug: "jamb-utme",
    },
    create: {
      slug: "jamb-utme",
      name: "JAMB UTME",
      shortName: "UTME",
      description:
        "Unified Tertiary Matriculation Examination for Nigerian universities.",
      order: 0,
    },
    update: {},
  });

    const ssce = await prisma.exam.upsert({
    where: {
      slug: "ssce",
    },
    create: {
      slug: "ssce",
      name: "Senior School Certificate Examination",
      shortName: "SSCE",
      description:
        "WAEC/NECO senior secondary certificate examinations.",
      order: 1,
    },
    update: {},
  });

  const ielts = await prisma.exam.upsert({
    where: {
      slug: "ielts",
    },
    create: {
      slug: "ielts",
      name: "IELTS",
      shortName: "IELTS",
      description:
        "International English Language Testing System — skill-based preparation.",
      order: 2,
    },
    update: {},
  });

  // ---------------------------------------------------------------------------
  // JAMB UTME SUBJECTS
  // ---------------------------------------------------------------------------

  const utmeSubjects = [
    {
      slug: "english",
      name: "Use of English",
      order: 0,
    },
    {
      slug: "mathematics",
      name: "Mathematics",
      order: 1,
    },
    {
      slug: "biology",
      name: "Biology",
      order: 2,
    },
    {
      slug: "chemistry",
      name: "Chemistry",
      order: 3,
    },
    {
      slug: "physics",
      name: "Physics",
      order: 4,
    },
    {
      slug: "government",
      name: "Government",
      order: 5,
    },
    {
      slug: "literature-in-english",
      name: "Literature-in-English",
      order: 6,
    },
    {
      slug: "christian-religious-studies",
      name: "Christian Religious Studies",
      order: 7,
    },
    {
      slug: "economics",
      name: "Economics",
      order: 8,
    },
    {
      slug: "commerce",
      name: "Commerce",
      order: 9,
    },
    {
      slug: "principles-of-accounts",
      name: "Principles of Accounts",
      order: 10,
    },
    {
      slug: "geography",
      name: "Geography",
      order: 11,
    },
    {
      slug: "history",
      name: "History",
      order: 12,
    },
    {
      slug: "agricultural-science",
      name: "Agricultural Science",
      order: 13,
    },
    {
      slug: "computer-studies",
      name: "Computer Studies",
      order: 14,
    },
    {
      slug: "home-economics",
      name: "Home Economics",
      order: 15,
    },
    {
      slug: "physical-and-health-education",
      name: "Physical and Health Education",
      order: 16,
    },
    {
      slug: "arabic",
      name: "Arabic",
      order: 17,
    },
    {
      slug: "french",
      name: "French",
      order: 18,
    },
    {
      slug: "hausa",
      name: "Hausa",
      order: 19,
    },
    {
      slug: "igbo",
      name: "Igbo",
      order: 20,
    },
    {
      slug: "yoruba",
      name: "Yoruba",
      order: 21,
    },
    {
      slug: "islamic-studies",
      name: "Islamic Studies",
      order: 22,
    },
    {
      slug: "music",
      name: "Music",
      order: 23,
    },
    {
      slug: "art",
      name: "Art",
      order: 24,
    },
  ];

  const subjects = new Map<
    string,
    Awaited<ReturnType<typeof prisma.subject.upsert>>
  >();

  for (const subject of utmeSubjects) {
    const record = await prisma.subject.upsert({
      where: {
        examId_slug: {
          examId: jamb.id,
          slug: subject.slug,
        },
      },
      create: {
        examId: jamb.id,
        slug: subject.slug,
        name: subject.name,
        order: subject.order,
      },
      update: {
        name: subject.name,
        order: subject.order,
      },
    });

    subjects.set(subject.slug, record);
  }

    // ---------------------------------------------------------------------------
  // IELTS SKILLS
  // ---------------------------------------------------------------------------

  const ieltsSkills = [
    {
      slug: "listening",
      name: "Listening",
      description: "Build listening comprehension, accuracy, and test technique.",
      kind: "SKILL",
      order: 0,
    },
    {
      slug: "reading",
      name: "Reading",
      description: "Develop reading comprehension, vocabulary, and question strategy.",
      kind: "SKILL",
      order: 1,
    },
    {
      slug: "writing",
      name: "Writing",
      description: "Develop clear, structured responses for IELTS writing tasks.",
      kind: "SKILL",
      order: 2,
    },
    {
      slug: "speaking",
      name: "Speaking",
      description: "Build fluency, pronunciation, vocabulary, and speaking confidence.",
      kind: "SKILL",
      order: 3,
    },
  ];

  const ieltsSubjects = new Map<
    string,
    Awaited<ReturnType<typeof prisma.subject.upsert>>
  >();

  for (const skill of ieltsSkills) {
    const record = await prisma.subject.upsert({
      where: {
        examId_slug: {
          examId: ielts.id,
          slug: skill.slug,
        },
      },
      create: {
        examId: ielts.id,
        slug: skill.slug,
        name: skill.name,
        description: skill.description,
        kind: skill.kind,
        order: skill.order,
      },
      update: {
        name: skill.name,
        description: skill.description,
        kind: skill.kind,
        order: skill.order,
      },
    });

    ieltsSubjects.set(skill.slug, record);
  }

  // ---------------------------------------------------------------------------
  // SSCE SUBJECTS
  //
  // These are catalogue subjects only. Educational content will be added
  // separately from verified WAEC/NECO-aligned material.
  // ---------------------------------------------------------------------------

  const ssceSubjects = [
    {
      slug: "english-language",
      name: "English Language",
      order: 0,
    },
    {
      slug: "mathematics",
      name: "Mathematics",
      order: 1,
    },
    {
      slug: "biology",
      name: "Biology",
      order: 2,
    },
    {
      slug: "chemistry",
      name: "Chemistry",
      order: 3,
    },
    {
      slug: "physics",
      name: "Physics",
      order: 4,
    },
    {
      slug: "economics",
      name: "Economics",
      order: 5,
    },
    {
      slug: "government",
      name: "Government",
      order: 6,
    },
    {
      slug: "literature-in-english",
      name: "Literature-in-English",
      order: 7,
    },
    {
      slug: "christian-religious-studies",
      name: "Christian Religious Studies",
      order: 8,
    },
    {
      slug: "geography",
      name: "Geography",
      order: 9,
    },
    {
      slug: "commerce",
      name: "Commerce",
      order: 10,
    },
    {
      slug: "financial-accounting",
      name: "Financial Accounting",
      order: 11,
    },
    {
      slug: "agricultural-science",
      name: "Agricultural Science",
      order: 12,
    },
    {
      slug: "computer-studies",
      name: "Computer Studies",
      order: 13,
    },
    {
      slug: "civic-education",
      name: "Civic Education",
      order: 14,
    },
    {
      slug: "further-mathematics",
      name: "Further Mathematics",
      order: 15,
    },
  ];

  const ssceSubjectRecords = new Map<
    string,
    Awaited<ReturnType<typeof prisma.subject.upsert>>
  >();

  for (const subject of ssceSubjects) {
    const record = await prisma.subject.upsert({
      where: {
        examId_slug: {
          examId: ssce.id,
          slug: subject.slug,
        },
      },
      create: {
        examId: ssce.id,
        slug: subject.slug,
        name: subject.name,
        order: subject.order,
      },
      update: {
        name: subject.name,
        order: subject.order,
      },
    });

    ssceSubjectRecords.set(subject.slug, record);
  }

  const mathematics = subjects.get("mathematics")!;

  const english = subjects.get("english")!;
  const biology = subjects.get("biology")!;
  const chemistry = subjects.get("chemistry")!;
  const physics = subjects.get("physics")!;
  const government = subjects.get("government")!;
  const literature = subjects.get("literature-in-english")!;
  const christianReligiousStudies = subjects.get(
    "christian-religious-studies",
  )!;
  const economics = subjects.get("economics")!;
  const commerce = subjects.get("commerce")!;
  const principlesOfAccounts = subjects.get("principles-of-accounts")!;
  const geography = subjects.get("geography")!;
  const history = subjects.get("history")!;
  const agriculturalScience = subjects.get("agricultural-science")!;
  const computerStudies = subjects.get("computer-studies")!;

  void english;
  void biology;
  void chemistry;
  void physics;
  void government;
  void literature;
  void christianReligiousStudies;
  void economics;
  void commerce;
  void principlesOfAccounts;
  void geography;
  void history;
  void agriculturalScience;
  void computerStudies;

  // ---------------------------------------------------------------------------
  // OFFICIAL JAMB UTME MATHEMATICS SYLLABUS TOPICS
  //
  // Source: uploaded JAMB Mathematics syllabus.
  //
  // Section I   — Number and Numeration
  // Section II  — Algebra
  // Section III — Geometry and Trigonometry
  // Section IV  — Calculus
  // Section V   — Statistics
  // ---------------------------------------------------------------------------

  const mathematicsTopics = [
    {
      slug: "number-bases-modular-arithmetic",
      name: "Number Bases / Modular Arithmetic",
      description:
        "Operations in different number bases, conversion between bases, fractional parts, and modular arithmetic.",
      order: 0,
    },
    {
      slug: "fractions-decimals-approximations-percentages",
      name: "Fractions, Decimals, Approximations and Percentages",
      description:
        "Fractions, decimals, significant figures, decimal places, percentage errors, simple interest, profit and loss, ratio, proportion, rates, shares and VAT.",
      order: 1,
    },
    {
      slug: "indices-logarithms-surds",
      name: "Indices, Logarithms and Surds",
      description:
        "Laws of indices, equations involving indices, standard form, logarithms, change of base, relationships between indices and logarithms, and surds.",
      order: 2,
    },
    {
      slug: "sets",
      name: "Sets",
      description:
        "Types of sets, algebra of sets, cardinality, set notation and Venn diagrams.",
      order: 3,
    },
    {
      slug: "polynomials",
      name: "Polynomials",
      description:
        "Change of subject of formula, polynomial operations, factorisation, roots, factor and remainder theorems, simultaneous equations and polynomial graphs.",
      order: 4,
    },
    {
      slug: "variation",
      name: "Variation",
      description:
        "Direct, inverse, joint and partial variation, including percentage increase and decrease.",
      order: 5,
    },
    {
      slug: "inequalities",
      name: "Inequalities",
      description:
        "Analytical and graphical solutions of linear inequalities and quadratic inequalities with integral roots.",
      order: 6,
    },
    {
      slug: "progression",
      name: "Progression",
      description:
        "Nth term of a progression, arithmetic progression, geometric progression and sums including sum to infinity.",
      order: 7,
    },
    {
      slug: "binary-operations",
      name: "Binary Operations",
      description:
        "Closure, commutativity, associativity, distributivity, identity and inverse elements.",
      order: 8,
    },
    {
      slug: "matrices-and-determinants",
      name: "Matrices and Determinants",
      description:
        "Algebra of matrices up to 3 × 3, determinants up to 3 × 3 and inverses of 2 × 2 matrices.",
      order: 9,
    },
    {
      slug: "euclidean-geometry",
      name: "Euclidean Geometry",
      description:
        "Properties of angles and lines, polygons, circles, cyclic quadrilaterals, intersecting chords and geometric construction.",
      order: 10,
    },
    {
      slug: "mensuration",
      name: "Mensuration",
      description:
        "Lengths, areas, arcs, chords, sectors, segments, surface areas, volumes, composite figures, longitudes and latitudes.",
      order: 11,
    },
    {
      slug: "loci",
      name: "Loci",
      description:
        "Loci in two dimensions based on geometric principles involving lines and curves.",
      order: 12,
    },
    {
      slug: "coordinate-geometry",
      name: "Coordinate Geometry",
      description:
        "Midpoint, gradient, distance between points, parallel and perpendicular lines, and equations of straight lines.",
      order: 13,
    },
    {
      slug: "trigonometry",
      name: "Trigonometry",
      description:
        "Trigonometric ratios, special angles, elevation and depression, bearings, triangle areas, sine and cosine graphs, and sine and cosine formulae.",
      order: 14,
    },
    {
      slug: "differentiation",
      name: "Differentiation",
      description:
        "Limits of functions and differentiation of explicit algebraic and simple trigonometric functions.",
      order: 15,
    },
    {
      slug: "application-of-differentiation",
      name: "Application of Differentiation",
      description:
        "Applications of differentiation involving rate of change, maxima and minima.",
      order: 16,
    },
    {
      slug: "integration",
      name: "Integration",
      description:
        "Integration of explicit algebraic and simple trigonometric functions and area under the curve.",
      order: 17,
    },
    {
      slug: "representation-of-data",
      name: "Representation of Data",
      description:
        "Frequency distributions, histograms, bar charts and pie charts.",
      order: 18,
    },
    {
      slug: "measures-of-location",
      name: "Measures of Location",
      description:
        "Mean, mode and median of grouped and ungrouped data, cumulative frequency, quartiles and percentiles.",
      order: 19,
    },
    {
      slug: "measures-of-dispersion",
      name: "Measures of Dispersion",
      description:
        "Range, mean deviation, variance and standard deviation for grouped and ungrouped data.",
      order: 20,
    },
    {
      slug: "permutation-and-combination",
      name: "Permutation and Combination",
      description:
        "Linear and circular arrangements and arrangements involving repeated objects.",
      order: 21,
    },
    {
      slug: "probability",
      name: "Probability",
      description:
        "Experimental probability and addition and multiplication of probabilities for mutual and independent cases.",
      order: 22,
    },
  ];

  const mathematicsTopicRecords = new Map<
    string,
    Awaited<ReturnType<typeof prisma.topic.upsert>>
  >();

  for (const topic of mathematicsTopics) {
    const record = await prisma.topic.upsert({
      where: {
        subjectId_slug: {
          subjectId: mathematics.id,
          slug: topic.slug,
        },
      },
      create: {
        subjectId: mathematics.id,
        slug: topic.slug,
        name: topic.name,
        description: topic.description,
        order: topic.order,
      },
      update: {
        name: topic.name,
        description: topic.description,
        order: topic.order,
      },
    });

    mathematicsTopicRecords.set(topic.slug, record);
  }

  const numberBases = mathematicsTopicRecords.get(
    "number-bases-modular-arithmetic",
  )!;

  const fractionsDecimalsPercentages = mathematicsTopicRecords.get(
    "fractions-decimals-approximations-percentages",
  )!;

  const indicesLogarithmsSurds = mathematicsTopicRecords.get(
    "indices-logarithms-surds",
  )!;

  const sets = mathematicsTopicRecords.get("sets")!;

  const polynomials = mathematicsTopicRecords.get("polynomials")!;

  const variation = mathematicsTopicRecords.get("variation")!;

  const inequalities = mathematicsTopicRecords.get("inequalities")!;

  const progression = mathematicsTopicRecords.get("progression")!;

  const binaryOperations = mathematicsTopicRecords.get("binary-operations")!;

  const matricesAndDeterminants = mathematicsTopicRecords.get(
    "matrices-and-determinants",
  )!;

  const euclideanGeometry = mathematicsTopicRecords.get(
    "euclidean-geometry",
  )!;

  const mensuration = mathematicsTopicRecords.get("mensuration")!;

  const loci = mathematicsTopicRecords.get("loci")!;

  const coordinateGeometry = mathematicsTopicRecords.get(
    "coordinate-geometry",
  )!;

  const trigonometry = mathematicsTopicRecords.get("trigonometry")!;

  const differentiation = mathematicsTopicRecords.get("differentiation")!;

  const applicationOfDifferentiation = mathematicsTopicRecords.get(
    "application-of-differentiation",
  )!;

  const integration = mathematicsTopicRecords.get("integration")!;

  const representationOfData = mathematicsTopicRecords.get(
    "representation-of-data",
  )!;

  const measuresOfLocation = mathematicsTopicRecords.get(
    "measures-of-location",
  )!;

  const measuresOfDispersion = mathematicsTopicRecords.get(
    "measures-of-dispersion",
  )!;

  const permutationAndCombination = mathematicsTopicRecords.get(
    "permutation-and-combination",
  )!;

  const probability = mathematicsTopicRecords.get("probability")!;

  void fractionsDecimalsPercentages;
  void indicesLogarithmsSurds;
  void sets;
  void variation;
  void inequalities;
  void progression;
  void binaryOperations;
  void matricesAndDeterminants;
  void euclideanGeometry;
  void mensuration;
  void loci;
  void coordinateGeometry;
  void trigonometry;
  void differentiation;
  void applicationOfDifferentiation;
  void integration;
  void representationOfData;
  void measuresOfLocation;
  void measuresOfDispersion;
  void permutationAndCombination;
  void probability;

  // ---------------------------------------------------------------------------
  // MIGRATE THE OLD FOUR-TOPIC STRUCTURE
  //
  // Previous versions of the seed created:
  // - foundations
  // - linear-equations
  // - quadratics
  // - functions
  //
  // We now use the official JAMB topic structure.
  //
  // Existing lessons/questions from Linear Equations and Quadratics are moved
  // into Polynomials before the obsolete topics are removed.
  // ---------------------------------------------------------------------------

  const oldLinearEquations = await prisma.topic.findFirst({
    where: {
      subjectId: mathematics.id,
      slug: "linear-equations",
    },
  });

  const oldQuadratics = await prisma.topic.findFirst({
    where: {
      subjectId: mathematics.id,
      slug: "quadratics",
    },
  });

  const oldFoundations = await prisma.topic.findFirst({
    where: {
      subjectId: mathematics.id,
      slug: "foundations",
    },
  });

  const oldFunctions = await prisma.topic.findFirst({
    where: {
      subjectId: mathematics.id,
      slug: "functions",
    },
  });

  if (oldLinearEquations && oldLinearEquations.id !== polynomials.id) {
    await prisma.lesson.updateMany({
      where: {
        topicId: oldLinearEquations.id,
      },
      data: {
        topicId: polynomials.id,
      },
    });

    await prisma.question.updateMany({
      where: {
        topicId: oldLinearEquations.id,
      },
      data: {
        topicId: polynomials.id,
      },
    });

    await prisma.topic.delete({
      where: {
        id: oldLinearEquations.id,
      },
    });
  }

  if (oldQuadratics && oldQuadratics.id !== polynomials.id) {
    await prisma.lesson.updateMany({
      where: {
        topicId: oldQuadratics.id,
      },
      data: {
        topicId: polynomials.id,
      },
    });

    await prisma.question.updateMany({
      where: {
        topicId: oldQuadratics.id,
      },
      data: {
        topicId: polynomials.id,
      },
    });

    await prisma.topic.delete({
      where: {
        id: oldQuadratics.id,
      },
    });
  }

  if (oldFoundations && oldFoundations.id !== polynomials.id) {
    await prisma.lesson.updateMany({
      where: {
        topicId: oldFoundations.id,
      },
      data: {
        topicId: numberBases.id,
      },
    });

    await prisma.question.updateMany({
      where: {
        topicId: oldFoundations.id,
      },
      data: {
        topicId: numberBases.id,
      },
    });

    await prisma.topic.delete({
      where: {
        id: oldFoundations.id,
      },
    });
  }

  if (oldFunctions && oldFunctions.id !== polynomials.id) {
    await prisma.lesson.updateMany({
      where: {
        topicId: oldFunctions.id,
      },
      data: {
        topicId: polynomials.id,
      },
    });

    await prisma.question.updateMany({
      where: {
        topicId: oldFunctions.id,
      },
      data: {
        topicId: polynomials.id,
      },
    });

    await prisma.topic.delete({
      where: {
        id: oldFunctions.id,
      },
    });
  }

  // ---------------------------------------------------------------------------
  // NUMBER BASES — FIRST PLAYABLE LESSON
  // ---------------------------------------------------------------------------

  const numberBasesLesson = await getOrCreateLesson({
    topicId: numberBases.id,
    title: "Introduction to Number Bases",
    order: 0,
    estimatedMinutes: 8,
    content: JSON.stringify([
      {
        type: "intro",
        text:
          "A number base tells us how many symbols are available before we carry to the next place value.",
      },
      {
        type: "concept",
        text:
          "In base 10 we use digits 0 to 9. In base 2 we use only 0 and 1. The same place-value idea works across different bases.",
      },
      {
        type: "example",
        text:
          "The binary number 101₂ means 1×2² + 0×2¹ + 1×2⁰ = 5₁₀.",
      },
    ]),
  });

  await getOrCreateQuestion({
    topicId: numberBases.id,
    lessonId: numberBasesLesson.id,
    type: "MULTIPLE_CHOICE",
    prompt: "Convert 101₂ to base 10.",
    difficulty: "EASY",
    explanation:
      "101₂ = (1 × 2²) + (0 × 2¹) + (1 × 2⁰) = 4 + 0 + 1 = 5.",
    options: [
      {
        text: "5",
        isCorrect: true,
        order: 0,
      },
      {
        text: "4",
        isCorrect: false,
        order: 1,
      },
      {
        text: "3",
        isCorrect: false,
        order: 2,
      },
      {
        text: "6",
        isCorrect: false,
        order: 3,
      },
    ],
  });

  await getOrCreateQuestion({
    topicId: numberBases.id,
    lessonId: numberBasesLesson.id,
    type: "MULTIPLE_CHOICE",
    prompt: "What is 12₁₀ in base 2?",
    difficulty: "EASY",
    explanation:
      "12 divided by 2 gives remainders 0, 0, 1, 1 when read from bottom to top, giving 1100₂.",
    options: [
      {
        text: "1100₂",
        isCorrect: true,
        order: 0,
      },
      {
        text: "1010₂",
        isCorrect: false,
        order: 1,
      },
      {
        text: "1110₂",
        isCorrect: false,
        order: 2,
      },
      {
        text: "1001₂",
        isCorrect: false,
        order: 3,
      },
    ],
  });

  // ---------------------------------------------------------------------------
  // POLYNOMIALS — EXISTING ALGEBRA CONTENT MOVED TO OFFICIAL TOPIC
  // ---------------------------------------------------------------------------

  const polynomialLesson1 = await getOrCreateLesson({
    topicId: polynomials.id,
    title: "Solving Linear Equations",
    order: 0,
    estimatedMinutes: 6,
    content: JSON.stringify([
      {
        type: "intro",
        text:
          "A linear equation is an equation in which the highest power of the variable is 1.",
      },
      {
        type: "concept",
        text:
          "Treat an equation like a balance. Whatever operation you perform on one side must also be performed on the other side.",
      },
      {
        type: "example",
        text:
          "2x + 3 = 11 → subtract 3 from both sides → 2x = 8 → divide by 2 → x = 4.",
      },
    ]),
  });

  const polynomialLesson2 = await getOrCreateLesson({
    topicId: polynomials.id,
    title: "Solving Equations with Fractions",
    order: 1,
    estimatedMinutes: 8,
    content: JSON.stringify([
      {
        type: "intro",
        text:
          "Fractions in equations can be removed by multiplying every term by the appropriate denominator.",
      },
      {
        type: "concept",
        text:
          "Clear the denominators first, then solve the resulting equation normally.",
      },
      {
        type: "example",
        text:
          "x/3 + 2 = 5 → multiply by 3 → x + 6 = 15 → x = 9.",
      },
    ]),
  });

  await getOrCreateQuestion({
    topicId: polynomials.id,
    lessonId: polynomialLesson1.id,
    type: "MULTIPLE_CHOICE",
    prompt: "Solve for x: 2x + 3 = 11",
    difficulty: "EASY",
    explanation:
      "Subtract 3 from both sides to get 2x = 8, then divide by 2 to get x = 4.",
    options: [
      {
        text: "x = 4",
        isCorrect: true,
        order: 0,
      },
      {
        text: "x = 7",
        isCorrect: false,
        order: 1,
      },
      {
        text: "x = 5.5",
        isCorrect: false,
        order: 2,
      },
      {
        text: "x = 14",
        isCorrect: false,
        order: 3,
      },
    ],
  });

  await getOrCreateQuestion({
    topicId: polynomials.id,
    lessonId: polynomialLesson1.id,
    type: "MULTIPLE_CHOICE",
    prompt: "Solve for x: 5x - 4 = 16",
    difficulty: "EASY",
    explanation:
      "Add 4 to both sides to get 5x = 20, then divide by 5 to get x = 4.",
    options: [
      {
        text: "x = 4",
        isCorrect: true,
        order: 0,
      },
      {
        text: "x = 3",
        isCorrect: false,
        order: 1,
      },
      {
        text: "x = 20",
        isCorrect: false,
        order: 2,
      },
      {
        text: "x = 2.4",
        isCorrect: false,
        order: 3,
      },
    ],
  });

  await getOrCreateQuestion({
    topicId: polynomials.id,
    lessonId: polynomialLesson2.id,
    type: "MULTIPLE_CHOICE",
    prompt: "Solve for x: x/3 + 2 = 5",
    difficulty: "MEDIUM",
    explanation:
      "Multiply every term by 3 to clear the fraction: x + 6 = 15, so x = 9.",
    options: [
      {
        text: "x = 9",
        isCorrect: true,
        order: 0,
      },
      {
        text: "x = 15",
        isCorrect: false,
        order: 1,
      },
      {
        text: "x = 1",
        isCorrect: false,
        order: 2,
      },
      {
        text: "x = 21",
        isCorrect: false,
        order: 3,
      },
    ],
  });

  await getOrCreateQuestion({
    topicId: polynomials.id,
    lessonId: polynomialLesson2.id,
    type: "MULTIPLE_CHOICE",
    prompt: "Solve for x: (x + 1)/2 = 4",
    difficulty: "MEDIUM",
    explanation:
      "Multiply both sides by 2: x + 1 = 8, so x = 7.",
    options: [
      {
        text: "x = 7",
        isCorrect: true,
        order: 0,
      },
      {
        text: "x = 9",
        isCorrect: false,
        order: 1,
      },
      {
        text: "x = 8",
        isCorrect: false,
        order: 2,
      },
      {
        text: "x = 3.5",
        isCorrect: false,
        order: 3,
      },
    ],
  });

  await getOrCreateQuestion({
    topicId: polynomials.id,
    type: "MULTIPLE_CHOICE",
    prompt: "A number increased by 7 gives 20. What is the number?",
    difficulty: "EASY",
    explanation:
      "Let the number be x. Then x + 7 = 20, so x = 13.",
    options: [
      {
        text: "13",
        isCorrect: true,
        order: 0,
      },
      {
        text: "27",
        isCorrect: false,
        order: 1,
      },
      {
        text: "14",
        isCorrect: false,
        order: 2,
      },
      {
        text: "7",
        isCorrect: false,
        order: 3,
      },
    ],
  });

  await getOrCreateQuestion({
    topicId: polynomials.id,
    type: "MULTIPLE_CHOICE",
    prompt: "Factorise: x² + 5x + 6",
    difficulty: "MEDIUM",
    explanation:
      "Find two numbers that multiply to 6 and add to 5. They are 2 and 3, so the factorisation is (x + 2)(x + 3).",
    options: [
      {
        text: "(x + 2)(x + 3)",
        isCorrect: true,
        order: 0,
      },
      {
        text: "(x + 1)(x + 6)",
        isCorrect: false,
        order: 1,
      },
      {
        text: "(x - 2)(x - 3)",
        isCorrect: false,
        order: 2,
      },
      {
        text: "(x + 5)(x + 1)",
        isCorrect: false,
        order: 3,
      },
    ],
  });

  await getOrCreateQuestion({
    topicId: polynomials.id,
    type: "MULTIPLE_CHOICE",
    prompt: "Solve: x² - 9 = 0",
    difficulty: "EASY",
    explanation:
      "x² = 9, therefore x = 3 or x = -3.",
    options: [
      {
        text: "x = 3 or x = -3",
        isCorrect: true,
        order: 0,
      },
      {
        text: "x = 9",
        isCorrect: false,
        order: 1,
      },
      {
        text: "x = 3 only",
        isCorrect: false,
        order: 2,
      },
      {
        text: "x = -9",
        isCorrect: false,
        order: 3,
      },
    ],
  });

  // ---------------------------------------------------------------------------
  // JAMB CORE CONTENT

  await seedJambCoreContent(prisma, jamb.id);

  await seedSsceIeltsCoreContent(
  prisma,
  ssce.id,
  ielts.id,
);

  // ---------------------------------------------------------------------------
  // SUMMARY
  // ---------------------------------------------------------------------------

  const mathematicsTopicCount = await prisma.topic.count({
    where: {
      subjectId: mathematics.id,
    },
  });

  const mathematicsLessonCount = await prisma.lesson.count({
    where: {
      topic: {
        subjectId: mathematics.id,
      },
    },
  });

  const mathematicsQuestionCount = await prisma.question.count({
    where: {
      topic: {
        subjectId: mathematics.id,
      },
    },
  });

  const jambTopicCount = await prisma.topic.count({
    where: {
      subject: {
        examId: jamb.id,
      },
    },
  });

  const jambLessonCount = await prisma.lesson.count({
    where: {
      topic: {
        subject: {
          examId: jamb.id,
        },
      },
    },
  });

  const jambQuestionCount = await prisma.question.count({
    where: {
      topic: {
        subject: {
          examId: jamb.id,
        },
      },
    },
  });

  const jambMockCount = await prisma.mockExam.count({
    where: {
      examId: jamb.id,
    },
  });

  console.log("");
  console.log("Seeded system/content data:");
  console.log(`  Exams: 3`);
  console.log(`  Subjects: ${utmeSubjects.length}`);
  console.log(`  JAMB Topics: ${jambTopicCount}`);
  console.log(`  JAMB Lessons: ${jambLessonCount}`);
  console.log(`  JAMB Questions: ${jambQuestionCount}`);
  console.log(`  JAMB Mock Definitions: ${jambMockCount}`);
  console.log(`  Mathematics Topics: ${mathematicsTopicCount}`);
  console.log(`  Mathematics Lessons: ${mathematicsLessonCount}`);
  console.log(`  Mathematics Questions: ${mathematicsQuestionCount}`);
  console.log(
    "  Zero learner/user rows created (per Master Prompt §56-68).",
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });