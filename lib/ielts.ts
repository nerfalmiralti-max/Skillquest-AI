export const IELTS_SECTIONS = [
  "Listening",
  "Reading",
  "Writing Task 1",
  "Writing Task 2",
  "Speaking",
  "Vocabulary",
  "Grammar"
] as const;

export type IeltsSection = (typeof IELTS_SECTIONS)[number];

export type WritingFeedback = {
  taskResponse: number;
  coherenceCohesion: number;
  lexicalResource: number;
  grammar: number;
  overallBand: number;
  summary: string;
  mistakes: string[];
  rewrites: Array<{ original: string; improved: string; reason: string }>;
  vocabulary: string[];
  grammarTips: string[];
  nextSteps: string[];
};

export type SpeakingTurn = {
  examiner: string;
  candidate?: string;
};

export type SpeakingFeedback = {
  fluency: number;
  pronunciation: number | null;
  grammar: number;
  vocabulary: number;
  overallBand: number;
  nextQuestion: string;
  feedback: string[];
  improvementDrills: string[];
};

export type ReadingQuestion = {
  id: string;
  type:
    | "True/False/Not Given"
    | "Matching Headings"
    | "Multiple Choice"
    | "Sentence Completion";
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
};

export type ReadingTest = {
  title: string;
  passage: string;
  questions: ReadingQuestion[];
};

export type ListeningQuestion = {
  id: string;
  question: string;
  answer: string;
  explanation: string;
};

export type ListeningTest = {
  title: string;
  transcriptPrompt: string;
  questions: ListeningQuestion[];
};

export type LibraryQuiz = {
  summary: string;
  explanation: string;
  quiz: Array<{
    question: string;
    answer: string;
    explanation: string;
  }>;
};

export type DailyChallenge = {
  title: string;
  section: IeltsSection;
  minutes: number;
  xp: number;
  task: string;
  successCriteria: string[];
};

export type IeltsProgressEvent = {
  id: string;
  type:
    | "writing"
    | "speaking"
    | "reading"
    | "listening"
    | "library"
    | "daily"
    | "vocabulary"
    | "grammar";
  section: IeltsSection;
  score?: number;
  xp: number;
  createdAt: string;
  label: string;
};

export const FALLBACK_READING_TEST: ReadingTest = {
  title: "Urban Memory and the Future of Study Spaces",
  passage:
    "Modern libraries are changing from silent book warehouses into flexible learning ecosystems. Architects now design study spaces that support concentration, collaboration, digital research, and short recovery breaks. This shift reflects a broader understanding of how students learn: attention improves when learners can move between focused work and brief social exchange. However, the most successful spaces do not simply add technology. They preserve quiet zones, clear navigation, natural light, and reliable access to high-quality resources. The result is a learning environment that feels both calm and intellectually active.",
  questions: [
    {
      id: "r1",
      type: "True/False/Not Given",
      question:
        "The passage says that all modern libraries have removed quiet study zones.",
      answer: "False",
      explanation:
        "The passage says successful spaces preserve quiet zones, so the statement contradicts the text."
    },
    {
      id: "r2",
      type: "Multiple Choice",
      question: "What is the main idea of the passage?",
      options: [
        "Libraries are becoming entertainment venues.",
        "Learning spaces are evolving while still protecting focused study.",
        "Technology is the only reason libraries are useful.",
        "Students no longer need physical resources."
      ],
      answer: "Learning spaces are evolving while still protecting focused study.",
      explanation:
        "The passage balances flexible, modern features with quiet, resource-rich study needs."
    },
    {
      id: "r3",
      type: "Sentence Completion",
      question:
        "Attention improves when learners move between focused work and ______.",
      answer: "brief social exchange",
      explanation:
        "The phrase appears directly in the passage after the discussion of attention."
    },
    {
      id: "r4",
      type: "Matching Headings",
      question: "Choose the best heading: A. Flexible spaces, stable purpose",
      answer: "A. Flexible spaces, stable purpose",
      explanation:
        "The passage describes changing library design while keeping the study mission intact."
    }
  ]
};

export const FALLBACK_LISTENING_TEST: ListeningTest = {
  title: "Campus Workshop Announcement",
  transcriptPrompt:
    "A university adviser announces a workshop about building a weekly study plan, choosing realistic goals, and booking feedback sessions.",
  questions: [
    {
      id: "l1",
      question: "What is the workshop mainly about?",
      answer: "building a weekly study plan",
      explanation:
        "The announcement focuses on planning, goals, and feedback sessions."
    },
    {
      id: "l2",
      question: "What kind of goals should students choose?",
      answer: "realistic goals",
      explanation:
        "The transcript prompt specifically mentions choosing realistic goals."
    },
    {
      id: "l3",
      question: "What can students book after planning?",
      answer: "feedback sessions",
      explanation:
        "Feedback sessions are listed as a follow-up support option."
    }
  ]
};

export function estimateBand(scores: number[]) {
  const valid = scores.filter((score) => Number.isFinite(score));
  if (valid.length === 0) {
    return 0;
  }

  const average = valid.reduce((total, score) => total + score, 0) / valid.length;
  return Math.round(average * 2) / 2;
}

export function createProgressEvent(
  type: IeltsProgressEvent["type"],
  section: IeltsSection,
  label: string,
  xp: number,
  score?: number
): IeltsProgressEvent {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`;

  return {
    id,
    type,
    section,
    label,
    xp,
    score,
    createdAt: new Date().toISOString()
  };
}
