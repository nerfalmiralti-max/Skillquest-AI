"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3, LineChart, Target, TrendingUp } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { PlatformShell } from "@/components/PlatformShell";
import { IELTS_SECTIONS, type IeltsProgressEvent } from "@/lib/ielts";
import { loadProgressEvents } from "@/lib/ielts-storage";

export default function AnalyticsPage() {
  const [events, setEvents] = useState<IeltsProgressEvent[]>([]);

  useEffect(() => {
    setEvents(loadProgressEvents());
  }, []);

  const stats = useMemo(() => {
    const now = Date.now();
    const weekAgo = now - 7 * 86400000;
    const monthAgo = now - 30 * 86400000;
    const weekly = events.filter((event) => new Date(event.createdAt).getTime() >= weekAgo);
    const monthly = events.filter((event) => new Date(event.createdAt).getTime() >= monthAgo);
    const xp = events.reduce((total, event) => total + event.xp, 0);
    const scored = events.filter((event) => event.score !== undefined);
    const average =
      scored.length > 0
        ? scored.reduce((total, event) => total + (event.score ?? 0), 0) / scored.length
        : 6;
    const predicted = Math.min(9, Math.round((average + Math.min(0.8, events.length * 0.04)) * 10) / 10);

    return { weekly, monthly, xp, average, predicted };
  }, [events]);

  const sectionCounts = IELTS_SECTIONS.map((section) => ({
    section,
    count: events.filter((event) => event.section === section).length,
    score:
      averageScore(events.filter((event) => event.section === section)) ?? 0
  }));
  const maxCount = Math.max(1, ...sectionCounts.map((item) => item.count));
  const weakest = sectionCounts
    .filter((item) => item.count > 0)
    .sort((a, b) => a.score - b.score)[0];
  const strongest = sectionCounts
    .filter((item) => item.count > 0)
    .sort((a, b) => b.score - a.score)[0];

  return (
    <PlatformShell
      eyebrow="Progress Analytics"
      title="IELTS growth dashboard"
      description="Track weekly and monthly practice volume, strengths, weak skills, XP, and projected IELTS band growth from your saved study events."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Weekly Sessions"
          value={stats.weekly.length}
          detail="Saved this week"
          icon={BarChart3}
          tone="mana"
        />
        <MetricCard
          label="Monthly Sessions"
          value={stats.monthly.length}
          detail="Saved this month"
          icon={LineChart}
          tone="meadow"
        />
        <MetricCard
          label="Practice XP"
          value={stats.xp}
          detail="IELTS platform events"
          icon={Target}
          tone="coin"
        />
        <MetricCard
          label="Predicted Band"
          value={stats.predicted.toFixed(1)}
          detail="Based on recent practice"
          icon={TrendingUp}
          tone="ember"
        />
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-2xl font-black text-ink dark:text-white">Skill coverage</h2>
          <div className="mt-5 space-y-4">
            {sectionCounts.map((item) => (
              <div key={item.section}>
                <div className="mb-2 flex justify-between gap-3 text-sm font-bold text-slate-600 dark:text-slate-300">
                  <span>{item.section}</span>
                  <span>{item.count} sessions</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-mana transition-all"
                    style={{ width: `${(item.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-2xl font-black text-ink dark:text-white">Recommendations</h2>
          <div className="mt-5 space-y-4">
            <Insight
              title="Weak skill"
              value={weakest ? weakest.section : "Start with Writing Task 2"}
              body="Prioritize this area in daily challenges until its average score and practice count improve."
            />
            <Insight
              title="Strength"
              value={strongest ? strongest.section : "Not enough data yet"}
              body="Use your strongest skill to build confidence, but keep a balanced weekly practice plan."
            />
            <Insight
              title="Band improvement"
              value={`Estimated ${stats.average.toFixed(1)} → ${stats.predicted.toFixed(1)}`}
              body="The model is a planning estimate, not an official IELTS score. More scored practice makes it more useful."
            />
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-2xl font-black text-ink dark:text-white">Study history</h2>
        <div className="mt-5 grid gap-3">
          {events.length === 0 ? (
            <p className="rounded-md bg-[#fbfaf7] p-4 text-slate-600 dark:bg-slate-950 dark:text-slate-300">
              Complete a writing check, speaking answer, generated test, library analysis,
              or daily challenge to start analytics.
            </p>
          ) : (
            events.slice(0, 12).map((event) => (
              <div
                key={event.id}
                className="flex flex-col justify-between gap-2 rounded-md border border-slate-200 p-4 dark:border-slate-800 sm:flex-row sm:items-center"
              >
                <div>
                  <p className="font-black text-ink dark:text-white">{event.label}</p>
                  <p className="text-sm text-slate-500">
                    {event.section} • {new Date(event.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-sm font-black text-mana">
                  +{event.xp} XP {event.score !== undefined ? `• Band ${event.score}` : ""}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </PlatformShell>
  );
}

function averageScore(events: IeltsProgressEvent[]) {
  const scored = events.filter((event) => event.score !== undefined);
  if (scored.length === 0) {
    return null;
  }
  return scored.reduce((total, event) => total + (event.score ?? 0), 0) / scored.length;
}

function Insight({
  title,
  value,
  body
}: {
  title: string;
  value: string;
  body: string;
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-[#fbfaf7] p-4 dark:border-slate-800 dark:bg-slate-950">
      <p className="text-sm font-black uppercase text-slate-500">{title}</p>
      <h3 className="mt-1 text-xl font-black text-ink dark:text-white">{value}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{body}</p>
    </article>
  );
}
