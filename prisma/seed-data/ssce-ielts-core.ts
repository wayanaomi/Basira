import type { PrismaClient } from "@prisma/client";

type SeedClient = PrismaClient;

type LessonData = {
  title: string;
  order: number;
  estimatedMinutes: number;
  content: Array<{
    type: "intro" | "concept" | "example" | "tip";
    text: string;
  }>;
};

type QuestionData = {
  prompt: string;
  difficulty?: "EASY" | "MEDIUM" | "HARD";
  explanation: string;
  options: Array<{
    text: string;
    isCorrect: boolean;
    order: number;
  }>;
};

async function upsertTopic(
  prisma: SeedClient,
  subjectId: string,
  data: {
    slug: string;
    name: string;
    description: string;
    order: number;
  },
) {
  return prisma.topic.upsert({
    where: {
      subjectId_slug: {
        subjectId,
        slug: data.slug,
      },
    },
    create: {
      subjectId,
      slug: data.slug,
      name: data.name,
      description: data.description,
      order: data.order,
    },
    update: {
      name: data.name,
      description: data.description,
      order: data.order,
    },
  });
}

async function upsertLesson(
  prisma: SeedClient,
  topicId: string,
  data: LessonData,
) {
  const existing = await prisma.lesson.findFirst({
    where: {
      topicId,
      title: data.title,
    },
  });

  const content = JSON.stringify(data.content);

  if (existing) {
    return prisma.lesson.update({
      where: {
        id: existing.id,
      },
      data: {
        order: data.order,
        estimatedMinutes: data.estimatedMinutes,
        content,
        isPublished: true,
      },
    });
  }

  return prisma.lesson.create({
    data: {
      topicId,
      title: data.title,
      order: data.order,
      estimatedMinutes: data.estimatedMinutes,
      content,
      isPublished: true,
    },
  });
}

async function upsertQuestion(
  prisma: SeedClient,
  topicId: string,
  lessonId: string,
  data: QuestionData,
) {
  const existing = await prisma.question.findFirst({
    where: {
      topicId,
      prompt: data.prompt,
    },
  });

  const questionData = {
    lessonId,
    type: "MULTIPLE_CHOICE",
    difficulty: data.difficulty ?? "MEDIUM",
    explanation: data.explanation,
    isPublished: true,
  };

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
        ...questionData,
        options: {
          create: data.options,
        },
      },
    });
  }

  return prisma.question.create({
    data: {
      topicId,
      prompt: data.prompt,
      ...questionData,
      options: {
        create: data.options,
      },
    },
  });
}

async function seedLesson(
  prisma: SeedClient,
  topicId: string,
  lesson: LessonData,
  questions: QuestionData[],
) {
  const record = await upsertLesson(prisma, topicId, lesson);

  for (const question of questions) {
    await upsertQuestion(prisma, topicId, record.id, question);
  }

  return record;
}

