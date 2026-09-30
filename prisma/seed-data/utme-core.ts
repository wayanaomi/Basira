/**
 * BASIRA — JAMB/UTME CORE CONTENT
 *
 * Educational content only.
 *
 * This file creates:
 * - topics
 * - lessons
 * - original practice questions
 *
 * It NEVER creates:
 * - users
 * - profiles
 * - streaks
 * - XP
 * - achievements earned by users
 * - question attempts
 * - lesson progress
 * - mock attempts
 *
 * Questions in this file are Basira-authored practice questions aligned
 * to the official JAMB syllabus. They are NOT represented as official
 * JAMB past questions.
 */

type SeedQuestion = {
  prompt: string;
  difficulty?: "EASY" | "MEDIUM" | "HARD";
  explanation: string;
  options: Array<{
    text: string;
    isCorrect: boolean;
    order: number;
  }>;
};

type SeedLesson = {
  title: string;
  minutes: number;
  content: string;
  questions?: SeedQuestion[];
};

type SeedTopic = {
  slug: string;
  name: string;
  description: string;
  lessons: SeedLesson[];
};

type SubjectContent = {
  subjectSlug: string;
  topics: SeedTopic[];
};

const q = (
  prompt: string,
  correct: string,
  wrong: string[],
  explanation: string,
  difficulty: SeedQuestion["difficulty"] = "MEDIUM",
): SeedQuestion => ({
  prompt,
  difficulty,
  explanation,
  options: [
    { text: correct, isCorrect: true, order: 0 },
    ...wrong.map((text, index) => ({
      text,
      isCorrect: false,
      order: index + 1,
    })),
  ],
});

/*
|--------------------------------------------------------------------------
| USE OF ENGLISH
|--------------------------------------------------------------------------
|
| JAMB's official syllabus has:
| A. Comprehension/Summary
| B. Lexis and Structure
| C. Oral Forms
|
| Source:
| https://ibass.jamb.gov.ng/assets/uploads/Use-of-English.pdf
|--------------------------------------------------------------------------
*/

const english: SubjectContent = {
  subjectSlug: "english",
  topics: [
    {
      slug: "comprehension-summary",
      name: "Comprehension and Summary",
      description:
        "Understanding passages, implied meaning, deductions, coherence and synthesis.",
      lessons: [
        {
          title: "Finding the Main Idea",
          minutes: 7,
          content: JSON.stringify([
            {
              type: "intro",
              text: "The main idea is the central point the writer wants the reader to understand.",
            },
            {
              type: "concept",
              text: "Look for repeated ideas, topic sentences and the relationship between supporting details.",
            },
          ]),
          questions: [
            q(
              "A paragraph repeatedly explains how regular revision improves recall. What is its most likely main idea?",
              "Regular revision improves memory and recall.",
              [
                "Revision is always difficult.",
                "Students should study only at night.",
                "Memory cannot be improved.",
              ],
              "The repeated relationship between revision and recall identifies the main idea.",
              "EASY",
            ),
            q(
              "If a writer gives a reason that is not directly stated but can be logically inferred, that meaning is described as",
              "implied meaning",
              [
                "literal meaning",
                "dictionary meaning",
                "technical meaning",
              ],
              "An inference is a conclusion reached from information that is suggested rather than directly stated.",
              "EASY",
            ),
            q(
              "Which skill involves combining ideas from different parts of a passage into one coherent conclusion?",
              "Synthesis",
              ["Scanning", "Pronunciation", "Transcription"],
              "Synthesis involves combining separate pieces of information into a complete whole.",
              "MEDIUM",
            ),
          ],
        },
      ],
    },
    {
      slug: "lexis-and-structure",
      name: "Lexis and Structure",
      description:
        "Synonyms, antonyms, sentence patterns, word classes, agreement, tense and usage.",
      lessons: [
        {
          title: "Agreement and Sentence Structure",
          minutes: 8,
          content: JSON.stringify([
            {
              type: "intro",
              text: "Subject-verb agreement means that the verb must agree with its subject in number and person.",
            },
            {
              type: "example",
              text: "The student studies every day. The students study every day.",
            },
          ]),
          questions: [
            q(
              "Choose the correct option: The list of candidates ___ on the table.",
              "is",
              ["are", "were", "have"],
              "The subject is 'list', which is singular.",
              "EASY",
            ),
            q(
              "Choose the word closest in meaning to 'abundant'.",
              "Plentiful",
              ["Scarce", "Tiny", "Weak"],
              "Abundant means existing in large quantities; plentiful has the same meaning.",
              "EASY",
            ),
            q(
              "Choose the word opposite in meaning to 'hostile'.",
              "Friendly",
              ["Angry", "Aggressive", "Violent"],
              "Hostile means unfriendly or antagonistic; friendly is its opposite.",
              "EASY",
            ),
          ],
        },
      ],
    },
    {
      slug: "oral-forms",
      name: "Oral Forms",
      description:
        "Vowels, consonants, rhymes, homophones, stress and intonation.",
      lessons: [
        {
          title: "Vowels and Word Stress",
          minutes: 7,
          content: JSON.stringify([
            {
              type: "intro",
              text: "Oral English questions test how sounds are produced and distinguished.",
            },
          ]),
          questions: [
            q(
              "Words that sound alike but have different meanings and spellings are called",
              "homophones",
              ["synonyms", "antonyms", "homographs"],
              "Homophones have the same pronunciation but different meanings or spellings.",
              "EASY",
            ),
            q(
              "The emphasis placed on a particular syllable of a word is called",
              "word stress",
              ["intonation", "rhythm", "punctuation"],
              "Word stress is the emphasis placed on a syllable within a word.",
              "EASY",
            ),
          ],
        },
      ],
    },
  ],
};

