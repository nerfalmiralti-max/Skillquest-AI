"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Clock, GraduationCap, LibraryBig } from "lucide-react";
import {
  DAILY_TIMES,
  STUDY_LEVELS,
  SUBJECTS,
  type DailyTime,
  type StudyLevel,
  type Subject
} from "@/lib/game";
import { useGameState } from "@/hooks/useGameState";

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, hydrated, setOnboarding } = useGameState();
  const [subject, setSubject] = useState<Subject>("English");
  const [level, setLevel] = useState<StudyLevel>("Beginner");
  const [dailyTime, setDailyTime] = useState<DailyTime>(20);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    setSubject(profile.subject ?? "English");
    setLevel(profile.level ?? "Beginner");
    setDailyTime(profile.dailyTime ?? 20);
  }, [hydrated, profile.dailyTime, profile.level, profile.subject]);

  function saveAndContinue() {
    setOnboarding(subject, level, dailyTime);
    router.push("/dashboard");
  }

  return (
    <main className="quest-grid min-h-[calc(100vh-4rem)] py-10 sm:py-16">
      <div className="section-shell max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-black uppercase text-ember">Onboarding</p>
          <h1 className="mt-3 text-4xl font-black text-ink sm:text-5xl">
            Build your first study campaign.
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-slate-600">
            Pick the subject, difficulty, and daily pace. SkillQuest AI saves it
            locally and opens your dashboard immediately.
          </p>
        </div>

        <div className="grid gap-5">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-md bg-mana text-white">
                <LibraryBig className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-black text-ink">Choose Subject</h2>
                <p className="text-sm text-slate-500">Your quests and quiz adapt to this.</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {SUBJECTS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSubject(item)}
                  className={`focus-ring flex min-h-24 items-center justify-between rounded-md border p-4 text-left font-black transition ${
                    subject === item
                      ? "border-mana bg-[#edf5ff] text-ink shadow-sm"
                      : "border-slate-200 bg-[#fbfaf7] text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <span>{item}</span>
                  {subject === item ? <Check className="h-5 w-5 text-mana" /> : null}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-md bg-meadow text-white">
                <GraduationCap className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-black text-ink">Choose Level</h2>
                <p className="text-sm text-slate-500">Higher levels award more quest XP.</p>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {STUDY_LEVELS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setLevel(item)}
                  className={`focus-ring rounded-md border p-4 text-left transition ${
                    level === item
                      ? "border-meadow bg-[#ecfbf5] text-ink shadow-sm"
                      : "border-slate-200 bg-[#fbfaf7] text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <span className="block text-lg font-black">{item}</span>
                  <span className="mt-2 block text-sm text-slate-600">
                    {item === "Beginner"
                      ? "Gentle foundations"
                      : item === "Intermediate"
                        ? "More applied practice"
                        : "Tougher review loops"}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-md bg-coin text-white">
                <Clock className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-black text-ink">Daily Study Time</h2>
                <p className="text-sm text-slate-500">Quests divide this into three sessions.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {DAILY_TIMES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setDailyTime(item)}
                  className={`focus-ring rounded-md border p-4 text-center transition ${
                    dailyTime === item
                      ? "border-coin bg-[#fff7e5] text-ink shadow-sm"
                      : "border-slate-200 bg-[#fbfaf7] text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <span className="block text-3xl font-black">{item}</span>
                  <span className="text-sm font-bold">minutes</span>
                </button>
              ))}
            </div>
          </section>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={saveAndContinue}
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-ember px-5 py-3 text-base font-black text-white shadow-lift transition hover:bg-[#c84e2b]"
            >
              Save and Open Dashboard
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
