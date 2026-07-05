export const STORAGE_KEY = "skillquest-ai-profile-v1";

export const SUBJECTS = [
  "English",
  "IELTS",
  "Biology",
  "Math",
  "Programming"
] as const;

export const STUDY_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;
export const DAILY_TIMES = [10, 20, 30, 60] as const;

export type Subject = (typeof SUBJECTS)[number];
export type StudyLevel = (typeof STUDY_LEVELS)[number];
export type DailyTime = (typeof DAILY_TIMES)[number];

export type AchievementId =
  | "firstQuest"
  | "hundredXp"
  | "bossDefeated"
  | "threeDayStreak";

export type Achievement = {
  id: AchievementId;
  title: string;
  description: string;
  accent: "meadow" | "coin" | "ember" | "mana";
};

export type Quest = {
  id: string;
  title: string;
  description: string;
  minutes: number;
  xp: number;
  tag: string;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

export type TutorMessage = {
  id: string;
  role: "student" | "tutor";
  content: string;
  createdAt: string;
};

export type GameProfile = {
  subject: Subject | null;
  level: StudyLevel | null;
  dailyTime: DailyTime | null;
  xp: number;
  streak: number;
  lastQuestDate: string | null;
  completedQuests: Record<string, string[]>;
  bossAttempts: number;
  bossWins: number;
  achievementsUnlocked: Partial<Record<AchievementId, string>>;
  tutorMessages: TutorMessage[];
};

export const DEFAULT_PROFILE: GameProfile = {
  subject: null,
  level: null,
  dailyTime: null,
  xp: 0,
  streak: 0,
  lastQuestDate: null,
  completedQuests: {},
  bossAttempts: 0,
  bossWins: 0,
  achievementsUnlocked: {},
  tutorMessages: []
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "firstQuest",
    title: "First Quest",
    description: "Complete your first daily study quest.",
    accent: "meadow"
  },
  {
    id: "hundredXp",
    title: "100 XP",
    description: "Earn 100 total XP from quests and boss quizzes.",
    accent: "coin"
  },
  {
    id: "bossDefeated",
    title: "Boss Defeated",
    description: "Pass a boss quiz with at least 3 correct answers.",
    accent: "ember"
  },
  {
    id: "threeDayStreak",
    title: "3 Day Streak",
    description: "Complete quests on three study days in a row.",
    accent: "mana"
  }
];

const subjectQuestTemplates: Record<
  Subject,
  Array<Omit<Quest, "id" | "minutes" | "xp">>
> = {
  English: [
    {
      title: "Vocabulary Forge",
      description: "Learn 8 useful words, then write one original sentence for each.",
      tag: "Words"
    },
    {
      title: "Grammar Gate",
      description: "Fix 5 sentence errors and explain the rule behind each correction.",
      tag: "Grammar"
    },
    {
      title: "Reading Trail",
      description: "Read a short passage and summarize the main idea in 3 lines.",
      tag: "Reading"
    }
  ],
  IELTS: [
    {
      title: "Band Builder",
      description: "Answer one Task 2 prompt with a thesis and two topic sentences.",
      tag: "Writing"
    },
    {
      title: "Listening Signal",
      description: "Practice one audio clip and note every missed keyword.",
      tag: "Listening"
    },
    {
      title: "Speaking Camp",
      description: "Record a 90-second Part 2 answer and improve one weak phrase.",
      tag: "Speaking"
    }
  ],
  Biology: [
    {
      title: "Cell Lab",
      description: "Sketch a cell process and label the inputs, outputs, and purpose.",
      tag: "Cells"
    },
    {
      title: "Concept Chain",
      description: "Connect 5 biology terms into one cause-and-effect explanation.",
      tag: "Systems"
    },
    {
      title: "Recall Trial",
      description: "Close your notes and write the key facts from memory for 6 minutes.",
      tag: "Memory"
    }
  ],
  Math: [
    {
      title: "Problem Sprint",
      description: "Solve 6 focused problems and mark the step where each answer turned.",
      tag: "Practice"
    },
    {
      title: "Formula Forge",
      description: "Rewrite 3 formulas from memory and show where each one comes from.",
      tag: "Formulas"
    },
    {
      title: "Error Hunt",
      description: "Review one wrong answer and rebuild the clean solution line by line.",
      tag: "Review"
    }
  ],
  Programming: [
    {
      title: "Code Kata",
      description: "Solve one small function and add two examples that prove it works.",
      tag: "Code"
    },
    {
      title: "Debug Dungeon",
      description: "Find the bug in a snippet and describe the real cause in plain English.",
      tag: "Debug"
    },
    {
      title: "Refactor Route",
      description: "Improve a tiny block of code for readability without changing behavior.",
      tag: "Design"
    }
  ]
};

