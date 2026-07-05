"use client";

import { FormEvent, useState } from "react";
import { BookOpen, CheckCircle2, Loader2, RefreshCw, XCircle } from "lucide-react";
import { PlatformShell } from "@/components/PlatformShell";
import {
  createProgressEvent,
  FALLBACK_READING_TEST,
  type ReadingTest
} from "@/lib/ielts";
import { saveProgressEvent } from "@/lib/ielts-storage";
import {
  saveGeneratedQuizToSupabase,
  saveIeltsProgressToSupabase
} from "@/lib/supabase/ielts-sync";

export default function ReadingTestsPage() {
  const [topic, setTopic] = useState("education, memory, and technology");
  const [difficulty, setDifficulty] = useState("Band 7");
  const [test, setTest] = useState<ReadingTest>(FALLBACK_READING_TEST);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  async function generateTest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setChecked(false);
    setAnswers({});
    const response = await fetch("/api/ielts/reading", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, difficulty })
    });
    const generated = (await response.json()) as ReadingTest;
    setTest(generated);
    void saveGeneratedQuizToSupabase({
      section: "Reading",
      title: generated.title,
      content: generated
    });
    setLoading(false);
  }

  function checkAnswers() {
    setChecked(true);
    const correct = test.questions.filter((question) =>
      normalize(answers[question.id]) === normalize(question.answer)
    ).length;
    const score = Math.round((correct / test.questions.length) * 90) / 10;
    const progressEvent = createProgressEvent(
      "reading",
      "Reading",
      `Reading test ${correct}/${test.questions.length}`,
      35,
      score
    );
    saveProgressEvent(progressEvent);
    void saveIeltsProgressToSupabase(progressEvent);
  }

  return (
    <PlatformShell
      eyebrow="AI Reading Tests"
      title="Generate original IELTS reading practice"
      description="Create difficult IELTS-style reading passages with True/False/Not Given, Matching Headings, Multiple Choice, and Sentence Completion questions."
      action={
        <form onSubmit={generateTest} className="flex flex-col gap-2 sm:flex-row">
          <input
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            className="focus-ring rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-ink shadow-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            aria-label="Reading topic"
          />
          <select
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value)}
            className="focus-ring rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-ink shadow-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            aria-label="Difficulty"
          >
            <option>Band 6</option>
            <option>Band 7</option>
            <option>Band 8</option>
          </select>
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
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-mana" aria-hidden="true" />
            <h2 className="text-2xl font-black text-ink dark:text-white">{test.title}</h2>
          </div>
          <p className="whitespace-pre-line leading-8 text-slate-700 dark:text-slate-300">
            {test.passage}
          </p>
        </article>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-2xl font-black text-ink dark:text-white">Questions</h2>
          <div className="mt-5 space-y-4">
            {test.questions.map((question, index) => {
              const userAnswer = answers[question.id] ?? "";
              const correct = normalize(userAnswer) === normalize(question.answer);
              return (
                <article key={question.id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase text-mana">
                        {index + 1}. {question.type}
                      </p>
                      <h3 className="mt-2 font-black leading-7 text-ink dark:text-white">
                        {question.question}
                      </h3>
                    </div>
                    {checked ? (
                      correct ? (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-meadow" />
                      ) : (
                        <XCircle className="h-5 w-5 shrink-0 text-ember" />
                      )
                    ) : null}
                  </div>
                  {question.options ? (
                    <div className="mt-3 grid gap-2">
                      {question.options.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            setAnswers((current) => ({
                              ...current,
                              [question.id]: option
                            }))
                          }
                          className={`focus-ring rounded-md border px-3 py-2 text-left text-sm font-bold ${
                            userAnswer === option
                              ? "border-mana bg-[#edf5ff] text-ink dark:bg-mana/10 dark:text-white"
                              : "border-slate-200 text-slate-700 dark:border-slate-800 dark:text-slate-300"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <input
                      value={userAnswer}
                      onChange={(event) =>
                        setAnswers((current) => ({
                          ...current,
                          [question.id]: event.target.value
                        }))
                      }
                      className="focus-ring mt-3 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-ink outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      placeholder="Your answer"
                    />
                  )}
                  {checked ? (
                    <div className="mt-3 rounded-md bg-[#fbfaf7] p-3 text-sm text-slate-700 dark:bg-slate-950 dark:text-slate-300">
                      <p className="font-black text-ink dark:text-white">
                        Answer: {question.answer}
                      </p>
                      <p className="mt-1">{question.explanation}</p>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
          <button
            type="button"
            onClick={checkAnswers}
            className="focus-ring mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-ink px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-slate-700"
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Check Answers
          </button>
        </section>
      </div>
    </PlatformShell>
  );
}

function normalize(value: string | undefined) {
  return (value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}