/*
|--------------------------------------------------------------------------
| CHEMISTRY
|--------------------------------------------------------------------------
|
| Based on the JAMB Chemistry syllabus.
| Source:
| https://ibass.jamb.gov.ng/assets/uploads/Chemistry.pdf
|--------------------------------------------------------------------------
*/

const chemistry: SubjectContent = {
  subjectSlug: "chemistry",
  topics: [
    {
      slug: "separation-and-purification",
      name: "Separation and Purification",
      description:
        "Mixtures, pure substances and methods used to separate components.",
      lessons: [
        {
          title: "Methods of Separation",
          minutes: 8,
          content: JSON.stringify([
            {
              type: "intro",
              text: "Different separation methods depend on differences in physical properties.",
            },
          ]),
          questions: [
            q(
              "Which method is most suitable for separating sand from water?",
              "Filtration",
              ["Distillation", "Sublimation", "Chromatography"],
              "Sand is insoluble in water, so filtration separates the solid from the liquid.",
              "EASY",
            ),
            q(
              "Which technique is commonly used to separate coloured substances in a mixture?",
              "Chromatography",
              ["Magnetization", "Decantation", "Evaporation"],
              "Chromatography separates substances based on differences in their movement through a medium.",
              "EASY",
            ),
          ],
        },
      ],
    },
    {
      slug: "chemical-combination",
      name: "Chemical Combination",
      description:
        "Chemical formulae, equations, stoichiometry, mole concept and chemical laws.",
      lessons: [
        {
          title: "The Mole Concept",
          minutes: 9,
          content: JSON.stringify([
            {
              type: "intro",
              text: "A mole represents a fixed number of particles: approximately 6.02 × 10²³.",
            },
          ]),
          questions: [
            q(
              "One mole of a substance contains approximately",
              "6.02 × 10²³ particles",
              ["6.02 × 10² particles", "3.01 × 10²³ particles", "9.81 × 10²³ particles"],
              "Avogadro's constant is approximately 6.02 × 10²³ particles per mole.",
              "EASY",
            ),
            q(
              "What is the relative molecular mass of H₂O? (H = 1, O = 16)",
              "18",
              ["16", "17", "20"],
              "H₂O = (2 × 1) + 16 = 18.",
              "EASY",
            ),
          ],
        },
      ],
    },
    {
      slug: "atomic-structure",
      name: "Atomic Structure",
      description:
        "Atoms, subatomic particles, electronic configuration and isotopes.",
      lessons: [
        {
          title: "Subatomic Particles",
          minutes: 7,
          content: JSON.stringify([
            {
              type: "intro",
              text: "Atoms contain protons, neutrons and electrons.",
            },
          ]),
          questions: [
            q(
              "Which subatomic particle carries a negative charge?",
              "Electron",
              ["Proton", "Neutron", "Nucleus"],
              "Electrons carry negative charge, while protons are positive and neutrons are neutral.",
              "EASY",
            ),
            q(
              "Atoms of the same element with different numbers of neutrons are called",
              "isotopes",
              ["ions", "isomers", "allotropes"],
              "Isotopes have the same atomic number but different mass numbers.",
              "EASY",
            ),
          ],
        },
      ],
    },
  ],
};

