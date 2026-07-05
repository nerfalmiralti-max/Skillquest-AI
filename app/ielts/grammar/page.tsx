"use client";

import { useState } from "react";
import { CheckCircle2, RotateCcw, SpellCheck, XCircle } from "lucide-react";
import { PlatformShell } from "@/components/PlatformShell";
import { createProgressEvent } from "@/lib/ielts";
import { saveProgressEvent } from "@/lib/ielts-storage";
import { saveIeltsProgressToSupabase } from "@/lib/supabase/ielts-sync";

const drills = [
  {
    sentence: "Many student prefer study online because it save time.",
    answer: "Many students prefer studying online because it saves time.",
    rule: "Plural nouns, gerund after prefer, and subject-verb agreement."
  },
  {
    sentence: "Although the chart increased, but the conclusion was unclear.",
    answer: "Although the chart increased, the conclusion was unclear.",
    rule: "Do not use 'although' and 'but' to connect the same contrast."
  },
  {
    sentence: "The number of people were higher in 2020.",
    answer: "The number of people was higher in 2020.",
    rule: "'The number' is singular, so it takes 'was'."
  }
];

export default function GrammarPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);

  function check() {
    setChecked(true);
    const correct = drills.filter((item) => normalize(answers[item.sentence]) === normalize(item.answer)).length;
    const progressEvent = createProgressEvent(
      "grammar",
      "Grammar",
      `Grammar drill ${correct}/${drills.length}`,
      20,
      5 + correct
    );
    saveProgressEvent(progressEvent);
    void saveIeltsProgressToSupabase(progressEvent);
  }

  return (
    <PlatformShell
      eyebrow="Grammar"
      title="Fix IELTS grammar under exam conditions"
      description="Practice sentence correction for common IELTS writing and speaking errors: agreement, clauses, contrast, articles, and sentence control."
    >
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5 flex items-center gap-3">
          <SpellCheck className="h-7 w-7 text-meadow" />
          <h2 className="text-2xl font-black text-ink dark:text-white">Correction drill</h2>
        </div>
        <div className="space-y-4">
          {drills.map((item, index) => {
            const correct = normalize(answers[item.sentence]) === normalize(item.answer);
            return (
              <article key={item.sentence} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black uppercase text-mana">Sentence {index + 1}</p>
                    <h3 className="mt-2 font-black leading-7 text-ink dark:text-white">
                      {item.sentence}
                    </h3>
                  </div>
                  {checked ? (
                    correct ? <CheckCircle2 className="h-5 w-5 text-meadow" /> : <XCircle className="h-5 w-5 text-ember" />
                  ) : null}
                </div>
                <input
                  value={answers[item.sentence] ?? ""}
                  onChange={(event) =>
                    setAnswers((current) => ({
                      ...current,
                      [item.sentence]: event.target.value
                    }))
                  }
                  className="focus-ring mt-3 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-ink outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  placeholder="Rewrite the sentence correctly"
                />
                {checked ? (
                  <div className="mt-3 rounded-md bg-[#fbfaf7] p-3 text-sm text-slate-700 dark:bg-slate-950 dark:text-slate-300">
                    <p className="font-black text-ink dark:text-white">Answer: {item.answer}</p>
                    <p className="mt-1">{item.rule}</p>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              setAnswers({});
              setChecked(false);
            }}
            className="focus-ring inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-3 text-sm font-black text-ink dark:border-slate-700 dark:text-white"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
          <button
            type="button"
            onClick={check}
            className="focus-ring inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-ember px-4 py-3 text-sm font-black text-white"
          >
            <CheckCircle2 className="h-4 w-4" />
            Check Grammar
          </button>
        </div>
      </section>
    </PlatformShell>
  );
}

function normalize(value: string | undefined) {
  return (value ?? "").trim().toLowerCase().replace(/[.]/g, "");
}
