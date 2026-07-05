"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Flame,
  Gauge,
  Play,
  Sparkles,
  Trophy,
  Zap
} from "lucide-react";
import { ProgressBar } from "@/components/ProgressBar";
import { useGameState } from "@/hooks/useGameState";
import {
  ACHIEVEMENTS,
  getActiveDailyTime,
  getActiveStudyLevel,
  getActiveSubject,
  getDailyQuests,
  getLevelFromXp,
  getLevelProgress,
  getTodayKey
} from "@/lib/game";

export default function DashboardPage() {
  const { profile, hydrated, completeQuest } = useGameState();
  const todayKey = getTodayKey();
  const quests = getDailyQuests(profile, todayKey);
  const completedToday = profile.completedQuests[todayKey] ?? [];
  const dailyProgress = completedToday.length;
  const level = getLevelFromXp(profile.xp);
  const levelProgress = getLevelProgress(profile.xp);
  const subject = getActiveSubject(profile);
  const studyLevel = getActiveStudyLevel(profile);
  const dailyTime = getActiveDailyTime(profile);
  const unlockedCount = ACHIEVEMENTS.filter(
    (achievement) => profile.achievementsUnlocked[achievement.id]
  ).length;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#fbfaf7] py-8 sm:py-12">
      <div className="section-shell">
        <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-black uppercase text-mana">Dashboard</p>
            <h1 className="mt-2 text-4xl font-black text-ink sm:text-5xl">
              Today&apos;s study route
            </h1>
            <p className="mt-4 max-w-2xl leading-7 text-slate-600">
              {hydrated
                ? `${subject} campaign, ${studyLevel.toLowerCase()} level, ${dailyTime} minutes per day.`
                : "Loading your saved campaign."}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/onboarding"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-black text-ink shadow-sm transition hover:bg-slate-50"
            >
              Adjust Campaign
            </Link>
            <Link
              href="/quiz"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-slate-700"
            >
              Boss Quiz
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-bold uppercase text-slate-500">Total XP</p>
              <Zap className="h-5 w-5 text-coin" aria-hidden="true" />
            </div>
            <p className="mt-3 text-4xl font-black text-ink">{profile.xp}</p>
            <p className="mt-2 text-sm text-slate-500">Earned through quests and bosses</p>
          </article>
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-bold uppercase text-slate-500">Level</p>
              <Gauge className="h-5 w-5 text-mana" aria-hidden="true" />
            </div>
            <p className="mt-3 text-4xl font-black text-ink">{level}</p>
            <div className="mt-4">
              <ProgressBar value={levelProgress} max={100} label="Next level" tone="mana" />
            </div>
          </article>
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-bold uppercase text-slate-500">Streak</p>
              <Flame className="h-5 w-5 text-ember" aria-hidden="true" />
            </div>
            <p className="mt-3 text-4xl font-black text-ink">{profile.streak}</p>
            <p className="mt-2 text-sm text-slate-500">Study days in a row</p>
          </article>
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-bold uppercase text-slate-500">Badges</p>
              <Trophy className="h-5 w-5 text-meadow" aria-hidden="true" />
            </div>
            <p className="mt-3 text-4xl font-black text-ink">
              {unlockedCount}/{ACHIEVEMENTS.length}
            </p>
            <p className="mt-2 text-sm text-slate-500">Achievements unlocked</p>
          </article>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.36fr]">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-bold uppercase text-slate-500">Daily Progress</p>
                <h2 className="mt-1 text-2xl font-black text-ink">3 daily quests</h2>
              </div>
              <div className="min-w-64">
                <ProgressBar value={dailyProgress} max={3} label="Quests complete" tone="meadow" />
              </div>
            </div>

            <div className="mt-5 grid gap-4">
              {quests.map((quest) => {
                const completed = completedToday.includes(quest.id);
                return (
                  <article
                    key={quest.id}
                    className={`rounded-lg border p-5 transition ${
                      completed
                        ? "border-meadow bg-[#ecfbf5]"
                        : "border-slate-200 bg-[#fbfaf7] hover:border-slate-300"
                    }`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-black uppercase text-slate-600 shadow-sm">
                            {quest.tag}
                          </span>
                          <span className="rounded-full bg-[#fff7e5] px-3 py-1 text-xs font-black uppercase text-coin">
                            +{quest.xp} XP
                          </span>
                          <span className="rounded-full bg-[#edf5ff] px-3 py-1 text-xs font-black uppercase text-mana">
                            {quest.minutes} min
                          </span>
                        </div>
                        <h3 className="mt-3 text-xl font-black text-ink">{quest.title}</h3>
                        <p className="mt-2 leading-7 text-slate-600">{quest.description}</p>
                      </div>
                      <button
                        type="button"
                        disabled={completed}
                        onClick={() =>
                          completeQuest(quest.id, quest.xp, todayKey, quest.title)
                        }
                        className={`focus-ring inline-flex min-w-40 items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-black transition ${
                          completed
                            ? "cursor-not-allowed bg-meadow text-white"
                            : "bg-ember text-white shadow-sm hover:bg-[#c84e2b]"
                        }`}
                      >
                        {completed ? (
                          <>
                            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                            Completed
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4" aria-hidden="true" />
                            Complete Quest
                          </>
                        )}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-md bg-ink text-white">
                  <CalendarDays className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase text-slate-500">Today</p>
                  <p className="font-black text-ink">{todayKey}</p>
                </div>
              </div>
              <p className="mt-4 leading-7 text-slate-600">
                Finish one quest to protect your streak. Clear all three before taking
                the boss quiz for the cleanest study loop.
              </p>
            </section>
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-coin" aria-hidden="true" />
                <h2 className="text-lg font-black text-ink">Next unlocks</h2>
              </div>
              <div className="space-y-3">
                {ACHIEVEMENTS.map((achievement) => (
                  <div key={achievement.id} className="flex items-center justify-between gap-3">
                    <span className="text-sm font-bold text-slate-700">{achievement.title}</span>
                    {profile.achievementsUnlocked[achievement.id] ? (
                      <BadgeCheck className="h-5 w-5 text-meadow" aria-hidden="true" />
                    ) : (
                      <span className="text-xs font-black uppercase text-slate-400">Locked</span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
