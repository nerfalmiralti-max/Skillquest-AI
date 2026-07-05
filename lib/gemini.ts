import { GoogleGenAI } from "@google/genai";
import {
  FALLBACK_LISTENING_TEST,
  FALLBACK_READING_TEST,
  type DailyChallenge,
  type IeltsSection,
  type LibraryQuiz,
  type ListeningTest,
  type ReadingTest,
  type SpeakingFeedback,
  type SpeakingTurn,
  type WritingFeedback
} from "@/lib/ielts";

const DEFAULT_MODEL = "gemini-3.5-flash";

type JsonObject = Record<string, unknown>;

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }

  return new GoogleGenAI({ apiKey });
}

export async function generateJson<T>(prompt: string, fallback: T): Promise<T> {
  const client = getGeminiClient();

  if (!client) {
    return fallback;
  }

  try {
    const response = await client.models.generateContent({
      model: process.env.GEMINI_MODEL ?? DEFAULT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.35
      }
    });

    const text = response.text;
    if (!text) {
      return fallback;
    }

    return JSON.parse(stripJsonFence(text)) as T;
  } catch {
    return fallback;
  }
}

export function writingFallback(essay: string, taskType: string): WritingFeedback {
  const wordCount = essay.trim().split(/\s+/).filter(Boolean).length;
  const taskScore = taskType === "task1" ? 6 : 6.5;
  const lengthNote =
    wordCount < 180
      ? "The response is short for a full IELTS answer, so development and evidence are limited."
      : "The response has enough length for meaningful development, but precision can improve.";

  return {
    taskResponse: taskScore,
    coherenceCohesion: 6.5,
    lexicalResource: 6,
    grammar: 6,
    overallBand: 6,
    summary:
      "This is a solid developing response with a clear central idea, but it needs sharper paragraph control, more precise vocabulary, and cleaner complex grammar.",
    mistakes: [
      lengthNote,
      "Some ideas are stated generally; add specific examples or data-linked comparisons.",
      "Several sentences could be shorter and more controlled to reduce grammar risk."
    ],
    rewrites: [
      {
        original: "This thing is very important for people.",
        improved:
          "This issue has become increasingly important because it directly affects students' long-term opportunities.",
        reason: "The improved version is more specific and uses academic phrasing."
      }
    ],
    vocabulary: [
      "a measurable improvement",
      "a significant drawback",
      "a long-term consequence",
      "to allocate resources",
      "to address the underlying problem"
    ],
    grammarTips: [
      "Use one main clause per sentence when your idea is already complex.",
      "Check article use before singular countable nouns.",
      "Vary conditionals and relative clauses, but keep punctuation controlled."
    ],
    nextSteps: [
      "Rewrite the introduction with a direct thesis.",
      "Add one specific example to each body paragraph.",
      "Proofread for articles, subject-verb agreement, and comma splices."
    ]
  };
}

export function speakingFallback(answer: string, part: string): SpeakingFeedback {
  const enoughDevelopment = answer.trim().split(/\s+/).length > 45;

  return {
    fluency: enoughDevelopment ? 6.5 : 5.5,
    pronunciation: null,
    grammar: 6,
    vocabulary: enoughDevelopment ? 6.5 : 6,
    overallBand: enoughDevelopment ? 6.5 : 6,
    nextQuestion:
      part === "3"
        ? "Do you think schools should teach students how to learn independently? Why?"
        : "Can you give me one specific example from your own experience?",
    feedback: [
      "Your answer is understandable and relevant.",
      "Extend answers with a clear reason, example, and short result.",
      "Use linking phrases naturally, such as 'one reason is', 'for example', and 'as a result'."
    ],
    improvementDrills: [
      "Record a 45-second answer and remove repeated fillers.",
      "Retell the same answer with one advanced adjective and one complex sentence.",
      "Practice ending with a short conclusion instead of stopping suddenly."
    ]
  };
}

export function readingFallback(topic: string): ReadingTest {
  return {
    ...FALLBACK_READING_TEST,
    title: topic ? `IELTS Reading: ${topic}` : FALLBACK_READING_TEST.title
  };
}

export function listeningFallback(audioName: string): ListeningTest {
  return {
    ...FALLBACK_LISTENING_TEST,
    title: audioName ? `Listening Questions for ${audioName}` : FALLBACK_LISTENING_TEST.title
  };
}

