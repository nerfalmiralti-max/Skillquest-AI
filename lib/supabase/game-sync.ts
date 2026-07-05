"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  type AchievementId,
  DEFAULT_PROFILE,
  type GameProfile,
  type Subject,
  type TutorMessage,
  normalizeProfile,
  withAchievements
} from "@/lib/game";
import type { Database } from "@/lib/supabase/types";

type SkillQuestClient = SupabaseClient<Database>;

export type QuizResultInput = {
  subject: Subject | null;
  score: number;
  totalQuestions: number;
  xpAwarded: number;
  passed: boolean;
};

export type QuestCompletionInput = {
  questId: string;
  dateKey: string;
  subject: Subject | null;
  xpAwarded: number;
  title?: string | null;
};

export async function ensureAuthenticatedUser(supabase: SkillQuestClient) {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (user) {
    return user.id;
  }

  const {
    data: { user: anonymousUser },
    error: anonymousError
  } = await supabase.auth.signInAnonymously();

  if (anonymousError || !anonymousUser) {
    throw anonymousError ?? new Error("Supabase anonymous authentication failed.");
  }

  return anonymousUser.id;
}

export async function loadSupabaseProfile(
  supabase: SkillQuestClient,
  userId: string
) {
  const [profileResult, questsResult, achievementsResult] = await Promise.all([
    supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle(),
    supabase.from("quests").select("date_key, quest_id").eq("user_id", userId),
    supabase
      .from("achievements")
      .select("achievement_id, unlocked_at")
      .eq("user_id", userId)
  ]);

  if (profileResult.error) {
    throw profileResult.error;
  }
  if (questsResult.error) {
    throw questsResult.error;
  }
  if (achievementsResult.error) {
    throw achievementsResult.error;
  }

  if (!profileResult.data && questsResult.data.length === 0) {
    return null;
  }

  const completedQuests = questsResult.data.reduce<Record<string, string[]>>(
    (acc, quest) => {
      acc[quest.date_key] = [...(acc[quest.date_key] ?? []), quest.quest_id];
      return acc;
    },
    {}
  );

  const achievementsUnlocked = achievementsResult.data.reduce<
    Partial<Record<AchievementId, string>>
  >((acc, achievement) => {
    acc[achievement.achievement_id] = achievement.unlocked_at;
    return acc;
  }, {});

  return normalizeProfile({
    ...DEFAULT_PROFILE,
    subject: profileResult.data?.subject ?? null,
    level: profileResult.data?.level ?? null,
    dailyTime: profileResult.data?.daily_time ?? null,
    xp: profileResult.data?.xp ?? 0,
    streak: profileResult.data?.streak ?? 0,
    lastQuestDate: profileResult.data?.last_quest_date ?? null,
    bossAttempts: profileResult.data?.boss_attempts ?? 0,
    bossWins: profileResult.data?.boss_wins ?? 0,
    tutorMessages: sanitizeTutorMessages(profileResult.data?.tutor_messages),
    completedQuests,
    achievementsUnlocked
  });
}

export async function saveSupabaseProfile(
  supabase: SkillQuestClient,
  userId: string,
  profile: GameProfile
) {
  const normalized = withAchievements(profile);
  const now = new Date().toISOString();

  const { error: profileError } = await supabase.from("profiles").upsert({
    user_id: userId,
    subject: normalized.subject,
    level: normalized.level,
    daily_time: normalized.dailyTime,
    xp: normalized.xp,
    streak: normalized.streak,
    last_quest_date: normalized.lastQuestDate,
    boss_attempts: normalized.bossAttempts,
    boss_wins: normalized.bossWins,
    tutor_messages: normalized.tutorMessages,
    updated_at: now
  });

  if (profileError) {
    throw profileError;
  }

  const questRows = Object.entries(normalized.completedQuests).flatMap(
    ([dateKey, questIds]) =>
      questIds.map((questId) => ({
        user_id: userId,
        quest_id: questId,
        date_key: dateKey,
        subject: normalized.subject,
        xp_awarded: 0
      }))
  );

  if (questRows.length > 0) {
    const { error } = await supabase
      .from("quests")
      .upsert(questRows, {
        onConflict: "user_id,date_key,quest_id",
        ignoreDuplicates: true
      });

    if (error) {
      throw error;
    }
  }

  const achievementRows = Object.entries(normalized.achievementsUnlocked).map(
    ([achievementId, unlockedAt]) => ({
      user_id: userId,
      achievement_id: achievementId as AchievementId,
      unlocked_at: unlockedAt ?? now
    })
  );

  if (achievementRows.length > 0) {
    const { error } = await supabase
      .from("achievements")
      .upsert(achievementRows, { onConflict: "user_id,achievement_id" });

    if (error) {
      throw error;
    }
  }
}

export async function recordSupabaseQuestCompletion(
  supabase: SkillQuestClient,
  userId: string,
  quest: QuestCompletionInput
) {
  const { error } = await supabase.from("quests").upsert(
    {
      user_id: userId,
      quest_id: quest.questId,
      date_key: quest.dateKey,
      title: quest.title ?? null,
      subject: quest.subject,
      xp_awarded: quest.xpAwarded
    },
    { onConflict: "user_id,date_key,quest_id" }
  );

  if (error) {
    throw error;
  }
}

export async function recordSupabaseQuizResult(
  supabase: SkillQuestClient,
  userId: string,
  result: QuizResultInput
) {
  const { error } = await supabase.from("quiz_results").insert({
    user_id: userId,
    subject: result.subject,
    score: result.score,
    total_questions: result.totalQuestions,
    xp_awarded: result.xpAwarded,
    passed: result.passed
  });

  if (error) {
    throw error;
  }
}

export function mergeProfiles(local: GameProfile, remote: GameProfile | null) {
  if (!remote) {
    return withAchievements(local);
  }

  return withAchievements({
    subject: remote.subject ?? local.subject,
    level: remote.level ?? local.level,
    dailyTime: remote.dailyTime ?? local.dailyTime,
    xp: Math.max(remote.xp, local.xp),
    streak: Math.max(remote.streak, local.streak),
    lastQuestDate: remote.lastQuestDate ?? local.lastQuestDate,
    completedQuests: mergeQuestRecords(local.completedQuests, remote.completedQuests),
    bossAttempts: Math.max(remote.bossAttempts, local.bossAttempts),
    bossWins: Math.max(remote.bossWins, local.bossWins),
    achievementsUnlocked: {
      ...local.achievementsUnlocked,
      ...remote.achievementsUnlocked
    },
    tutorMessages: dedupeMessages([
      ...local.tutorMessages,
      ...remote.tutorMessages
    ]).slice(-12)
  });
}

function mergeQuestRecords(
  local: GameProfile["completedQuests"],
  remote: GameProfile["completedQuests"]
) {
  const merged: GameProfile["completedQuests"] = { ...local };

  Object.entries(remote).forEach(([dateKey, questIds]) => {
    merged[dateKey] = Array.from(new Set([...(merged[dateKey] ?? []), ...questIds]));
  });

  return merged;
}

function dedupeMessages(messages: TutorMessage[]) {
  const seen = new Set<string>();

  return messages.filter((message) => {
    if (seen.has(message.id)) {
      return false;
    }
    seen.add(message.id);
    return true;
  });
}

function sanitizeTutorMessages(value: unknown) {
  return Array.isArray(value) ? value : [];
}
