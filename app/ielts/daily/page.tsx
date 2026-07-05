"use client";

import { FormEvent, useEffect, useState } from "react";
import { CalendarCheck, CheckCircle2, Loader2, RefreshCw, Trophy } from "lucide-react";
import { PlatformShell } from "@/components/PlatformShell";
import { ProgressBar } from "@/components/ProgressBar";
import { createProgressEvent, type DailyChallenge } from "@/lib/ielts";
import {
  loadDailyChallenges,
  saveDailyChallenges,
  saveProgressEvent
} from "@/lib/ielts-storage";
import { saveIeltsProgressToSupabase } from "@/lib/supabase/ielts-sync";

type SavedChallenge = DailyChallenge & {
  id: string;
  completed?: boolean;
};

export default function DailyChallengesPage() {
  const [weakSkill, setWeakSkill] = useState("Writing Task 2");
  const [targetBand, setTargetBand] = useState("7.0");
  const [challenges, setChallenges] = useState<SavedChallenge[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setChallenges(loadDailyChallenges());
  }, []);

  async function generateChallenges(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const response = await fetch("/api/ielts/daily", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weakSkill, targetBand })
    });
    const data = (await response.json()) as { challenges: DailyChallenge[] };
    const saved = data.challenges.map((challenge) => ({
      ...challenge,
      id: crypto.randomUUID(),
      completed: false
    }));
    setChallenges(saved);
    saveDailyChallenges(saved);
    setLoading(false);
  }

  function completeChallenge(id: string) {
    const updated = challenges.map((challenge) =>
      challenge.id === id ? { ...challenge, completed: true } : challenge
    );
    const completed = updated.find((challenge) => challenge.id === id);
    setChallenges(updated);
    saveDailyChallenges(updated);
    if (completed) {
      const progressEvent = createProgressEvent(
        "daily",
        completed.section,
        completed.title,
        completed.xp
      );
      saveProgressEvent(progressEvent);
      void saveIeltsProgressToSupabase(progressEvent);
    }
  }

  const completedCount = challenges.filter((challenge) => challenge.completed).length;
  const totalXp = challenges
    .filter((challenge) => challenge.completed)
    .reduce((total, challenge) => total + challenge.xp, 0);

  return (
    <PlatformShell
      eyebrow="Daily Challenges"
      title="Personalized IELTS tasks every day"
      description="Generate original daily tasks based on your weak skill and target band. Complete them for XP and weekly progress."
      action={
        <form onSubmit={generateChallenges} className="flex flex-col gap-2 sm:flex-row">
          <input
            value={weakSkill}
            onChange={(event) => setWeakSkill(event.target.value)}
            className="focus-ring rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-ink shadow-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            aria-label="Weak skill"
          />
          <input
            value={targetBand}
            onChange={(event) => setTargetBand(event.target.value)}
            className="focus-ring w-24 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-ink shadow-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            aria-label="Target band"
          />
          <button
            type="submit"
            disabled={loading}
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-ember px-4 py-2 text-sm font-black text-white shadow-sm disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Generate
          </button>
        </form>
      }
    >
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <ProgressBar
            value={completedCount}
            max={Math.max(1, challenges.length)}
            label="Today's challenges"
            tone="meadow"
          />
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-coin" aria-hidden="true" />
            <div>
              <p className="text-sm font-black uppercase text-slate-500">Earned Today</p>
              <p className="text-3xl font-black text-ink dark:text-white">{totalXp} XP</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        {challenges.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-3">
            <CalendarCheck className="mx-auto h-10 w-10 text-mana" />
            <h2 className="mt-4 text-2xl font-black text-ink dark:text-white">
              Generate today&apos;s challenge set
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              The generated tasks are original and designed around your weak skill.
            </p>
          </div>
        ) : (
          challenges.map((challenge) => (
            <article
              key={challenge.id}
              className={`rounded-lg border p-5 shadow-sm ${
                challenge.completed
                  ? "border-meadow bg-[#ecfbf5] dark:bg-meadow/10"
                  : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase text-mana">
                    {challenge.section} • {challenge.minutes} min
                  </p>
                  <h2 className="mt-2 text-xl font-black text-ink dark:text-white">
                    {challenge.title}
                  </h2>
                </div>
                <span className="rounded-full bg-[#fff7e5] px-3 py-1 text-xs font-black text-coin">
                  +{challenge.xp} XP
                </span>
              </div>
              <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
                {challenge.task}
              </p>
              <ul className="mt-4 space-y-2">
                {challenge.successCriteria.map((item) => (
                  <li key={item} className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    • {item}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                disabled={challenge.completed}
                onClick={() => completeChallenge(challenge.id)}
                className="focus-ring mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-meadow"
              >
                <CheckCircle2 className="h-4 w-4" />
                {challenge.completed ? "Completed" : "Complete Challenge"}
              </button>
            </article>
          ))
        )}
      </section>
    </PlatformShell>
  );
}
