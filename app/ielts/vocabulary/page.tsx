"use client";

import { useState } from "react";
import { CheckCircle2, FileText, RotateCcw, XCircle } from "lucide-react";
import { PlatformShell } from "@/components/PlatformShell";
import { createProgressEvent } from "@/lib/ielts";
import { saveProgressEvent } from "@/lib/ielts-storage";
import { saveIeltsProgressToSupabase } from "@/lib/supabase/ielts-sync";

const words = [
  {
    word: "mitigate",
    meaning: "make a problem less severe",
    example: "Governments can mitigate traffic congestion by improving public transport."
  },
  {
    word: "substantial",
    meaning: "large or important",
    example: "A substantial number of students prefer flexible study schedules."
  },
  {
    word: "allocate",
    meaning: "set aside resources for a purpose",
    example: "Schools should allocate more time to independent reading."
  },
  {
    word: "plausible",
    meaning: "reasonable or believable",
    example: "This is a plausible explanation for the decline in attendance."
  }
];

const quiz = [
  { prompt: "A synonym for reduce the seriousness of a problem", answer: "mitigate" },
  { prompt: "To distribute resources for a purpose", answer: "allocate" },
  { prompt: "Large enough to matter", answer: "substantial" }
];

export default function VocabularyPage() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const current = words[index];

  function check() {
    setChecked(true);
    const correct = quiz.filter((item) => normalize(answers[item.prompt]) === item.answer).length;
    const progressEvent = createProgressEvent(
      "vocabulary",
      "Vocabulary",
      `Vocabulary drill ${correct}/${quiz.length}`,
      20,
      5 + correct
    );
    saveProgressEvent(progressEvent);
    void saveIeltsProgressToSupabase(progressEvent);
  }

  return (
    <PlatformShell
      eyebrow="Vocabulary"
      title="Build controlled academic vocabulary"
      description="Practice high-value IELTS vocabulary with meanings, examples, recall checks, and progress logging."
    >
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <FileText className="h-7 w-7 text-mana" />
            <p className="text-sm font-black uppercase text-slate-500">
              Flashcard {index + 1}/{words.length}
            </p>
          </div>
          <h2 className="mt-6 text-4xl font-black text-ink dark:text-white">
            {current.word}
          </h2>
          <p className="mt-4 text-lg font-bold text-slate-700 dark:text-slate-300">
            {current.meaning}
          </p>
          <p className="mt-4 rounded-md bg-[#edf5ff] p-4 leading-7 text-slate-700 dark:bg-mana/10 dark:text-slate-200">
            {current.example}
          </p>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => setIndex((value) => (value + words.length - 1) % words.length)}
              className="focus-ring flex-1 rounded-md border border-slate-300 px-4 py-3 text-sm font-black text-ink dark:border-slate-700 dark:text-white"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setIndex((value) => (value + 1) % words.length)}
              className="focus-ring flex-1 rounded-md bg-ink px-4 py-3 text-sm font-black text-white"
            >
              Next
            </button>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-2xl font-black text-ink dark:text-white">Recall drill</h2>
          <div className="mt-5 space-y-4">
            {quiz.map((item) => {
              const correct = normalize(answers[item.prompt]) === item.answer;
              return (
                <label key={item.prompt} className="block rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                  <span className="flex items-center justify-between gap-3 font-bold text-slate-700 dark:text-slate-300">
                    {item.prompt}
                    {checked ? (
                      correct ? <CheckCircle2 className="h-5 w-5 text-meadow" /> : <XCircle className="h-5 w-5 text-ember" />
                    ) : null}
                  </span>
                  <input
                    value={answers[item.prompt] ?? ""}
                    onChange={(event) =>
                      setAnswers((currentAnswers) => ({
                        ...currentAnswers,
                        [item.prompt]: event.target.value
                      }))
                    }
                    className="focus-ring mt-3 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-ink outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    placeholder="Type the word"
                  />
                  {checked && !correct ? (
                    <p className="mt-2 text-sm font-bold text-ember">Answer: {item.answer}</p>
                  ) : null}
                </label>
              );
            })}
          </div>
          <div className="mt-5 flex gap-3">
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
              Check
            </button>
          </div>
        </section>
      </div>
    </PlatformShell>
  );
}

function normalize(value: string | undefined) {
  return (value ?? "").trim().toLowerCase();
}