export function libraryFallback(text: string): LibraryQuiz {
  const trimmed = text.trim();
  const focus =
    trimmed.length > 0
      ? trimmed.slice(0, 220)
      : "No readable text was found, so the summary is based on the file metadata.";

  return {
    summary:
      "This material appears useful for IELTS preparation because it can be turned into recall questions, vocabulary review, and short explanations.",
    explanation: `Key focus: ${focus}`,
    quiz: [
      {
        question: "What is the main idea of this material?",
        answer: "Identify the central concept or skill the file is teaching.",
        explanation:
          "Main-idea questions help convert passive reading into active recall."
      },
      {
        question: "Which two vocabulary items should be reviewed?",
        answer: "Choose two repeated or unfamiliar academic terms.",
        explanation:
          "Vocabulary review is strongest when words come from a real study context."
      },
      {
        question: "What would be a likely IELTS-style question from this material?",
        answer: "Create a question that tests understanding, not memorization.",
        explanation:
          "IELTS rewards comprehension and inference more than copying lines."
      }
    ]
  };
}

export function dailyFallback(weakSkill = "Writing Task 2"): DailyChallenge[] {
  return [
    {
      title: "Thesis Forge",
      section: "Writing Task 2",
      minutes: 20,
      xp: 35,
      task: `Write two introductions for a ${weakSkill} prompt: one balanced opinion and one strong opinion.`,
      successCriteria: [
        "Paraphrase the task clearly",
        "Give a direct thesis",
        "Avoid memorized template language"
      ]
    },
    {
      title: "Precision Listening",
      section: "Listening",
      minutes: 15,
      xp: 25,
      task: "Listen to a short academic clip and write every number, name, and location you hear.",
      successCriteria: [
        "Check spelling",
        "Mark missed distractors",
        "Repeat once and correct the notes"
      ]
    },
    {
      title: "Vocabulary Upgrade",
      section: "Vocabulary",
      minutes: 10,
      xp: 20,
      task: "Replace five basic words in your last essay with precise academic alternatives.",
      successCriteria: [
        "Keep meaning accurate",
        "Use each word in a full sentence",
        "Avoid rare words you cannot control"
      ]
    }
  ];
}

export function writingPrompt(taskType: string, prompt: string, essay: string) {
  return `You are an IELTS writing examiner. Use original analysis only.
Return strict JSON with keys: taskResponse, coherenceCohesion, lexicalResource, grammar, overallBand, summary, mistakes, rewrites, vocabulary, grammarTips, nextSteps.
All band scores must be numbers from 0 to 9 in 0.5 increments.
Task type: ${taskType}
Prompt: ${prompt}
Essay:
${essay}`;
}

export function speakingPrompt(part: string, turns: SpeakingTurn[], answer: string) {
  return `You are an IELTS speaking examiner. Return strict JSON with keys: fluency, pronunciation, grammar, vocabulary, overallBand, nextQuestion, feedback, improvementDrills.
Pronunciation should be null unless audio evidence is available.
Speaking part: ${part}
Conversation so far: ${JSON.stringify(turns)}
Candidate answer: ${answer}`;
}

export function readingPrompt(topic: string, difficulty: string) {
  return `Create an original IELTS-style academic reading passage. Do not copy any commercial IELTS material.
Return strict JSON with keys title, passage, questions.
Questions must include True/False/Not Given, Matching Headings, Multiple Choice, and Sentence Completion.
Each question needs id, type, question, optional options, answer, explanation.
Topic: ${topic || "education and technology"}
Difficulty: ${difficulty}`;
}

export function listeningPrompt(fileName: string, notes: string) {
  return `Create original IELTS-style listening questions for a user-uploaded audio file.
Do not claim to transcribe audio unless a transcript is provided. Use provided notes or filename only.
Return strict JSON with keys title, transcriptPrompt, questions.
Each question needs id, question, answer, explanation.
File name: ${fileName}
Notes or transcript: ${notes || "No transcript provided."}`;
}

export function libraryPrompt(fileName: string, text: string) {
  return `Analyze this user-uploaded study material for IELTS preparation.
Return strict JSON with keys summary, explanation, quiz.
Quiz must have 3 items with question, answer, explanation.
Use only the supplied text and do not copy external IELTS materials.
File: ${fileName}
Text:
${text.slice(0, 8000)}`;
}

export function dailyPrompt(weakSkill: IeltsSection | string, targetBand: string) {
  return `Create 3 original daily IELTS challenges.
Return strict JSON array. Each item must have title, section, minutes, xp, task, successCriteria.
Use these section names only: Listening, Reading, Writing Task 1, Writing Task 2, Speaking, Vocabulary, Grammar.
Weak skill: ${weakSkill}
Target band: ${targetBand}`;
}

function stripJsonFence(text: string) {
  return text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "");
}

export function numberFromUnknown(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function stringFromUnknown(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

export function arrayFromUnknown(value: unknown, fallback: string[]) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : fallback;
}

export function asJsonObject(value: unknown): JsonObject {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as JsonObject) : {};
}
