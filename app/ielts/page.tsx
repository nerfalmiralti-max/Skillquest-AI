"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarCheck,
  Flame,
  Headphones,
  Library,
  Mic,
  PenLine,
  Sparkles,
  Trophy
} from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { PlatformShell } from "@/components/PlatformShell";
import { ProgressBar } from "@/components/ProgressBar";
import { useGameState } from "@/hooks/useGameState";
import { IELTS_SECTIONS } from "@/lib/ielts";
import { loadProgressEvents } from "@/lib/ielts-storage";
import { getLevelFromXp, getLevelProgress } from "@/lib/game";

const sectionCards = [
  {
    href: "/ielts/listening",
    title: "Listening",
    body: "Upload audio, generate questions, check answers, and review mistakes.",
    icon: Headphones
  },
  {
    href: "/ielts/reading",
    title: "Reading",
    body: "Generate original passages with IELTS-style question types.",
    icon: BookOpen
  },
  {
    href: "/ielts/writing",
    title: "Writing Tasks",
    body: "Get band estimates, rewrites, vocabulary, and grammar feedback.",
    icon: PenLine
  },
  {
    href: "/ielts/speaking",
    title: "Speaking",
    body: "Simulate Parts 1-3 with follow-up questions and band feedback.",
    icon: Mic
  },
  {
    href: "/ielts/library",
    title: "Study Library",
    body: "Upload notes and files, then summarize or generate quizzes.",
    icon: Library
  },
  {
    href: "/ielts/analytics",
    title: "Analytics",
    body: "Track weak skills, weekly volume, XP, and projected band growth.",
    icon: BarChart3
  }
];

export default function IeltsPlatformPage() {
  const { profile } = useGameState();
  const [events, setEvents] = useState<ReturnType<typeof loadProgressEvents>>([]);

  useEffect(() => {
    setEvents(loadProgressEvents());
  }, []);

  const level = getLevelFromXp(profile.xp);
  const progress = getLevelProgress(profile.xp);
  const recentScore = events.find((event) => event.score !== undefined)?.score ?? 6;
  const completedSections = new Set(events.map((event) => event.section)).size;

  return (
    <PlatformShell
      eyebrow="SkillQuest AI IELTS"
      title="Premium IELTS preparation hub"
      description="Practice every IELTS skill with original AI-generated tests, user-uploaded study materials, progress analytics, daily challenges, and fallback-safe AI coaching."
      action={
        <Link
          href="/ielts/daily"
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-ember px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#c84e2b]"
        >
          <CalendarCheck className="h-4 w-4" aria-hidden="true" />
          Today&apos;s Plan
        </Link>
      }
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="IELTS Level"
          value={level}
          detail={`${progress}/100 XP to next level`}
          icon={Trophy}
          tone="coin"
        />
        <MetricCard
          label="Study Streak"
          value={profile.streak}
          detail="Saved through quests and daily work"
          icon={Flame}
          tone="ember"
        />
        <MetricCard
          label="Estimated Band"
          value={recentScore.toFixed(1)}
          detail="Latest scored activity"
          icon={Sparkles}
          tone="mana"
        />
        <MetricCard
          label="Skills Touched"
          value={`${completedSections}/${IELTS_SECTIONS.length}`}
          detail="Across all IELTS modules"
          icon={BarChart3}
          tone="meadow"
        />
      </section>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <ProgressBar value={progress} max={100} label="Level progress" tone="mana" />
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sectionCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="focus-ring group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lift dark:border-slate-800 dark:bg-slate-900"
          >
            <card.icon className="h-7 w-7 text-ember" aria-hidden="true" />
            <h2 className="mt-5 text-xl font-black text-ink dark:text-white">
              {card.title}
            </h2>
            <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
              {card.body}
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-mana">
              Open tool
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </section>
    </PlatformShell>
  );
}