async function seedIelts(
  prisma: SeedClient,
  examId: string,
) {
  const subjects = await prisma.subject.findMany({
    where: {
      examId,
    },
    orderBy: {
      order: "asc",
    },
  });

  const bySlug = new Map(subjects.map((subject) => [subject.slug, subject]));

  const listening = bySlug.get("listening");
  const reading = bySlug.get("reading");
  const writing = bySlug.get("writing");
  const speaking = bySlug.get("speaking");

  if (!listening || !reading || !writing || !speaking) {
    throw new Error(
      "IELTS subjects are missing. Run the main seed before seeding IELTS content.",
    );
  }

  // -------------------------------------------------------------------------
  // LISTENING
  // -------------------------------------------------------------------------

  const listeningQuestionTypes = await upsertTopic(
    prisma,
    listening.id,
    {
      slug: "question-types",
      name: "Listening Question Types",
      description:
        "Learn how common IELTS Listening question formats work and what each one requires.",
      order: 0,
    },
  );

  await seedLesson(
    prisma,
    listeningQuestionTypes.id,
    {
      title: "Recognising Listening Question Types",
      order: 0,
      estimatedMinutes: 8,
      content: [
        {
          type: "intro",
          text:
            "IELTS Listening uses several question formats. Knowing the format before the recording starts helps you listen for the right kind of information.",
        },
        {
          type: "concept",
          text:
            "Common formats include multiple choice, matching, form completion, note completion, sentence completion, summary completion, diagram or map labelling, and short-answer questions.",
        },
        {
          type: "tip",
          text:
            "Read the instructions carefully. If the instruction says NO MORE THAN TWO WORDS AND/OR A NUMBER, an answer that exceeds the limit will not receive the mark.",
        },
        {
          type: "example",
          text:
            "If a form asks for a student's surname and the recording says, 'My surname is Adeyemi,' the answer you need is the surname, not the speaker's full sentence.",
        },
      ],
    },
    [
      {
        prompt:
          "Why should you read the instructions before answering an IELTS Listening completion question?",
        difficulty: "EASY",
        explanation:
          "The instructions tell you how many words or numbers you may use and what form the answer should take.",
        options: [
          {
            text: "They tell you the allowed answer format and word limit",
            isCorrect: true,
            order: 0,
          },
          {
            text: "They reveal every answer in the recording",
            isCorrect: false,
            order: 1,
          },
          {
            text: "They tell you which speaker is always correct",
            isCorrect: false,
            order: 2,
          },
          {
            text: "They replace the need to listen",
            isCorrect: false,
            order: 3,
          },
        ],
      },
      {
        prompt:
          "Which of these is an IELTS Listening question type?",
        difficulty: "EASY",
        explanation:
          "Sentence completion is one of the question types used in IELTS Listening.",
        options: [
          {
            text: "Sentence completion",
            isCorrect: true,
            order: 0,
          },
          {
            text: "Essay rewriting",
            isCorrect: false,
            order: 1,
          },
          {
            text: "Poetry analysis",
            isCorrect: false,
            order: 2,
          },
          {
            text: "Grammar dictation",
            isCorrect: false,
            order: 3,
          },
        ],
      },
    ],
  );

  const listeningPrediction = await upsertTopic(
    prisma,
    listening.id,
    {
      slug: "prediction-and-keywords",
      name: "Prediction and Keywords",
      description:
        "Build the habit of predicting what information you need before listening.",
      order: 1,
    },
  );

  await seedLesson(
    prisma,
    listeningPrediction.id,
    {
      title: "Predict Before You Listen",
      order: 0,
      estimatedMinutes: 8,
      content: [
        {
          type: "intro",
          text:
            "Strong listening is not just hearing every word. It is knowing what information you are listening for.",
        },
        {
          type: "concept",
          text:
            "Before the recording begins, inspect the questions and underline or mentally identify important keywords.",
        },
        {
          type: "example",
          text:
            "If a question says 'The course begins on ______', you can predict that the missing answer is likely to be a date, day, or time expression.",
        },
        {
          type: "tip",
          text:
            "Do not wait for the exact wording from the question. Speakers often use synonyms or paraphrases.",
        },
      ],
    },
    [
      {
        prompt:
          "What is the main purpose of predicting before an IELTS Listening recording?",
        difficulty: "EASY",
        explanation:
          "Prediction helps you know what type of information to listen for before the recording reaches the relevant point.",
        options: [
          {
            text: "To anticipate the information you need",
            isCorrect: true,
            order: 0,
          },
          {
            text: "To memorise the entire recording",
            isCorrect: false,
            order: 1,
          },
          {
            text: "To avoid listening to the recording",
            isCorrect: false,
            order: 2,
          },
          {
            text: "To choose answers randomly",
            isCorrect: false,
            order: 3,
          },
        ],
      },
      {
        prompt:
          "If a blank follows 'The appointment is on ______', what should you first predict?",
        difficulty: "EASY",
        explanation:
          "The wording suggests that the missing information is likely to be a date or day.",
        options: [
          {
            text: "A date or day",
            isCorrect: true,
            order: 0,
          },
          {
            text: "A person's opinion",
            isCorrect: false,
            order: 1,
          },
          {
            text: "A paragraph",
            isCorrect: false,
            order: 2,
          },
          {
            text: "A complete essay",
            isCorrect: false,
            order: 3,
          },
        ],
      },
    ],
  );

  const listeningParts = await upsertTopic(
    prisma,
    listening.id,
    {
      slug: "four-part-structure",
      name: "The Four-Part Listening Structure",
      description:
        "Understand how the four Listening parts progress from everyday situations to academic contexts.",
      order: 2,
    },
  );

  await seedLesson(
    prisma,
    listeningParts.id,
    {
      title: "From Everyday Conversation to Academic Talk",
      order: 0,
      estimatedMinutes: 7,
      content: [
        {
          type: "intro",
          text:
            "The IELTS Listening test has four parts, with 10 questions in each part.",
        },
        {
          type: "concept",
          text:
            "Parts 1 and 2 deal with everyday social situations. Parts 3 and 4 deal with educational and training situations.",
        },
        {
          type: "example",
          text:
            "Part 1 may involve a conversation about arrangements. Part 4 may involve one speaker giving an academic talk.",
        },
        {
          type: "tip",
          text:
            "The recording is played once only, so use the question order and your predictions to stay oriented.",
        },
      ],
    },
    [
      {
        prompt:
          "Which IELTS Listening parts focus on educational and training situations?",
        difficulty: "EASY",
        explanation:
          "Parts 3 and 4 deal with educational and training situations.",
        options: [
          {
            text: "Parts 3 and 4",
            isCorrect: true,
            order: 0,
          },
          {
            text: "Parts 1 and 2",
            isCorrect: false,
            order: 1,
          },
          {
            text: "Parts 1 and 4 only",
            isCorrect: false,
            order: 2,
          },
          {
            text: "All parts are identical",
            isCorrect: false,
            order: 3,
          },
        ],
      },
      {
        prompt:
          "How many questions are there in total in the IELTS Listening test?",
        difficulty: "EASY",
        explanation:
          "There are four parts with 10 questions in each, giving 40 questions.",
        options: [
          {
            text: "40",
            isCorrect: true,
            order: 0,
          },
          {
            text: "20",
            isCorrect: false,
            order: 1,
          },
          {
            text: "30",
            isCorrect: false,
            order: 2,
          },
          {
            text: "50",
            isCorrect: false,
            order: 3,
          },
        ],
      },
    ],
  );

  // -------------------------------------------------------------------------
  // READING
  // -------------------------------------------------------------------------

  const readingQuestionTypes = await upsertTopic(
    prisma,
    reading.id,
    {
      slug: "question-types",
      name: "Reading Question Types",
      description:
        "Learn the major IELTS Reading task formats and what they ask you to find.",
      order: 0,
    },
  );

  await seedLesson(
    prisma,
    readingQuestionTypes.id,
    {
      title: "Know the Task Before You Read",
      order: 0,
      estimatedMinutes: 8,
      content: [
        {
          type: "intro",
          text:
            "IELTS Reading uses different task formats, and each one demands a slightly different reading approach.",
        },
        {
          type: "concept",
          text:
            "Common formats include multiple choice, identifying information, identifying a writer's views or claims, matching headings, matching information, sentence endings, summary completion and short-answer questions.",
        },
        {
          type: "example",
          text:
            "For a matching-headings task, your goal is to identify the central idea of each section rather than match a single interesting detail.",
        },
        {
          type: "tip",
          text:
            "Always identify the task type before deciding how deeply to read each part of the passage.",
        },
      ],
    },
    [
      {
        prompt:
          "What is the main focus of a matching-headings task?",
        difficulty: "EASY",
        explanation:
          "Matching headings requires identifying the main idea of each section.",
        options: [
          {
            text: "The central idea of each section",
            isCorrect: true,
            order: 0,
          },
          {
            text: "Every word in the passage",
            isCorrect: false,
            order: 1,
          },
          {
            text: "Only the first sentence",
            isCorrect: false,
            order: 2,
          },
          {
            text: "The author's biography",
            isCorrect: false,
            order: 3,
          },
        ],
      },
      {
        prompt:
          "Which is an IELTS Reading task type?",
        difficulty: "EASY",
        explanation:
          "Matching headings is one of the official IELTS Reading task formats.",
        options: [
          {
            text: "Matching headings",
            isCorrect: true,
            order: 0,
          },
          {
            text: "Paragraph translation",
            isCorrect: false,
            order: 1,
          },
          {
            text: "Dictation",
            isCorrect: false,
            order: 2,
          },
          {
            text: "Oral repetition",
            isCorrect: false,
            order: 3,
          },
        ],
      },
    ],
  );

  const readingSkimming = await upsertTopic(
    prisma,
    reading.id,
    {
      slug: "skimming-and-scanning",
      name: "Skimming and Scanning",
      description:
        "Build fast reading strategies for locating ideas and specific information.",
      order: 1,
    },
  );

  await seedLesson(
    prisma,
    readingSkimming.id,
    {
      title: "Skim for the Big Picture",
      order: 0,
      estimatedMinutes: 8,
      content: [
        {
          type: "intro",
          text:
            "Skimming is a fast reading strategy used to understand the overall direction and structure of a text.",
        },
        {
          type: "concept",
          text:
            "When skimming, focus on titles, headings, opening sentences, repeated ideas and the overall structure rather than trying to understand every detail.",
        },
        {
          type: "example",
          text:
            "If you need to match headings to paragraphs, skimming can help you identify each paragraph's main idea before you inspect supporting details.",
        },
        {
          type: "tip",
          text:
            "Scanning is different: it is used to locate a particular detail such as a name, date, number or term.",
        },
      ],
    },
    [
      {
        prompt:
          "What is skimming mainly used for?",
        difficulty: "EASY",
        explanation:
          "Skimming helps you understand the overall meaning and structure of a text quickly.",
        options: [
          {
            text: "Getting the overall meaning quickly",
            isCorrect: true,
            order: 0,
          },
          {
            text: "Memorising every sentence",
            isCorrect: false,
            order: 1,
          },
          {
            text: "Checking pronunciation",
            isCorrect: false,
            order: 2,
          },
          {
            text: "Writing an essay",
            isCorrect: false,
            order: 3,
          },
        ],
      },
      {
        prompt:
          "Which strategy is more appropriate when looking for a specific date in a passage?",
        difficulty: "EASY",
        explanation:
          "Scanning is designed to locate specific information quickly.",
        options: [
          {
            text: "Scanning",
            isCorrect: true,
            order: 0,
          },
          {
            text: "Free writing",
            isCorrect: false,
            order: 1,
          },
          {
            text: "Paraphrasing",
            isCorrect: false,
            order: 2,
          },
          {
            text: "Speaking",
            isCorrect: false,
            order: 3,
          },
        ],
      },
    ],
  );

  const readingEvidence = await upsertTopic(
    prisma,
    reading.id,
    {
      slug: "evidence-and-paraphrase",
      name: "Evidence and Paraphrase",
      description:
        "Learn to locate supporting evidence and recognise ideas expressed with different wording.",
      order: 2,
    },
  );

  await seedLesson(
    prisma,
    readingEvidence.id,
    {
      title: "Find the Evidence, Not Just the Words",
      order: 0,
      estimatedMinutes: 8,
      content: [
        {
          type: "intro",
          text:
            "Reading questions often test whether you can recognise an idea even when the passage uses different words.",
        },
        {
          type: "concept",
          text:
            "A question may paraphrase information from the passage. Look for equivalent meaning rather than waiting for an exact copy of the question.",
        },
        {
          type: "example",
          text:
            "A question saying 'a reduction in cost' may correspond to a passage saying 'lower prices'. The wording differs, but the idea is related.",
        },
        {
          type: "tip",
          text:
            "Do not select an answer merely because one word looks familiar. Check that the surrounding meaning supports it.",
        },
      ],
    },
    [
      {
        prompt:
          "Why is paraphrase recognition important in IELTS Reading?",
        difficulty: "MEDIUM",
        explanation:
          "The passage and question may express the same idea using different vocabulary or sentence structures.",
        options: [
          {
            text: "The same idea may be expressed using different words",
            isCorrect: true,
            order: 0,
          },
          {
            text: "Every question is copied word for word",
            isCorrect: false,
            order: 1,
          },
          {
            text: "It removes the need to read",
            isCorrect: false,
            order: 2,
          },
          {
            text: "It guarantees every answer",
            isCorrect: false,
            order: 3,
          },
        ],
      },
      {
        prompt:
          "If a passage says 'lower prices', which phrase has a similar meaning?",
        difficulty: "EASY",
        explanation:
          "'Reduced costs' communicates a similar idea to 'lower prices'.",
        options: [
          {
            text: "Reduced costs",
            isCorrect: true,
            order: 0,
          },
          {
            text: "Higher demand",
            isCorrect: false,
            order: 1,
          },
          {
            text: "Longer queues",
            isCorrect: false,
            order: 2,
          },
          {
            text: "New regulations",
            isCorrect: false,
            order: 3,
          },
        ],
      },
    ],
  );

  // -------------------------------------------------------------------------
  // WRITING
  // -------------------------------------------------------------------------

  const writingTaskStructure = await upsertTopic(
    prisma,
    writing.id,
    {
      slug: "task-structure",
      name: "Writing Task Structure",
      description:
        "Understand the two-task structure of IELTS Writing and what each task asks you to produce.",
      order: 0,
    },
  );

  await seedLesson(
    prisma,
    writingTaskStructure.id,
    {
      title: "Two Tasks, Two Different Jobs",
      order: 0,
      estimatedMinutes: 8,
      content: [
        {
          type: "intro",
          text:
            "IELTS Writing contains two tasks. Both must be completed, and the task requirements are different.",
        },
        {
          type: "concept",
          text:
            "For IELTS Academic, Task 1 asks you to describe, summarise or explain visual information such as a graph, table, chart or diagram. Task 2 asks you to write an essay responding to a point of view, argument or problem.",
        },
        {
          type: "example",
          text:
            "A Task 1 response should report and compare the information presented. It should not turn into a personal essay about the topic.",
        },
        {
          type: "tip",
          text:
            "Before writing, identify exactly what the task asks you to do and make sure your response addresses every part.",
        },
      ],
    },
    [
      {
        prompt:
          "In IELTS Academic Writing Task 1, what might you be asked to describe?",
        difficulty: "EASY",
        explanation:
          "Academic Task 1 can present a graph, table, chart or diagram and ask you to describe, summarise or explain the information.",
        options: [
          {
            text: "A graph, table, chart or diagram",
            isCorrect: true,
            order: 0,
          },
          {
            text: "A speaking interview",
            isCorrect: false,
            order: 1,
          },
          {
            text: "A listening recording",
            isCorrect: false,
            order: 2,
          },
          {
            text: "A multiple-choice test",
            isCorrect: false,
            order: 3,
          },
        ],
      },
      {
        prompt:
          "What is the main form of IELTS Academic Writing Task 2?",
        difficulty: "EASY",
        explanation:
          "Task 2 asks you to write an essay in response to a point of view, argument or problem.",
        options: [
          {
            text: "An essay",
            isCorrect: true,
            order: 0,
          },
          {
            text: "A form",
            isCorrect: false,
            order: 1,
          },
          {
            text: "A map label",
            isCorrect: false,
            order: 2,
          },
          {
            text: "A listening transcript",
            isCorrect: false,
            order: 3,
          },
        ],
      },
    ],
  );

  const writingOrganisation = await upsertTopic(
    prisma,
    writing.id,
    {
      slug: "organisation-and-coherence",
      name: "Organisation and Coherence",
      description:
        "Build clear paragraph structure and logical progression of ideas.",
      order: 1,
    },
  );

  await seedLesson(
    prisma,
    writingOrganisation.id,
    {
      title: "Make the Argument Easy to Follow",
      order: 0,
      estimatedMinutes: 8,
      content: [
        {
          type: "intro",
          text:
            "A strong response should be easy for the reader to follow from the opening idea to the conclusion.",
        },
        {
          type: "concept",
          text:
            "Organise related ideas together. Use clear paragraphing and logical links between ideas rather than presenting unrelated points in one block.",
        },
        {
          type: "example",
          text:
            "A body paragraph can begin with its main point, develop that point with explanation, and support it with a relevant example.",
        },
        {
          type: "tip",
          text:
            "Planning for a few minutes can prevent repetition and help you cover all parts of the task.",
        },
      ],
    },
    [
      {
        prompt:
          "What is one purpose of clear paragraphing in IELTS Writing?",
        difficulty: "EASY",
        explanation:
          "Paragraphing helps separate and organise ideas so the response is easier to follow.",
        options: [
          {
            text: "To organise ideas clearly",
            isCorrect: true,
            order: 0,
          },
          {
            text: "To avoid answering the question",
            isCorrect: false,
            order: 1,
          },
          {
            text: "To replace examples",
            isCorrect: false,
            order: 2,
          },
          {
            text: "To reduce the need for planning",
            isCorrect: false,
            order: 3,
          },
        ],
      },
      {
        prompt:
          "Which structure is most useful for a focused body paragraph?",
        difficulty: "MEDIUM",
        explanation:
          "A focused paragraph can introduce a main point, explain it and support it with an example or evidence.",
        options: [
          {
            text: "Main point → explanation → example",
            isCorrect: true,
            order: 0,
          },
          {
            text: "Random ideas → conclusion → topic",
            isCorrect: false,
            order: 1,
          },
          {
            text: "Examples only",
            isCorrect: false,
            order: 2,
          },
          {
            text: "One very long sentence",
            isCorrect: false,
            order: 3,
          },
        ],
      },
    ],
  );

  const writingTaskResponse = await upsertTopic(
    prisma,
    writing.id,
    {
      slug: "task-response",
      name: "Answering the Task",
      description:
        "Learn to identify the exact demands of a writing prompt before drafting.",
      order: 2,
    },
  );

  await seedLesson(
    prisma,
    writingTaskResponse.id,
    {
      title: "Answer the Question You Were Given",
      order: 0,
      estimatedMinutes: 7,
      content: [
        {
          type: "intro",
          text:
            "Good English is not enough if the response does not answer the task.",
        },
        {
          type: "concept",
          text:
            "Break the prompt into its required parts. Identify whether you need to discuss, explain, compare, give an opinion, present solutions, or respond to another specific instruction.",
        },
        {
          type: "example",
          text:
            "If a prompt asks you to discuss both views and give your opinion, a response that discusses only one view does not fully address the task.",
        },
        {
          type: "tip",
          text:
            "Underline the important instruction words before you begin writing.",
        },
      ],
    },
    [
      {
        prompt:
          "What should you identify before beginning an IELTS Writing response?",
        difficulty: "EASY",
        explanation:
          "You should identify the exact requirements of the prompt so that the response addresses every required part.",
        options: [
          {
            text: "The exact requirements of the task",
            isCorrect: true,
            order: 0,
          },
          {
            text: "Only the longest word",
            isCorrect: false,
            order: 1,
          },
          {
            text: "Only the introduction",
            isCorrect: false,
            order: 2,
          },
          {
            text: "The examiner's personal opinion",
            isCorrect: false,
            order: 3,
          },
        ],
      },
      {
        prompt:
          "If a prompt asks you to discuss two views and give your opinion, what should your response do?",
        difficulty: "MEDIUM",
        explanation:
          "The response should address both views and clearly provide the writer's position.",
        options: [
          {
            text: "Address both views and give your opinion",
            isCorrect: true,
            order: 0,
          },
          {
            text: "Discuss only the first view",
            isCorrect: false,
            order: 1,
          },
          {
            text: "Give only a conclusion",
            isCorrect: false,
            order: 2,
          },
          {
            text: "Ignore the instruction",
            isCorrect: false,
            order: 3,
          },
        ],
      },
    ],
  );

  // -------------------------------------------------------------------------
  // SPEAKING
  // -------------------------------------------------------------------------

  const speakingParts = await upsertTopic(
    prisma,
    speaking.id,
    {
      slug: "three-part-structure",
      name: "The Three-Part Speaking Test",
      description:
        "Understand the purpose and flow of the three IELTS Speaking parts.",
      order: 0,
    },
  );

  await seedLesson(
    prisma,
    speakingParts.id,
    {
      title: "Understand the Speaking Test",
      order: 0,
      estimatedMinutes: 8,
      content: [
        {
          type: "intro",
          text:
            "The IELTS Speaking test is an interactive session with a certified examiner.",
        },
        {
          type: "concept",
          text:
            "There are three parts. Part 1 is an introduction and interview on familiar topics. Part 2 asks you to speak about a topic after preparation. Part 3 develops a longer discussion related to the Part 2 topic.",
        },
        {
          type: "example",
          text:
            "Part 1 may ask about your studies or interests. Part 2 gives you a topic to speak about. Part 3 asks broader questions connected to the topic.",
        },
        {
          type: "tip",
          text:
            "Aim for natural, clear communication. Memorising a complete speech can make your answers sound unnatural and inflexible.",
        },
      ],
    },
    [
      {
        prompt:
          "How many parts are there in the IELTS Speaking test?",
        difficulty: "EASY",
        explanation:
          "The Speaking test has three parts.",
        options: [
          {
            text: "Three",
            isCorrect: true,
            order: 0,
          },
          {
            text: "Two",
            isCorrect: false,
            order: 1,
          },
          {
            text: "Four",
            isCorrect: false,
            order: 2,
          },
          {
            text: "Five",
            isCorrect: false,
            order: 3,
          },
        ],
      },
      {
        prompt:
          "What happens in Speaking Part 2?",
        difficulty: "EASY",
        explanation:
          "Part 2 asks the candidate to speak about a particular topic after a short preparation period.",
        options: [
          {
            text: "You speak about a particular topic after preparation",
            isCorrect: true,
            order: 0,
          },
          {
            text: "You complete a reading passage",
            isCorrect: false,
            order: 1,
          },
          {
            text: "You listen to four recordings",
            isCorrect: false,
            order: 2,
          },
          {
            text: "You write an academic essay",
            isCorrect: false,
            order: 3,
          },
        ],
      },
    ],
  );

  const speakingFluency = await upsertTopic(
    prisma,
    speaking.id,
    {
      slug: "fluency-and-development",
      name: "Fluency and Developing Answers",
      description:
        "Practise extending answers naturally instead of relying on one-word responses.",
      order: 1,
    },
  );

  await seedLesson(
    prisma,
    speakingFluency.id,
    {
      title: "Go Beyond One-Sentence Answers",
      order: 0,
      estimatedMinutes: 8,
      content: [
        {
          type: "intro",
          text:
            "Speaking answers should give the examiner enough language to assess your communication ability.",
        },
        {
          type: "concept",
          text:
            "A useful way to develop a familiar-topic answer is to give the answer, explain why, and add a brief example or detail.",
        },
        {
          type: "example",
          text:
            "Question: Do you enjoy reading? A stronger response might answer yes, explain what you enjoy reading, and mention when you usually read.",
        },
        {
          type: "tip",
          text:
            "Develop your answer naturally. Do not add unrelated sentences simply to make the answer longer.",
        },
      ],
    },
    [
      {
        prompt:
          "What is a useful way to develop a Speaking Part 1 answer?",
        difficulty: "EASY",
        explanation:
          "A direct answer followed by a reason and relevant detail gives the response development.",
        options: [
          {
            text: "Answer → reason → relevant detail",
            isCorrect: true,
            order: 0,
          },
          {
            text: "Silence → unrelated story",
            isCorrect: false,
            order: 1,
          },
          {
            text: "One memorised paragraph for every question",
            isCorrect: false,
            order: 2,
          },
          {
            text: "Repeat the same sentence",
            isCorrect: false,
            order: 3,
          },
        ],
      },
      {
        prompt:
          "What should you avoid when extending a speaking answer?",
        difficulty: "EASY",
        explanation:
          "Extra language should remain relevant to the question rather than becoming an unrelated story.",
        options: [
          {
            text: "Adding unrelated information",
            isCorrect: true,
            order: 0,
          },
          {
            text: "Giving a relevant reason",
            isCorrect: false,
            order: 1,
          },
          {
            text: "Adding a relevant example",
            isCorrect: false,
            order: 2,
          },
          {
            text: "Explaining your answer",
            isCorrect: false,
            order: 3,
          },
        ],
      },
    ],
  );

  const speakingPart2 = await upsertTopic(
    prisma,
    speaking.id,
    {
      slug: "part-2-long-turn",
      name: "Part 2 Long Turn",
      description:
        "Learn how to organise a short individual talk around a given topic.",
      order: 2,
    },
  );

  await seedLesson(
    prisma,
    speakingPart2.id,
    {
      title: "Build a Clear Part 2 Talk",
      order: 0,
      estimatedMinutes: 8,
      content: [
        {
          type: "intro",
          text:
            "Part 2 gives you a topic and asks you to speak about it after preparation.",
        },
        {
          type: "concept",
          text:
            "Use the preparation time to organise a simple sequence of ideas. You can think about what happened, who or what was involved, where or when it happened, and why it was significant.",
        },
        {
          type: "example",
          text:
            "For a topic about a memorable event, you could organise your talk around the event, the people involved, what happened, and why you remember it.",
        },
        {
          type: "tip",
          text:
            "Use the preparation time to create keywords and ideas rather than writing a complete speech.",
        },
      ],
    },
    [
      {
        prompt:
          "What is the best use of IELTS Speaking Part 2 preparation time?",
        difficulty: "MEDIUM",
        explanation:
          "Preparation time is useful for organising keywords and a sequence of ideas that can guide the long turn.",
        options: [
          {
            text: "Organise keywords and a clear sequence of ideas",
            isCorrect: true,
            order: 0,
          },
          {
            text: "Write and memorise a complete essay",
            isCorrect: false,
            order: 1,
          },
          {
            text: "Prepare unrelated information",
            isCorrect: false,
            order: 2,
          },
          {
            text: "Ignore the topic",
            isCorrect: false,
            order: 3,
          },
        ],
      },
      {
        prompt:
          "Why are keywords useful during Part 2 preparation?",
        difficulty: "EASY",
        explanation:
          "Keywords help you remember the structure and ideas you want to discuss without requiring a memorised script.",
        options: [
          {
            text: "They help organise and recall your ideas",
            isCorrect: true,
            order: 0,
          },
          {
            text: "They replace speaking",
            isCorrect: false,
            order: 1,
          },
          {
            text: "They guarantee a particular band score",
            isCorrect: false,
            order: 2,
          },
          {
            text: "They are read aloud by the examiner",
            isCorrect: false,
            order: 3,
          },
        ],
      },
    ],
  );
}

