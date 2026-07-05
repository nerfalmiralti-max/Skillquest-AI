import type { Subject, StudyLevel } from "@/lib/game";

type TutorContext = {
  subject?: Subject | null;
  level?: StudyLevel | null;
};

const subjectTips: Record<Subject, string> = {
  English:
    "For English, turn the idea into one clean sentence, then improve precision: stronger verb, clearer noun, fewer filler words.",
  IELTS:
    "For IELTS, answer the exact task first, then add a reason and a specific example. That structure protects your band score.",
  Biology:
    "For Biology, explain the process as inputs, action, output, and purpose. If you can teach those four parts, the concept is sticking.",
  Math:
    "For Math, write the known values, choose one rule, and show every transformation. Most mistakes hide in skipped steps.",
  Programming:
    "For Programming, name the input, output, and edge case before coding. A tiny test example often reveals the whole solution."
};

export function getFallbackTutorReply(message: string, context: TutorContext = {}) {
  const subject = context.subject ?? "English";
  const level = context.level ?? "Beginner";
  const lower = message.toLowerCase();

  if (lower.includes("quiz") || lower.includes("test") || lower.includes("exam")) {
    return `Boss prep plan for ${subject}: review one weak concept, answer five mixed questions, then explain every mistake in one sentence. At ${level.toLowerCase()} level, accuracy matters more than speed.`;
  }

  if (lower.includes("stuck") || lower.includes("confus") || lower.includes("hard")) {
    return `Let's shrink the problem. Write what you know, what the question asks, and the first rule or concept that might connect them. ${subjectTips[subject]}`;
  }

  if (lower.includes("plan") || lower.includes("schedule") || lower.includes("today")) {
    return `Today's quest plan: 5 minutes of recall, 10 minutes of focused practice, then 3 minutes correcting mistakes. Keep the session small enough to finish cleanly.`;
  }

  if (lower.includes("motivat") || lower.includes("tired")) {
    return `Use the two-minute entry rule: open the task, do the first tiny step, and let momentum decide the rest. XP comes from showing up consistently.`;
  }

  return `${subjectTips[subject]} Try one example now, then tell me where your answer starts to feel uncertain.`;
}
