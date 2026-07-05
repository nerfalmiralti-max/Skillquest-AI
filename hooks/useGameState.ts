"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  type DailyTime,
  DEFAULT_PROFILE,
  type GameProfile,
  type StudyLevel,
  STORAGE_KEY,
  type Subject,
  type TutorMessage,
  getActiveSubject,
  getBossXpAward,
  getTodayKey,
  isYesterday,
  normalizeProfile,
  withAchievements
} from "@/lib/game";
import {
  ensureAuthenticatedUser,
  loadSupabaseProfile,
  mergeProfiles,
  recordSupabaseQuestCompletion,
  recordSupabaseQuizResult,
  saveSupabaseProfile
} from "@/lib/supabase/game-sync";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type SupabaseSyncContext = {
  client: SupabaseClient<Database>;
  userId: string;
};

function saveLocalProfile(profile: GameProfile) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Private browsing and storage quotas should not break the app experience.
  }
}

function loadLocalProfile() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? normalizeProfile(JSON.parse(stored)) : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

function createTutorMessage(role: TutorMessage["role"], content: string): TutorMessage {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`;

  return {
    id: random,
    role,
    content,
    createdAt: new Date().toISOString()
  };
}

export function useGameState() {
  const [profile, setProfileState] = useState<GameProfile>(DEFAULT_PROFILE);
  const [hydrated, setHydrated] = useState(false);
  const syncContextRef = useRef<SupabaseSyncContext | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function hydrateProfile() {
      const localProfile = loadLocalProfile();
      setProfileState(localProfile);
      saveLocalProfile(localProfile);

      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        setHydrated(true);
        return;
      }

      try {
        const userId = await ensureAuthenticatedUser(supabase);
        const remoteProfile = await loadSupabaseProfile(supabase, userId);
        const mergedProfile = mergeProfiles(localProfile, remoteProfile);

        if (cancelled) {
          return;
        }

        syncContextRef.current = { client: supabase, userId };
        setProfileState(mergedProfile);
        saveLocalProfile(mergedProfile);
        void saveSupabaseProfile(supabase, userId, mergedProfile).catch(() => undefined);
      } catch {
        syncContextRef.current = null;
      } finally {
        if (!cancelled) {
          setHydrated(true);
        }
      }
    }

    void hydrateProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  const persistProfile = useCallback((next: GameProfile) => {
    saveLocalProfile(next);

    const syncContext = syncContextRef.current;
    if (syncContext) {
      void saveSupabaseProfile(syncContext.client, syncContext.userId, next).catch(
        () => undefined
      );
    }
  }, []);

  const updateProfile = useCallback((updater: (profile: GameProfile) => GameProfile) => {
    setProfileState((current) => {
      const next = withAchievements(updater(current));
      persistProfile(next);
      return next;
    });
  }, [persistProfile]);

  const setOnboarding = useCallback(
    (subject: Subject, level: StudyLevel, dailyTime: DailyTime) => {
      updateProfile((current) => ({
        ...current,
        subject,
        level,
        dailyTime
      }));
    },
    [updateProfile]
  );

  const completeQuest = useCallback(
    (questId: string, xpAward: number, dateKey = getTodayKey(), title?: string) => {
      updateProfile((current) => {
        const completedToday = current.completedQuests[dateKey] ?? [];
        if (completedToday.includes(questId)) {
          return current;
        }

        const isFirstQuestToday = completedToday.length === 0;
        let streak = current.streak;
        if (isFirstQuestToday) {
          if (current.lastQuestDate === dateKey) {
            streak = Math.max(streak, 1);
          } else if (current.lastQuestDate && isYesterday(current.lastQuestDate, dateKey)) {
            streak += 1;
          } else {
            streak = 1;
          }
        }

        return {
          ...current,
          xp: current.xp + xpAward,
          streak,
          lastQuestDate: isFirstQuestToday ? dateKey : current.lastQuestDate,
          completedQuests: {
            ...current.completedQuests,
            [dateKey]: [...completedToday, questId]
          }
        };
      });

      const syncContext = syncContextRef.current;
      if (syncContext) {
        void recordSupabaseQuestCompletion(syncContext.client, syncContext.userId, {
          questId,
          dateKey,
          title,
          xpAwarded: xpAward,
          subject: getActiveSubject(profile)
        }).catch(() => undefined);
      }
    },
    [profile, updateProfile]
  );

  const finishBossQuiz = useCallback(
    (score: number, totalQuestions = 5) => {
      const passed = score >= 3;
      const xpAwarded = getBossXpAward(score);

      updateProfile((current) => ({
        ...current,
        xp: current.xp + xpAwarded,
        bossAttempts: current.bossAttempts + 1,
        bossWins: current.bossWins + (passed ? 1 : 0)
      }));

      const syncContext = syncContextRef.current;
      if (syncContext) {
        void recordSupabaseQuizResult(syncContext.client, syncContext.userId, {
          subject: getActiveSubject(profile),
          score,
          totalQuestions,
          xpAwarded,
          passed
        }).catch(() => undefined);
      }

      return { passed, xpAwarded };
    },
    [profile, updateProfile]
  );

  const appendTutorExchange = useCallback(
    (studentMessage: string, tutorReply: string) => {
      updateProfile((current) => ({
        ...current,
        tutorMessages: [
          ...current.tutorMessages,
          createTutorMessage("student", studentMessage),
          createTutorMessage("tutor", tutorReply)
        ].slice(-12)
      }));
    },
    [updateProfile]
  );

  return useMemo(
    () => ({
      profile,
      hydrated,
      setOnboarding,
      completeQuest,
      finishBossQuiz,
      appendTutorExchange
    }),
    [
      appendTutorExchange,
      completeQuest,
      finishBossQuiz,
      hydrated,
      profile,
      setOnboarding
    ]
  );
}
