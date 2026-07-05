"use client";

import { FormEvent, useMemo, useState } from "react";
import { CheckCircle2, Headphones, Loader2, Upload, XCircle } from "lucide-react";
import { PlatformShell } from "@/components/PlatformShell";
import {
  createProgressEvent,
  FALLBACK_LISTENING_TEST,
  type ListeningTest
} from "@/lib/ielts";
import { saveProgressEvent } from "@/lib/ielts-storage";
import {
  saveGeneratedQuizToSupabase,
  saveIeltsProgressToSupabase
} from "@/lib/supabase/ielts-sync";

export default function ListeningTestsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [test, setTest] = useState<ListeningTest>(FALLBACK_LISTENING_TEST);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioUrl = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);

  async function generateQuestions(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setChecked(false);
    setAnswers({});
    const response = await fetch("/api/ielts/listening", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName: file?.name, notes })
    });
    const generated = (await response.json()) as ListeningTest;
    setTest(generated);
    void saveGeneratedQuizToSupabase({
      section: "Listening",
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
      "listening",
      "Listening",
      `Listening test ${correct}/${test.questions.length}`,
      35,
      score
    );
    saveProgressEvent(progressEvent);
    void saveIeltsProgressToSupabase(progressEvent);
  }

  return (
    <PlatformShell
      eyebrow="AI Listening Tests"
      title="Upload audio and generate IELTS questions"
      description="Use your own legally available recordings or notes. The app generates original IELTS-style questions, checks answers, and explains mistakes."
    >
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form
          onSubmit={generateQuestions}
          className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-[#fbfaf7] p-6 text-center dark:border-slate-700 dark:bg-slate-950">
            <Upload className="h-8 w-8 text-mana" aria-hidden="true" />
            <span className="mt-3 text-lg font-black text-ink dark:text-white">
              Upload listening audio
            </span>
            <span className="mt-1 text-sm text-slate-500">
              MP3, WAV, M4A, or any browser-playable audio
            </span>
            <input
              type="file"
              accept="audio/*"
              className="sr-only"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </label>

          {file ? (
            <div className="mt-5 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <p className="font-black text-ink dark:text-white">{file.name}</p>
              <p className="mt-1 text-sm text-slate-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <audio className="mt-4 w-full" src={audioUrl} controls />
            </div>
          ) : null}

          <label className="mt-5 block">
            <span className="text-sm font-black uppercase text-slate-500">
              Optional transcript or notes
            </span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={8}
              className="focus-ring mt-2 w-full resize-none rounded-md border border-slate-300 bg-white px-4 py-3 text-base leading-7 text-ink shadow-sm outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              placeholder="Paste a transcript or notes if you have them. Without a transcript, questions are generated from metadata and your notes."
            />
          </label>

          <button
            type="submit"
            disabled={loading || (!file && !notes.trim())}
            className="focus-ring mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-ember px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#c84e2b] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Headphones className="h-4 w-4" aria-hidden="true" />
            )}
            Generate Listening Test
          </button>
        </form>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-2xl font-black text-ink dark:text-white">{test.title}</h2>
          <p className="mt-3 rounded-md bg-[#edf5ff] p-3 text-sm font-semibold text-slate-700 dark:bg-mana/10 dark:text-slate-200">
            {test.transcriptPrompt}
          </p>

          <div className="mt-5 space-y-4">
            {test.questions.map((question, index) => {
              const userAnswer = answers[question.id] ?? "";
              const correct = normalize(userAnswer) === normalize(question.answer);
              return (
                <article key={question.id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-black leading-7 text-ink dark:text-white">
                      {index + 1}. {question.question}
                    </h3>
                    {checked ? (
                      correct ? (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-meadow" />
                      ) : (
                        <XCircle className="h-5 w-5 shrink-0 text-ember" />
                      )
                    ) : null}
                  </div>
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