/*
|--------------------------------------------------------------------------
| PHYSICS
|--------------------------------------------------------------------------
|
| Based on the official JAMB Physics syllabus.
| Source:
| https://ibass.jamb.gov.ng/assets/uploads/Physics.pdf
|--------------------------------------------------------------------------
*/

const physics: SubjectContent = {
  subjectSlug: "physics",
  topics: [
    {
      slug: "measurement-and-units",
      name: "Measurement and Units",
      description:
        "Physical quantities, units, dimensions, measurement and experimental errors.",
      lessons: [
        {
          title: "Physical Quantities and Units",
          minutes: 7,
          content: JSON.stringify([
            {
              type: "intro",
              text: "Physics uses measurable quantities and standardized units to describe physical phenomena.",
            },
          ]),
          questions: [
            q(
              "Which of the following is an SI base quantity?",
              "Length",
              ["Speed", "Force", "Density"],
              "Length is one of the SI base quantities.",
              "EASY",
            ),
            q(
              "What is the SI unit of mass?",
              "kilogram",
              ["gram", "newton", "joule"],
              "The SI base unit of mass is the kilogram.",
              "EASY",
            ),
          ],
        },
      ],
    },
    {
      slug: "scalars-and-vectors",
      name: "Scalars and Vectors",
      description:
        "Scalar quantities, vector quantities, direction and resultant vectors.",
      lessons: [
        {
          title: "Scalar versus Vector",
          minutes: 7,
          content: JSON.stringify([
            {
              type: "intro",
              text: "A scalar has magnitude only. A vector has both magnitude and direction.",
            },
          ]),
          questions: [
            q(
              "Which of the following is a vector quantity?",
              "Velocity",
              ["Mass", "Temperature", "Time"],
              "Velocity has both magnitude and direction.",
              "EASY",
            ),
            q(
              "Which quantity has magnitude but no direction?",
              "Speed",
              ["Velocity", "Displacement", "Acceleration"],
              "Speed is scalar; velocity, displacement and acceleration are vectors.",
              "EASY",
            ),
          ],
        },
      ],
    },
    {
      slug: "motion",
      name: "Motion",
      description:
        "Distance, displacement, speed, velocity and acceleration.",
      lessons: [
        {
          title: "Speed and Velocity",
          minutes: 8,
          content: JSON.stringify([
            {
              type: "intro",
              text: "Speed describes how quickly distance is covered, while velocity includes direction.",
            },
          ]),
          questions: [
            q(
              "A car travels 120 km in 2 hours. What is its average speed?",
              "60 km/h",
              ["30 km/h", "120 km/h", "240 km/h"],
              "Average speed = distance ÷ time = 120 ÷ 2 = 60 km/h.",
              "EASY",
            ),
            q(
              "Acceleration is defined as the rate of change of",
              "velocity",
              ["distance", "mass", "force"],
              "Acceleration measures how quickly velocity changes with time.",
              "EASY",
            ),
          ],
        },
      ],
    },
  ],
};

/*
|--------------------------------------------------------------------------
| BIOLOGY
|--------------------------------------------------------------------------
|
| Based on the JAMB Biology syllabus.
|--------------------------------------------------------------------------
*/