export const quizBank: Record<Subject, QuizQuestion[]> = {
  English: [
    {
      question: "Which sentence uses a semicolon correctly?",
      options: [
        "I revised the essay; then submitted it.",
        "I revised the essay; it became clearer.",
        "Although I revised; the essay improved.",
        "I revised; and the essay improved."
      ],
      answerIndex: 1,
      explanation: "A semicolon can join two closely related independent clauses."
    },
    {
      question: "What is the main purpose of a topic sentence?",
      options: [
        "To cite a source",
        "To introduce the paragraph's central idea",
        "To end the essay",
        "To define every keyword"
      ],
      answerIndex: 1,
      explanation: "A topic sentence signals the focus of the paragraph."
    },
    {
      question: "Which word is closest in meaning to 'concise'?",
      options: ["Brief", "Confused", "Decorative", "Delayed"],
      answerIndex: 0,
      explanation: "Concise writing says enough with fewer words."
    },
    {
      question: "Choose the correctly punctuated sentence.",
      options: [
        "The lesson was hard, but useful.",
        "The lesson was hard but, useful.",
        "The lesson, was hard but useful.",
        "The lesson was, hard but useful."
      ],
      answerIndex: 0,
      explanation: "A comma can come before a coordinating conjunction joining clauses."
    },
    {
      question: "What should a strong conclusion do?",
      options: [
        "Add unrelated evidence",
        "Repeat every sentence",
        "Close the argument with a clear final insight",
        "Avoid the thesis completely"
      ],
      answerIndex: 2,
      explanation: "A conclusion should resolve the idea and leave a final takeaway."
    }
  ],
  IELTS: [
    {
      question: "In IELTS Writing Task 2, what should the introduction include?",
      options: [
        "Only examples",
        "A paraphrase of the question and a clear position",
        "A list of memorized idioms",
        "A conclusion"
      ],
      answerIndex: 1,
      explanation: "A strong introduction frames the prompt and states your position."
    },
    {
      question: "Which speaking response is usually strongest?",
      options: [
        "One-word answers",
        "A memorized answer to every topic",
        "A developed answer with reasons and examples",
        "An answer with no pauses at all"
      ],
      answerIndex: 2,
      explanation: "IELTS Speaking rewards developed, natural, relevant answers."
    },
    {
      question: "What does skimming help with in IELTS Reading?",
      options: [
        "Finding the overall idea quickly",
        "Memorizing every date",
        "Avoiding the passage",
        "Checking grammar"
      ],
      answerIndex: 0,
      explanation: "Skimming gives you the main idea before detailed searching."
    },
    {
      question: "What is one common listening trap?",
      options: [
        "The speaker corrects themselves after giving an answer",
        "The audio repeats forever",
        "Questions have no order",
        "Spelling never matters"
      ],
      answerIndex: 0,
      explanation: "IELTS audio often includes corrections or distractors."
    },
    {
      question: "Which habit helps improve Task 1 Academic writing?",
      options: [
        "Describing every number equally",
        "Grouping major trends and comparisons",
        "Ignoring the overview",
        "Writing opinions"
      ],
      answerIndex: 1,
      explanation: "Task 1 rewards clear overview, grouping, and comparison."
    }
  ],
  Biology: [
    {
      question: "What is the main function of mitochondria?",
      options: [
        "Store genetic information",
        "Produce usable cellular energy",
        "Control water balance only",
        "Build the cell wall"
      ],
      answerIndex: 1,
      explanation: "Mitochondria help produce ATP, the cell's usable energy."
    },
    {
      question: "Which molecule carries genetic instructions?",
      options: ["ATP", "DNA", "Glucose", "Starch"],
      answerIndex: 1,
      explanation: "DNA stores genetic information used by living organisms."
    },
    {
      question: "What happens during photosynthesis?",
      options: [
        "Plants convert light energy into chemical energy",
        "Animals digest proteins",
        "Cells split without copying DNA",
        "Water becomes oxygen without light"
      ],
      answerIndex: 0,
      explanation: "Photosynthesis uses light to make sugars from carbon dioxide and water."
    },
    {
      question: "Which level of organization contains multiple organs working together?",
      options: ["Cell", "Tissue", "Organ system", "Molecule"],
      answerIndex: 2,
      explanation: "An organ system is made of organs that coordinate a function."
    },
    {
      question: "What is homeostasis?",
      options: [
        "Random body change",
        "Maintaining stable internal conditions",
        "The loss of all energy",
        "Only plant reproduction"
      ],
      answerIndex: 1,
      explanation: "Homeostasis keeps internal conditions within useful ranges."
    }
  ],
  Math: [
    {
      question: "What is 15% of 80?",
      options: ["8", "10", "12", "15"],
      answerIndex: 2,
      explanation: "0.15 x 80 = 12."
    },
    {
      question: "Solve for x: 2x + 5 = 17.",
      options: ["4", "5", "6", "7"],
      answerIndex: 2,
      explanation: "Subtract 5 to get 2x = 12, then divide by 2."
    },
    {
      question: "Which expression is equivalent to 3(a + 4)?",
      options: ["3a + 4", "a + 12", "3a + 12", "7a"],
      answerIndex: 2,
      explanation: "Distribute 3 to both terms inside the parentheses."
    },
    {
      question: "What is the area of a rectangle with length 9 and width 4?",
      options: ["13", "18", "26", "36"],
      answerIndex: 3,
      explanation: "Area equals length times width: 9 x 4 = 36."
    },
    {
      question: "Which number is prime?",
      options: ["21", "29", "35", "49"],
      answerIndex: 1,
      explanation: "29 has no positive divisors except 1 and 29."
    }
  ],
  Programming: [
    {
      question: "What does a function usually do?",
      options: [
        "Stores only images",
        "Groups reusable instructions",
        "Deletes a project",
        "Changes the keyboard layout"
      ],
      answerIndex: 1,
      explanation: "A function packages logic so it can be reused with inputs."
    },
    {
      question: "Which value is a boolean?",
      options: ["'hello'", "42", "true", "[1, 2]"],
      answerIndex: 2,
      explanation: "Booleans represent true or false values."
    },
    {
      question: "What is the purpose of a loop?",
      options: [
        "Repeat a block of code",
        "Encrypt every file",
        "Make code invisible",
        "Name a variable"
      ],
      answerIndex: 0,
      explanation: "Loops repeat work while a condition or sequence requires it."
    },
    {
      question: "Which practice makes code easier to maintain?",
      options: [
        "Meaningful names",
        "Duplicating every line",
        "Removing tests",
        "Hiding errors"
      ],
      answerIndex: 0,
      explanation: "Clear names reduce the mental work needed to read code."
    },
    {
      question: "What does an array commonly store?",
      options: [
        "A list of values",
        "Only one letter",
        "A screen brightness setting",
        "A compiled operating system"
      ],
      answerIndex: 0,
      explanation: "Arrays hold ordered lists of values."
    }
  ]
};

