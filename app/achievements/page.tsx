"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Lock, Medal, ShieldCheck, Sparkles } from "lucide-react";
import { useGameState } from "@/hooks/useGameState";
import { ACHIEVEMENTS, getTotalCompletedQuests } from "@/lib/game";

const accentClasses = {
  meadow: "bg-[#ecfbf5] text-meadow border-meadow/30",
  coin: "bg-[#fff7e5] text-coin border-coin/30",
  ember: "bg-[#fff1ed] text-ember border-ember/30",
  mana: "bg-[#edf5ff] text-mana border-mana/30"
};

export default function AchievementsPage() {
  const { profile } = useGameState();
  const totalQuests = getTotalCompletedQuests(profile);

  function metricFor(id: string) {
    if (id === "firstQuest") {
      return `${Math.min(totalQuests, 1)}/1 quest`;
    }
    if (id === "hundredXp") {
      return `${Math.min(profile.xp, 100)}/100 XP`;
    }
    if (id === "bossDefeated") {
      return `${Math.min(profile.bossWins, 1)}/1 win`;
    }
    return `${Math.min(profile.streak, 3)}/3 days`;
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#fbfaf7] py-8 sm:py-12">
      <div className="section-shell">
        <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-black uppercase text-meadow">Achievements</p>
            <h1 className="mt-2 text-4xl font-black text-ink sm:text-5xl">
              Badge vault
            </h1>
            <p className="mt-4 max-w-2xl leading-7 text-slate-600">
              Badges unlock automatically when your saved progress reaches each
              milestone.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-slate-700"
          >
            Return to Quests
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {ACHIEVEMENTS.map((achievement) => {
            const unlockedAt = profile.achievementsUnlocked[achievement.id];
            const unlocked = Boolean(unlockedAt);
            return (
              <article
                key={achievement.id}
                className={`rounded-lg border p-6 shadow-sm transition ${
                  unlocked
                    ? `${accentClasses[achievement.accent]} shadow-lift`
                    : "border-slate-200 bg-white text-slate-500"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    className={`grid h-14 w-14 place-items-center rounded-md ${
                      unlocked ? "bg-white" : "bg-slate-100"
                    }`}
                  >
                    {achievement.id === "bossDefeated" ? (
                      <ShieldCheck className="h-8 w-8" aria-hidden="true" />
                    ) : achievement.id === "threeDayStreak" ? (
                      <Sparkles className="h-8 w-8" aria-hidden="true" />
                    ) : (
                      <Medal className="h-8 w-8" aria-hidden="true" />
                    )}
                  </div>
                  {unlocked ? (
                    <BadgeCheck className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Lock className="h-6 w-6" aria-hidden="true" />
                  )}
                </div>
                <h2 className="mt-5 text-2xl font-black text-ink">{achievement.title}</h2>
                <p className="mt-3 leading-7 text-slate-600">{achievement.description}</p>
                <div className="mt-5 rounded-md bg-white/80 px-3 py-2 text-sm font-black text-ink shadow-sm">
                  {unlocked
                    ? `Unlocked ${new Date(unlockedAt as string).toLocaleDateString()}`
                    : metricFor(achievement.id)}
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