const biology: SubjectContent = {
  subjectSlug: "biology",
  topics: [
    {
      slug: "living-organisms",
      name: "Living Organisms",
      description:
        "Characteristics of living things, cell structure and levels of organization.",
      lessons: [
        {
          title: "Characteristics of Life",
          minutes: 7,
          content: JSON.stringify([
            {
              type: "intro",
              text: "Living organisms display characteristics such as nutrition, respiration, growth and reproduction.",
            },
          ]),
          questions: [
            q(
              "Which process enables organisms to produce offspring?",
              "Reproduction",
              ["Respiration", "Excretion", "Nutrition"],
              "Reproduction is the biological process by which organisms produce new individuals.",
              "EASY",
            ),
            q(
              "Which organelle is primarily responsible for energy release in aerobic respiration?",
              "Mitochondrion",
              ["Ribosome", "Nucleus", "Vacuole"],
              "Mitochondria are the main sites of aerobic respiration in cells.",
              "EASY",
            ),
          ],
        },
      ],
    },
    {
      slug: "cell-structure",
      name: "Cell Structure and Functions",
      description:
        "Plant and animal cells and the functions of their components.",
      lessons: [
        {
          title: "Plant and Animal Cells",
          minutes: 8,
          content: JSON.stringify([
            {
              type: "intro",
              text: "Plant and animal cells share many structures, but plant cells possess additional structures such as cell walls and chloroplasts.",
            },
          ]),
          questions: [
            q(
              "Which structure is present in plant cells but absent from animal cells?",
              "Cell wall",
              ["Cell membrane", "Cytoplasm", "Nucleus"],
              "Plant cells have a cellulose cell wall in addition to the cell membrane.",
              "EASY",
            ),
            q(
              "Which organelle contains chlorophyll?",
              "Chloroplast",
              ["Mitochondrion", "Ribosome", "Golgi body"],
              "Chlorophyll is located in chloroplasts and absorbs light for photosynthesis.",
              "EASY",
            ),
          ],
        },
      ],
    },
    {
      slug: "genetics",
      name: "Genetics and Heredity",
      description:
        "Inheritance, variation, genes and transmission of characteristics.",
      lessons: [
        {
          title: "Genes and Inheritance",
          minutes: 8,
          content: JSON.stringify([
            {
              type: "intro",
              text: "Genes are units of heredity that influence inherited characteristics.",
            },
          ]),
          questions: [
            q(
              "The basic unit of heredity is the",
              "gene",
              ["cell", "tissue", "organ"],
              "A gene is a segment of DNA that carries hereditary information.",
              "EASY",
            ),
            q(
              "Alternative forms of the same gene are called",
              "alleles",
              ["gametes", "chromosomes", "enzymes"],
              "Alleles are alternative forms of a gene.",
              "EASY",
            ),
          ],
        },
      ],
    },
  ],
};

/*
|--------------------------------------------------------------------------
| GOVERNMENT
|--------------------------------------------------------------------------
|
| Based on the official JAMB Government syllabus.
|--------------------------------------------------------------------------
*/

const government: SubjectContent = {
  subjectSlug: "government",
  topics: [
    {
      slug: "basic-concepts",
      name: "Basic Concepts in Government",
      description:
        "Power, authority, legitimacy, sovereignty, state, nation and political processes.",
      lessons: [
        {
          title: "Power, Authority and Legitimacy",
          minutes: 8,
          content: JSON.stringify([
            {
              type: "intro",
              text: "Government examines how political authority is organized and exercised.",
            },
          ]),
          questions: [
            q(
              "The recognized right to exercise power is known as",
              "authority",
              ["coercion", "propaganda", "opposition"],
              "Authority is legitimate or recognized power.",
              "EASY",
            ),
            q(
              "The supreme power of a state over its internal affairs is called",
              "sovereignty",
              ["federalism", "citizenship", "bureaucracy"],
              "Sovereignty refers to the supreme authority of the state.",
              "EASY",
            ),
          ],
        },
      ],
    },
    {
      slug: "forms-of-government",
      name: "Forms of Government",
      description:
        "Monarchy, aristocracy, oligarchy, autocracy, republicanism and democracy.",
      lessons: [
        {
          title: "Democracy and Monarchy",
          minutes: 8,
          content: JSON.stringify([
            {
              type: "intro",
              text: "Different forms of government distribute political authority in different ways.",
            },
          ]),
          questions: [
            q(
              "A government in which political power is exercised by the people directly or through representatives is",
              "democracy",
              ["autocracy", "oligarchy", "monarchy"],
              "Democracy is government by the people, directly or through elected representatives.",
              "EASY",
            ),
            q(
              "Government by a small group of people is known as",
              "oligarchy",
              ["democracy", "monarchy", "federalism"],
              "Oligarchy is government by a small group.",
              "EASY",
            ),
          ],
        },
      ],
    },
    {
      slug: "arms-of-government",
      name: "Arms of Government",
      description:
        "Legislature, executive and judiciary and their relationships.",
      lessons: [
        {
          title: "The Three Arms",
          minutes: 8,
          content: JSON.stringify([
            {
              type: "intro",
              text: "The legislature makes laws, the executive implements them and the judiciary interprets them.",
            },
          ]),
          questions: [
            q(
              "Which arm of government is primarily responsible for making laws?",
              "Legislature",
              ["Executive", "Judiciary", "Civil service"],
              "The legislature is the law-making arm of government.",
              "EASY",
            ),
            q(
              "Which arm interprets the law?",
              "Judiciary",
              ["Legislature", "Executive", "Electoral commission"],
              "The judiciary interprets laws and adjudicates disputes.",
              "EASY",
            ),
          ],
        },
      ],
    },
  ],
};