export function getTodayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getLevelFromXp(xp: number) {
  return Math.floor(Math.max(0, xp) / 100) + 1;
}

export function getLevelProgress(xp: number) {
  return Math.max(0, xp) % 100;
}

export function getActiveSubject(profile: GameProfile): Subject {
  return profile.subject ?? "English";
}

export function getActiveStudyLevel(profile: GameProfile): StudyLevel {
  return profile.level ?? "Beginner";
}

export function getActiveDailyTime(profile: GameProfile): DailyTime {
  return profile.dailyTime ?? 20;
}

export function getDailyQuests(profile: GameProfile, dateKey = getTodayKey()) {
  const subject = getActiveSubject(profile);
  const minutes = Math.max(5, Math.round(getActiveDailyTime(profile) / 3));
  const level = getActiveStudyLevel(profile);

  return subjectQuestTemplates[subject].map((quest, index) => ({
    ...quest,
    id: `${dateKey}-${subject}-${index + 1}`,
    minutes,
    xp: level === "Advanced" ? 35 : level === "Intermediate" ? 30 : 25
  }));
}

export function getQuizQuestions(subject: Subject | null) {
  return quizBank[subject ?? "English"];
}

export function getTotalCompletedQuests(profile: GameProfile) {
  return Object.values(profile.completedQuests).reduce(
    (total, quests) => total + quests.length,
    0
  );
}