async function seedSsceCore(
  prisma: SeedClient,
  examId: string,
) {
  const subjects = await prisma.subject.findMany({
    where: {
      examId,
    },
  });

  const bySlug = new Map(subjects.map((subject) => [subject.slug, subject]));

  const english = bySlug.get("english-language");
  const mathematics = bySlug.get("mathematics");

  if (!english || !mathematics) {
    throw new Error(
      "SSCE English Language or Mathematics subject is missing. Run the main seed first.",
    );
  }

  // -------------------------------------------------------------------------
  // SSCE ENGLISH LANGUAGE
  // -------------------------------------------------------------------------

  const grammar = await upsertTopic(
    prisma,
    english.id,
    {
      slug: "grammar-and-usage",
      name: "Grammar and Usage",
      description:
        "Build accurate sentence structures and recognise standard English usage.",
      order: 0,
    },
  );

  await seedLesson(
    prisma,
    grammar.id,
    {
      title: "Subject–Verb Agreement",
      order: 0,
      estimatedMinutes: 8,
      content: [
        {
          type: "intro",
          text:
            "Subject–verb agreement means that the verb must agree with the subject in number.",
        },
        {
          type: "concept",
          text:
            "A singular subject normally takes a singular verb in the present tense, while a plural subject takes a plural verb.",
        },
        {
          type: "example",
          text:
            "The student works hard. The students work hard.",
        },
        {
          type: "tip",
          text:
            "Do not let words between the subject and verb distract you from identifying the actual subject.",
        },
      ],
    },
    [
      {
        prompt: "Choose the sentence with correct subject–verb agreement.",
        difficulty: "EASY",
        explanation:
          "The singular subject 'student' takes the singular verb 'works'.",
        options: [
          {
            text: "The student works hard.",
            isCorrect: true,
            order: 0,
          },
          {
            text: "The student work hard.",
            isCorrect: false,
            order: 1,
          },
          {
            text: "The student working hard.",
            isCorrect: false,
            order: 2,
          },
          {
            text: "The student are working hard.",
            isCorrect: false,
            order: 3,
          },
        ],
      },
      {
        prompt: "Choose the correct sentence.",
        difficulty: "EASY",
        explanation:
          "The plural subject 'students' takes the plural verb 'work'.",
        options: [
          {
            text: "The students work hard.",
            isCorrect: true,
            order: 0,
          },
          {
            text: "The students works hard.",
            isCorrect: false,
            order: 1,
          },
          {
            text: "The students is work hard.",
            isCorrect: false,
            order: 2,
          },
          {
            text: "The students working hard.",
            isCorrect: false,
            order: 3,
          },
        ],
      },
    ],
  );

  const comprehension = await upsertTopic(
    prisma,
    english.id,
    {
      slug: "reading-comprehension",
      name: "Reading Comprehension",
      description:
        "Develop the ability to identify explicit information, main ideas and implied meaning.",
      order: 1,
    },
  );

  await seedLesson(
    prisma,
    comprehension.id,
    {
      title: "Find the Main Idea",
      order: 0,
      estimatedMinutes: 8,
      content: [
        {
          type: "intro",
          text:
            "A comprehension passage may contain several details, but the main idea is the central point the writer is communicating.",
        },
        {
          type: "concept",
          text:
            "Separate the central message from examples, supporting details and minor information.",
        },
        {
          type: "example",
          text:
            "If a passage explains several ways students can manage study time, its main idea may be effective study-time management rather than one particular technique.",
        },
        {
          type: "tip",
          text:
            "Ask yourself: 'What is this passage mainly about?' before choosing an answer.",
        },
      ],
    },
    [
      {
        prompt:
          "What does the main idea of a passage represent?",
        difficulty: "EASY",
        explanation:
          "The main idea is the central point or message of the passage.",
        options: [
          {
            text: "The central point of the passage",
            isCorrect: true,
            order: 0,
          },
          {
            text: "Only the final sentence",
            isCorrect: false,
            order: 1,
          },
          {
            text: "The least important detail",
            isCorrect: false,
            order: 2,
          },
          {
            text: "A random example",
            isCorrect: false,
            order: 3,
          },
        ],
      },
      {
        prompt:
          "What question can help you identify the main idea?",
        difficulty: "EASY",
        explanation:
          "Asking what the passage is mainly about directs attention toward the central message.",
        options: [
          {
            text: "What is this passage mainly about?",
            isCorrect: true,
            order: 0,
          },
          {
            text: "What is the longest word?",
            isCorrect: false,
            order: 1,
          },
          {
            text: "How many commas are there?",
            isCorrect: false,
            order: 2,
          },
          {
            text: "Which sentence has the most letters?",
            isCorrect: false,
            order: 3,
          },
        ],
      },
    ],
  );

  const vocabulary = await upsertTopic(
    prisma,
    english.id,
    {
      slug: "vocabulary-in-context",
      name: "Vocabulary in Context",
      description:
        "Use surrounding context to determine the meaning of unfamiliar words.",
      order: 2,
    },
  );

  await seedLesson(
    prisma,
    vocabulary.id,
    {
      title: "Use Context Clues",
      order: 0,
      estimatedMinutes: 7,
      content: [
        {
          type: "intro",
          text:
            "You will sometimes meet an unfamiliar word without having to know its dictionary definition immediately.",
        },
        {
          type: "concept",
          text:
            "Look at the words and sentences around the unfamiliar word. Examples, contrasts, explanations and cause-and-effect relationships can provide clues.",
        },
        {
          type: "example",
          text:
            "If a sentence describes someone as 'exhausted' and then says the person had no energy left, the surrounding information suggests that exhausted means extremely tired.",
        },
        {
          type: "tip",
          text:
            "Do not choose a meaning simply because it is familiar. Check whether it fits the whole sentence.",
        },
      ],
    },
    [
      {
        prompt:
          "What should you examine when an unfamiliar word appears in a passage?",
        difficulty: "EASY",
        explanation:
          "The surrounding words and sentences can provide context clues that help reveal the meaning.",
        options: [
          {
            text: "The surrounding context",
            isCorrect: true,
            order: 0,
          },
          {
            text: "Only the first letter",
            isCorrect: false,
            order: 1,
          },
          {
            text: "Only the punctuation mark",
            isCorrect: false,
            order: 2,
          },
          {
            text: "The page number",
            isCorrect: false,
            order: 3,
          },
        ],
      },
      {
        prompt:
          "If a passage says someone was 'exhausted' and had no energy left, what does the context suggest?",
        difficulty: "EASY",
        explanation:
          "The description of having no energy supports the meaning 'extremely tired'.",
        options: [
          {
            text: "Extremely tired",
            isCorrect: true,
            order: 0,
          },
          {
            text: "Very excited",
            isCorrect: false,
            order: 1,
          },
          {
            text: "Completely confused",
            isCorrect: false,
            order: 2,
          },
          {
            text: "Very wealthy",
            isCorrect: false,
            order: 3,
          },
        ],
      },
    ],
  );

  // -------------------------------------------------------------------------
  // SSCE MATHEMATICS
  // -------------------------------------------------------------------------

  const number = await upsertTopic(
    prisma,
    mathematics.id,
    {
      slug: "number-and-numeration",
      name: "Number and Numeration",
      description:
        "Strengthen core number skills used throughout secondary-school mathematics.",
      order: 0,
    },
  );

  await seedLesson(
    prisma,
    number.id,
    {
      title: "Fractions, Decimals and Percentages",
      order: 0,
      estimatedMinutes: 8,
      content: [
        {
          type: "intro",
          text:
            "Fractions, decimals and percentages are different ways of representing quantities and proportions.",
        },
        {
          type: "concept",
          text:
            "A percentage is a fraction out of 100. To convert a decimal to a percentage, multiply by 100.",
        },
        {
          type: "example",
          text:
            "0.35 × 100 = 35%, so 0.35 is equivalent to 35%.",
        },
        {
          type: "tip",
          text:
            "Keep the form of the number in mind when comparing values: convert them to a common form if necessary.",
        },
      ],
    },
    [
      {
        prompt: "Convert 0.35 to a percentage.",
        difficulty: "EASY",
        explanation:
          "Multiply 0.35 by 100: 0.35 × 100 = 35%.",
        options: [
          {
            text: "35%",
            isCorrect: true,
            order: 0,
          },
          {
            text: "3.5%",
            isCorrect: false,
            order: 1,
          },
          {
            text: "0.35%",
            isCorrect: false,
            order: 2,
          },
          {
            text: "350%",
            isCorrect: false,
            order: 3,
          },
        ],
      },
      {
        prompt: "Convert 25% to a decimal.",
        difficulty: "EASY",
        explanation:
          "25% means 25 divided by 100, which is 0.25.",
        options: [
          {
            text: "0.25",
            isCorrect: true,
            order: 0,
          },
          {
            text: "2.5",
            isCorrect: false,
            order: 1,
          },
          {
            text: "25",
            isCorrect: false,
            order: 2,
          },
          {
            text: "0.025",
            isCorrect: false,
            order: 3,
          },
        ],
      },
    ],
  );

  const algebra = await upsertTopic(
    prisma,
    mathematics.id,
    {
      slug: "algebra",
      name: "Algebra",
      description:
        "Use algebraic expressions and equations to represent and solve problems.",
      order: 1,
    },
  );

  await seedLesson(
    prisma,
    algebra.id,
    {
      title: "Solving Simple Linear Equations",
      order: 0,
      estimatedMinutes: 8,
      content: [
        {
          type: "intro",
          text:
            "A linear equation contains a variable whose highest power is one.",
        },
        {
          type: "concept",
          text:
            "Treat an equation like a balance. Perform the same operation on both sides to isolate the unknown.",
        },
        {
          type: "example",
          text:
            "2x + 3 = 11. Subtract 3 from both sides to get 2x = 8, then divide by 2 to get x = 4.",
        },
        {
          type: "tip",
          text:
            "After solving, substitute your answer back into the original equation to check it.",
        },
      ],
    },
    [
      {
        prompt: "Solve: 2x + 3 = 11.",
        difficulty: "EASY",
        explanation:
          "Subtract 3 from both sides to get 2x = 8, then divide by 2. Therefore x = 4.",
        options: [
          {
            text: "4",
            isCorrect: true,
            order: 0,
          },
          {
            text: "7",
            isCorrect: false,
            order: 1,
          },
          {
            text: "5",
            isCorrect: false,
            order: 2,
          },
          {
            text: "3",
            isCorrect: false,
            order: 3,
          },
        ],
      },
      {
        prompt: "Solve: x - 7 = 5.",
        difficulty: "EASY",
        explanation:
          "Add 7 to both sides: x = 12.",
        options: [
          {
            text: "12",
            isCorrect: true,
            order: 0,
          },
          {
            text: "2",
            isCorrect: false,
            order: 1,
          },
          {
            text: "35",
            isCorrect: false,
            order: 2,
          },
          {
            text: "-2",
            isCorrect: false,
            order: 3,
          },
        ],
      },
    ],
  );

  const geometry = await upsertTopic(
    prisma,
    mathematics.id,
    {
      slug: "geometry",
      name: "Geometry",
      description:
        "Develop core geometric reasoning involving angles, shapes and properties.",
      order: 2,
    },
  );

  await seedLesson(
    prisma,
    geometry.id,
    {
      title: "Angles on a Straight Line",
      order: 0,
      estimatedMinutes: 7,
      content: [
        {
          type: "intro",
          text:
            "Angles on a straight line form a total of 180 degrees.",
        },
        {
          type: "concept",
          text:
            "If two adjacent angles lie on a straight line, their sum is 180°.",
        },
        {
          type: "example",
          text:
            "If one angle is 65°, the adjacent angle is 180° − 65° = 115°.",
        },
        {
          type: "tip",
          text:
            "Look for the geometric relationship before calculating. The relationship often gives you the equation immediately.",
        },
      ],
    },
    [
      {
        prompt:
          "Two adjacent angles on a straight line are 65° and x°. Find x.",
        difficulty: "EASY",
        explanation:
          "Angles on a straight line sum to 180°. Therefore x = 180° − 65° = 115°.",
        options: [
          {
            text: "115°",
            isCorrect: true,
            order: 0,
          },
          {
            text: "125°",
            isCorrect: false,
            order: 1,
          },
          {
            text: "65°",
            isCorrect: false,
            order: 2,
          },
          {
            text: "25°",
            isCorrect: false,
            order: 3,
          },
        ],
      },
      {
        prompt:
          "What is the sum of two adjacent angles on a straight line?",
        difficulty: "EASY",
        explanation:
          "Angles forming a straight line add up to 180°.",
        options: [
          {
            text: "180°",
            isCorrect: true,
            order: 0,
          },
          {
            text: "90°",
            isCorrect: false,
            order: 1,
          },
          {
            text: "270°",
            isCorrect: false,
            order: 2,
          },
          {
            text: "360°",
            isCorrect: false,
            order: 3,
          },
        ],
      },
    ],
  );
}

export async function seedSsceIeltsCoreContent(
  prisma: SeedClient,
  ssceId: string,
  ieltsId: string,
) {
  await seedSsceCore(prisma, ssceId);
  await seedIelts(prisma, ieltsId);
}