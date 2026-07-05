"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  type DailyTime,
  DEFAULT_PROFILE,
  type GameProfile,
  type StudyLevel,
  STORAGE_KEY,
  type Subject,
  type TutorMessage,
  getBossXpAward,
  getTodayKey,
  isYesterday,
  normalizeProfile,
  withAchievements
} from "@/lib/game";

function saveProfile(profile: GameProfile) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Private browsing and storage quotas should not break the app experience.
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

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      const loaded = stored ? normalizeProfile(JSON.parse(stored)) : DEFAULT_PROFILE;
      setProfileState(loaded);
      saveProfile(loaded);
    } catch {
      setProfileState(DEFAULT_PROFILE);
    } finally {
      setHydrated(true);
    }
  }, []);

  const updateProfile = useCallback((updater: (profile: GameProfile) => GameProfile) => {
    setProfileState((current) => {
      const next = withAchievements(updater(current));
      saveProfile(next);
      return next;
    });
  }, []);

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
    (questId: string, xpAward: number, dateKey = getTodayKey()) => {
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
    },
    [updateProfile]
  );

  const finishBossQuiz = useCallback(
    (score: number) => {
      const passed = score >= 3;
      const xpAwarded = getBossXpAward(score);

      updateProfile((current) => ({
        ...current,
        xp: current.xp + xpAwarded,
        bossAttempts: current.bossAttempts + 1,
        bossWins: current.bossWins + (passed ? 1 : 0)
      }));

      return { passed, xpAwarded };
    },
    [updateProfile]
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