/*
|--------------------------------------------------------------------------
| LITERATURE-IN-ENGLISH
|--------------------------------------------------------------------------
*/

const literature: SubjectContent = {
  subjectSlug: "literature-in-english",
  topics: [
    {
      slug: "drama",
      name: "Drama",
      description:
        "Types of drama, dramatic techniques, characterization, dialogue, plot and setting.",
      lessons: [
        {
          title: "Dramatic Techniques",
          minutes: 8,
          content: JSON.stringify([
            {
              type: "intro",
              text: "Drama communicates a story through performance, dialogue and dramatic action.",
            },
          ]),
          questions: [
            q(
              "A speech delivered by a character who is alone on stage and reveals private thoughts is a",
              "soliloquy",
              ["dialogue", "aside", "prologue"],
              "A soliloquy presents a character's thoughts aloud while the character is alone.",
              "EASY",
            ),
            q(
              "A brief remark made by a character that other characters are conventionally not meant to hear is an",
              "aside",
              ["epilogue", "flashback", "chorus"],
              "An aside is addressed to the audience or spoken privately while other characters are not meant to hear it.",
              "EASY",
            ),
          ],
        },
      ],
    },
    {
      slug: "prose",
      name: "Prose",
      description:
        "Fiction, non-fiction, narrative techniques, characterization, theme and setting.",
      lessons: [
        {
          title: "Narrative Point of View",
          minutes: 8,
          content: JSON.stringify([
            {
              type: "intro",
              text: "Point of view identifies the perspective from which a story is narrated.",
            },
          ]),
          questions: [
            q(
              "A story narrated using 'I' is most commonly written from the",
              "first-person point of view",
              [
                "third-person omniscient point of view",
                "objective point of view",
                "dramatic point of view",
              ],
              "First-person narration uses a narrator who refers to themselves as 'I'.",
              "EASY",
            ),
            q(
              "The central idea explored by a literary work is its",
              "theme",
              ["setting", "plot", "stage direction"],
              "Theme is the central idea or underlying message explored by a literary work.",
              "EASY",
            ),
          ],
        },
      ],
    },
  ],
};

/*
|--------------------------------------------------------------------------
| CHRISTIAN RELIGIOUS STUDIES
|--------------------------------------------------------------------------
*/

const crs: SubjectContent = {
  subjectSlug: "christian-religious-studies",
  topics: [
    {
      slug: "creation-and-covenant",
      name: "Creation and Covenant",
      description:
        "Themes from creation to the division of the kingdom.",
      lessons: [
        {
          title: "The Sovereignty of God",
          minutes: 8,
          content: JSON.stringify([
            {
              type: "intro",
              text: "The CRS syllabus begins with themes concerning God's sovereignty and creation.",
            },
          ]),
          questions: [
            q(
              "The biblical account of creation in Genesis chapters 1 and 2 primarily presents God as",
              "Creator and controller of the universe",
              ["a political ruler", "a military commander", "a human prophet"],
              "The CRS syllabus identifies God's sovereignty as a major theme and presents Him as Creator and Controller of the universe.",
              "EASY",
            ),
            q(
              "The covenant God made with Noah followed the biblical account of the",
              "flood",
              ["Exodus", "division of the kingdom", "Babylonian exile"],
              "Genesis 6–9 records the flood and God's covenant with Noah.",
              "EASY",
            ),
          ],
        },
      ],
    },
    {
      slug: "gospels-and-acts",
      name: "The Gospels and Acts",
      description:
        "Themes from the four Gospels and Acts of the Apostles.",
      lessons: [
        {
          title: "The Mission to the Gentiles",
          minutes: 8,
          content: JSON.stringify([
            {
              type: "intro",
              text: "Acts records the growth of the early Christian community and its mission beyond the Jewish community.",
            },
          ]),
          questions: [
            q(
              "According to Acts, who was converted on the road to Damascus?",
              "Saul",
              ["Peter", "Cornelius", "Stephen"],
              "Acts 9 records Saul's conversion on the road to Damascus.",
              "EASY",
            ),
            q(
              "Cornelius is notable in Acts because his conversion demonstrated the spread of the Gospel to",
              "Gentiles",
              ["Egyptian kings", "Roman senators only", "Babylonian priests"],
              "Acts 10 records Cornelius, a Gentile, becoming a believer.",
              "EASY",
            ),
          ],
        },
      ],
    },
  ],
};

