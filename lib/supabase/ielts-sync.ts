"use client";

import type {
  IeltsProgressEvent,
  IeltsSection,
  LibraryQuiz,
  ListeningTest,
  ReadingTest,
  SpeakingFeedback,
  SpeakingTurn,
  WritingFeedback
} from "@/lib/ielts";
import type { StudyLibraryItem } from "@/lib/ielts-storage";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { ensureAuthenticatedUser } from "@/lib/supabase/game-sync";
import type { Json } from "@/lib/supabase/types";

export async function saveIeltsProgressToSupabase(event: IeltsProgressEvent) {
  await withSupabaseUser(async (supabase, userId) => {
    await supabase.from("progress_events").insert({
      user_id: userId,
      event_type: event.type,
      section: event.section,
      label: event.label,
      score: event.score ?? null,
      xp: event.xp,
      created_at: event.createdAt
    });
  });
}

export async function saveEssayToSupabase(input: {
  taskType: "task1" | "task2";
  prompt: string;
  essay: string;
  feedback: WritingFeedback;
}) {
  await withSupabaseUser(async (supabase, userId) => {
    await supabase.from("essays").insert({
      user_id: userId,
      task_type: input.taskType,
      prompt: input.prompt,
      essay: input.essay,
      feedback: input.feedback as unknown as Json,
      estimated_band: input.feedback.overallBand
    });
  });
}

export async function saveSpeakingToSupabase(input: {
  part: "1" | "2" | "3";
  turns: SpeakingTurn[];
  feedback: SpeakingFeedback;
}) {
  await withSupabaseUser(async (supabase, userId) => {
    await supabase.from("speaking_sessions").insert({
      user_id: userId,
      part: input.part,
      turns: input.turns as unknown as Json,
      feedback: input.feedback as unknown as Json,
      estimated_band: input.feedback.overallBand
    });
  });
}

export async function saveGeneratedQuizToSupabase(input: {
  section: IeltsSection;
  title: string;
  content: ReadingTest | ListeningTest | LibraryQuiz | Json;
  score?: number;
}) {
  await withSupabaseUser(async (supabase, userId) => {
    await supabase.from("generated_quizzes").insert({
      user_id: userId,
      section: input.section,
      title: input.title,
      content: input.content as unknown as Json,
      score: input.score ?? null
    });
  });
}

export async function saveStudyFileToSupabase(
  item: StudyLibraryItem,
  aiSummary?: LibraryQuiz
) {
  await withSupabaseUser(async (supabase, userId) => {
    await supabase.from("study_files").insert({
      user_id: userId,
      file_name: item.name,
      folder: item.folder,
      mime_type: item.type,
      size_bytes: item.size,
      text_preview: item.textPreview.slice(0, 2000),
      ai_summary: aiSummary ? (aiSummary as unknown as Json) : null
    });
  });
}

async function withSupabaseUser(
  handler: (
    supabase: NonNullable<ReturnType<typeof getSupabaseBrowserClient>>,
    userId: string
  ) => Promise<void>
) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return;
  }

  try {
    const userId = await ensureAuthenticatedUser(supabase);
    await handler(supabase, userId);
  } catch {
    // Supabase sync is best-effort; localStorage remains the fallback.
  }
}