export function getBossXpAward(score: number) {
  return score * 20 + (score >= 3 ? 50 : 15);
}

export function normalizeProfile(value: unknown): GameProfile {
  if (!value || typeof value !== "object") {
    return DEFAULT_PROFILE;
  }

  const input = value as Partial<GameProfile>;
  const subject = SUBJECTS.includes(input.subject as Subject)
    ? (input.subject as Subject)
    : null;
  const level = STUDY_LEVELS.includes(input.level as StudyLevel)
    ? (input.level as StudyLevel)
    : null;
  const dailyTime = DAILY_TIMES.includes(input.dailyTime as DailyTime)
    ? (input.dailyTime as DailyTime)
    : null;

  return withAchievements({
    subject,
    level,
    dailyTime,
    xp: typeof input.xp === "number" && Number.isFinite(input.xp) ? input.xp : 0,
    streak:
      typeof input.streak === "number" && Number.isFinite(input.streak)
        ? input.streak
        : 0,
    lastQuestDate:
      typeof input.lastQuestDate === "string" ? input.lastQuestDate : null,
    completedQuests:
      input.completedQuests && typeof input.completedQuests === "object"
        ? sanitizeQuestRecord(input.completedQuests)
        : {},
    bossAttempts:
      typeof input.bossAttempts === "number" && Number.isFinite(input.bossAttempts)
        ? input.bossAttempts
        : 0,
    bossWins:
      typeof input.bossWins === "number" && Number.isFinite(input.bossWins)
        ? input.bossWins
        : 0,
    achievementsUnlocked:
      input.achievementsUnlocked && typeof input.achievementsUnlocked === "object"
        ? input.achievementsUnlocked
        : {},
    tutorMessages: Array.isArray(input.tutorMessages)
      ? input.tutorMessages.filter(isTutorMessage).slice(-12)
      : []
  });
}

export function withAchievements(profile: GameProfile): GameProfile {
  const next: GameProfile = {
    ...profile,
    achievementsUnlocked: { ...profile.achievementsUnlocked }
  };
  const now = new Date().toISOString();

  if (getTotalCompletedQuests(next) > 0 && !next.achievementsUnlocked.firstQuest) {
    next.achievementsUnlocked.firstQuest = now;
  }

  if (next.xp >= 100 && !next.achievementsUnlocked.hundredXp) {
    next.achievementsUnlocked.hundredXp = now;
  }

  if (next.bossWins > 0 && !next.achievementsUnlocked.bossDefeated) {
    next.achievementsUnlocked.bossDefeated = now;
  }

  if (next.streak >= 3 && !next.achievementsUnlocked.threeDayStreak) {
    next.achievementsUnlocked.threeDayStreak = now;
  }

  return next;
}

export function isYesterday(previous: string, today: string) {
  const previousDate = new Date(`${previous}T12:00:00`);
  const todayDate = new Date(`${today}T12:00:00`);
  const diff = todayDate.getTime() - previousDate.getTime();
  return Math.round(diff / 86400000) === 1;
}

function sanitizeQuestRecord(record: Record<string, unknown>) {
  return Object.entries(record).reduce<Record<string, string[]>>((acc, [date, ids]) => {
    if (typeof date === "string" && Array.isArray(ids)) {
      acc[date] = ids.filter((id): id is string => typeof id === "string");
    }
    return acc;
  }, {});
}

function isTutorMessage(message: unknown): message is TutorMessage {
  if (!message || typeof message !== "object") {
    return false;
  }
  const input = message as Partial<TutorMessage>;
  return (
    typeof input.id === "string" &&
    (input.role === "student" || input.role === "tutor") &&
    typeof input.content === "string" &&
    typeof input.createdAt === "string"
  );
}