export const JAMB_CORE_CONTENT: SubjectContent[] = [
  english,
  chemistry,
  physics,
  biology,
  government,
  literature,
  crs,
];

async function getOrCreateTopic(prisma: any, subjectId: string, topic: SeedTopic, order: number) {
  return prisma.topic.upsert({
    where: {
      subjectId_slug: {
        subjectId,
        slug: topic.slug,
      },
    },
    create: {
      subjectId,
      slug: topic.slug,
      name: topic.name,
      description: topic.description,
      order,
    },
    update: {
      name: topic.name,
      description: topic.description,
      order,
    },
  });
}

async function getOrCreateLesson(
  prisma: any,
  topicId: string,
  lesson: SeedLesson,
  order: number,
) {
  const existing = await prisma.lesson.findFirst({
    where: {
      topicId,
      title: lesson.title,
    },
  });

  if (existing) {
    return prisma.lesson.update({
      where: { id: existing.id },
      data: {
        order,
        estimatedMinutes: lesson.minutes,
        content: lesson.content,
        isPublished: true,
      },
    });
  }

  return prisma.lesson.create({
    data: {
      topicId,
      title: lesson.title,
      order,
      estimatedMinutes: lesson.minutes,
      content: lesson.content,
      isPublished: true,
    },
  });
}

async function getOrCreateQuestion(
  prisma: any,
  topicId: string,
  lessonId: string,
  question: SeedQuestion,
) {
  const existing = await prisma.question.findFirst({
    where: {
      topicId,
      prompt: question.prompt,
    },
  });

  if (existing) {
    await prisma.questionOption.deleteMany({
      where: { questionId: existing.id },
    });

    return prisma.question.update({
      where: { id: existing.id },
      data: {
        lessonId,
        type: "MULTIPLE_CHOICE",
        difficulty: question.difficulty ?? "MEDIUM",
        explanation: question.explanation,
        source: "Basira syllabus-aligned practice",
        isPublished: true,
        options: {
          create: question.options,
        },
      },
    });
  }

  return prisma.question.create({
    data: {
      topicId,
      lessonId,
      type: "MULTIPLE_CHOICE",
      prompt: question.prompt,
      difficulty: question.difficulty ?? "MEDIUM",
      explanation: question.explanation,
      source: "Basira syllabus-aligned practice",
      isPublished: true,
      options: {
        create: question.options,
      },
    },
  });
}

export async function seedJambCoreContent(
  prisma: any,
  jambId: string,
) {
  let topicCount = 0;
  let lessonCount = 0;
  let questionCount = 0;

  for (const subjectContent of JAMB_CORE_CONTENT) {
    const subject = await prisma.subject.findUnique({
      where: {
        examId_slug: {
          examId: jambId,
          slug: subjectContent.subjectSlug,
        },
      },
    });

    if (!subject) {
      console.warn(
        `Skipping ${subjectContent.subjectSlug}: subject does not exist.`,
      );
      continue;
    }

    for (const [topicIndex, topicData] of subjectContent.topics.entries()) {
      const topic = await getOrCreateTopic(
        prisma,
        subject.id,
        topicData,
        topicIndex,
      );

      topicCount++;

      for (const [lessonIndex, lessonData] of topicData.lessons.entries()) {
        const lesson = await getOrCreateLesson(
          prisma,
          topic.id,
          lessonData,
          lessonIndex,
        );

        lessonCount++;

        for (const question of lessonData.questions ?? []) {
          await getOrCreateQuestion(
            prisma,
            topic.id,
            lesson.id,
            question,
          );

          questionCount++;
        }
      }
    }
  }

  console.log("JAMB core content seeded:");
  console.log(`  Added/updated topics: ${topicCount}`);
  console.log(`  Added/updated lessons: ${lessonCount}`);
  console.log(`  Added/updated questions: ${questionCount}`);
}