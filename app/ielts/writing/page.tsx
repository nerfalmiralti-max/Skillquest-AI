"use client";

import { FormEvent, useState } from "react";
import { Loader2, PenLine, Save, Sparkles } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { PlatformShell } from "@/components/PlatformShell";
import { createProgressEvent, type WritingFeedback } from "@/lib/ielts";
import { saveProgressEvent } from "@/lib/ielts-storage";
import {
  saveEssayToSupabase,
  saveIeltsProgressToSupabase
} from "@/lib/supabase/ielts-sync";

const samplePrompt =
  "Some people believe that students should focus on academic subjects, while others think practical skills are more important. Discuss both views and give your opinion.";

export default function WritingCheckerPage() {
  const [taskType, setTaskType] = useState<"task1" | "task2">("task2");
  const [prompt, setPrompt] = useState(samplePrompt);
  const [essay, setEssay] = useState("");
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!essay.trim() || loading) {
      return;
    }

    setLoading(true);
    const response = await fetch("/api/ielts/writing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskType, prompt, essay })
    });
    const result = (await response.json()) as WritingFeedback;
    setFeedback(result);
    const progressEvent = createProgressEvent(
      "writing",
      taskType === "task1" ? "Writing Task 1" : "Writing Task 2",
      `Writing checker band ${result.overallBand}`,
      45,
      result.overallBand
    );
    saveProgressEvent(progressEvent);
    void saveIeltsProgressToSupabase(progressEvent);
    void saveEssayToSupabase({
      taskType,
      prompt,
      essay,
      feedback: result
    });
    setLoading(false);
  }

  return (
    <PlatformShell
      eyebrow="AI Writing Checker"
      title="IELTS writing feedback with band descriptors"
      description="Submit Task 1 or Task 2 writing and receive criterion-level scores, mistake explanations, rewrites, vocabulary upgrades, and grammar improvements."
    >
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="grid grid-cols-2 gap-2 rounded-md bg-slate-100 p-1 dark:bg-slate-800">
            {(["task1", "task2"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTaskType(item)}
                className={`focus-ring rounded-md px-3 py-2 text-sm font-black ${
                  taskType === item
                    ? "bg-white text-ink shadow-sm dark:bg-slate-950 dark:text-white"
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                {item === "task1" ? "Task 1" : "Task 2"}
              </button>
            ))}
          </div>

          <label className="mt-5 block">
            <span className="text-sm font-black uppercase text-slate-500">
              Question prompt
            </span>
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={4}
              className="focus-ring mt-2 w-full resize-none rounded-md border border-slate-300 bg-white px-4 py-3 text-base text-ink shadow-sm outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>

          <label className="mt-5 block">
            <span className="text-sm font-black uppercase text-slate-500">
              Your answer
            </span>
            <textarea
              value={essay}
              onChange={(event) => setEssay(event.target.value)}
              rows={14}
              className="focus-ring mt-2 w-full resize-none rounded-md border border-slate-300 bg-white px-4 py-3 text-base leading-7 text-ink shadow-sm outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              placeholder="Paste or write your IELTS essay here..."
            />
          </label>

          <button
            type="submit"
            disabled={loading || essay.trim().length < 40}
            className="focus-ring mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-ember px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#c84e2b] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <PenLine className="h-4 w-4" aria-hidden="true" />
            )}
            Check Writing
          </button>
        </form>

        <section className="space-y-5">
          {feedback ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <MetricCard
                  label="Overall Band"
                  value={feedback.overallBand.toFixed(1)}
                  detail="Estimated score"
                  icon={Sparkles}
                  tone="coin"
                />
                <MetricCard
                  label="Task Response"
                  value={feedback.taskResponse.toFixed(1)}
                  detail="Task achievement and development"
                  icon={Save}
                  tone="mana"
                />
                <MetricCard
                  label="Coherence"
                  value={feedback.coherenceCohesion.toFixed(1)}
                  detail="Paragraphing and linking"
                  icon={Save}
                  tone="meadow"
                />
                <MetricCard
                  label="Language"
                  value={`${feedback.lexicalResource.toFixed(1)} / ${feedback.grammar.toFixed(1)}`}
                  detail="Vocabulary and grammar"
                  icon={Save}
                  tone="ember"
                />
              </div>

              <Panel title="Examiner Summary">
                <p className="leading-7 text-slate-700 dark:text-slate-300">
                  {feedback.summary}
                </p>
              </Panel>

              <Panel title="Mistakes Explained">
                <ul className="space-y-3">
                  {feedback.mistakes.map((mistake) => (
                    <li key={mistake} className="rounded-md bg-[#fff1ed] p-3 text-sm font-semibold text-slate-700 dark:bg-ember/10 dark:text-slate-200">
                      {mistake}
                    </li>
                  ))}
                </ul>
              </Panel>

              <Panel title="Weak Sentence Rewrites">
                <div className="space-y-3">
                  {feedback.rewrites.map((rewrite) => (
                    <article key={rewrite.improved} className="rounded-md border border-slate-200 p-4 dark:border-slate-800">
                      <p className="text-sm text-slate-500">Original: {rewrite.original}</p>
                      <p className="mt-2 font-bold text-ink dark:text-white">
                        Improved: {rewrite.improved}
                      </p>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                        {rewrite.reason}
                      </p>
                    </article>
                  ))}
                </div>
              </Panel>

              <Panel title="Vocabulary and Grammar Upgrades">
                <div className="grid gap-4 md:grid-cols-2">
                  <List title="Advanced vocabulary" items={feedback.vocabulary} />
                  <List title="Grammar improvements" items={feedback.grammarTips} />
                </div>
              </Panel>
            </>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <Sparkles className="mx-auto h-10 w-10 text-coin" aria-hidden="true" />
              <h2 className="mt-4 text-2xl font-black text-ink dark:text-white">
                Your detailed report appears here
              </h2>
              <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
                The checker works with Gemini when configured and uses a structured
                fallback when no API key exists.
              </p>
            </div>
          )}
        </section>
      </div>
    </PlatformShell>
  );
}

function Panel({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-xl font-black text-ink dark:text-white">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="font-black text-ink dark:text-white">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="rounded-md bg-[#edf5ff] px-3 py-2 text-sm font-semibold text-slate-700 dark:bg-mana/10 dark:text-slate-200">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
