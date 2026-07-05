"use client";

import { FormEvent, useState } from "react";
import { Loader2, Mic, Send, Sparkles, Volume2 } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { PlatformShell } from "@/components/PlatformShell";
import {
  createProgressEvent,
  type SpeakingFeedback,
  type SpeakingTurn
} from "@/lib/ielts";
import { saveProgressEvent } from "@/lib/ielts-storage";
import {
  saveIeltsProgressToSupabase,
  saveSpeakingToSupabase
} from "@/lib/supabase/ielts-sync";

const starterQuestions = {
  "1": "Do you work or study? What do you enjoy most about it?",
  "2": "Describe a skill you would like to improve. You should say what it is, why it matters, how you plan to improve it, and how you would feel after improving it.",
  "3": "Why do some people find it difficult to continue learning after school?"
};

export default function SpeakingExaminerPage() {
  const [part, setPart] = useState<"1" | "2" | "3">("1");
  const [question, setQuestion] = useState(starterQuestions["1"]);
  const [answer, setAnswer] = useState("");
  const [turns, setTurns] = useState<SpeakingTurn[]>([
    { examiner: starterQuestions["1"] }
  ]);
  const [audioName, setAudioName] = useState("");
  const [feedback, setFeedback] = useState<SpeakingFeedback | null>(null);
  const [loading, setLoading] = useState(false);

  function changePart(nextPart: "1" | "2" | "3") {
    setPart(nextPart);
    setQuestion(starterQuestions[nextPart]);
    setTurns([{ examiner: starterQuestions[nextPart] }]);
    setFeedback(null);
    setAnswer("");
  }

  async function submitAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!answer.trim() || loading) {
      return;
    }

    setLoading(true);
    const nextTurns = [...turns, { examiner: question, candidate: answer }];
    const response = await fetch("/api/ielts/speaking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        part,
        turns: nextTurns,
        answer: audioName
          ? `${answer}\n\nAudio file provided by user: ${audioName}`
          : answer
      })
    });
    const result = (await response.json()) as SpeakingFeedback;
    setFeedback(result);
    setQuestion(result.nextQuestion);
    setTurns([...nextTurns, { examiner: result.nextQuestion }]);
    const progressEvent = createProgressEvent(
      "speaking",
      "Speaking",
      `Speaking band ${result.overallBand}`,
      35,
      result.overallBand
    );
    saveProgressEvent(progressEvent);
    void saveIeltsProgressToSupabase(progressEvent);
    void saveSpeakingToSupabase({
      part,
      turns: [...nextTurns, { examiner: result.nextQuestion }],
      feedback: result
    });
    setAnswer("");
    setLoading(false);
  }

  return (
    <PlatformShell
      eyebrow="AI Speaking Examiner"
      title="Simulate IELTS Speaking Parts 1-3"
      description="Practice with follow-up questions and receive criterion-level feedback. Audio uploads are accepted as session evidence; pronunciation scoring is only estimated when audio evidence can be analyzed."
    >
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid grid-cols-3 gap-2 rounded-md bg-slate-100 p-1 dark:bg-slate-800">
            {(["1", "2", "3"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => changePart(item)}
                className={`focus-ring rounded-md px-3 py-2 text-sm font-black ${
                  part === item
                    ? "bg-white text-ink shadow-sm dark:bg-slate-950 dark:text-white"
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                Part {item}
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-lg border border-mana/25 bg-[#edf5ff] p-5 dark:bg-mana/10">
            <p className="text-sm font-black uppercase text-mana">Examiner asks</p>
            <h2 className="mt-2 text-xl font-black leading-8 text-ink dark:text-white">
              {question}
            </h2>
          </div>

          <label className="mt-5 block">
            <span className="text-sm font-black uppercase text-slate-500">
              Optional audio evidence
            </span>
            <input
              type="file"
              accept="audio/*"
              onChange={(event) => setAudioName(event.target.files?.[0]?.name ?? "")}
              className="mt-2 block w-full text-sm font-semibold text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-ink file:px-4 file:py-2 file:text-sm file:font-black file:text-white dark:text-slate-300"
            />
          </label>
          {audioName ? (
            <div className="mt-3 flex items-center gap-2 rounded-md bg-[#fff7e5] px-3 py-2 text-sm font-bold text-slate-700 dark:bg-coin/10 dark:text-slate-200">
              <Volume2 className="h-4 w-4 text-coin" />
              {audioName}
            </div>
          ) : null}

          <form onSubmit={submitAnswer} className="mt-5">
            <label className="block">
              <span className="text-sm font-black uppercase text-slate-500">
                Your spoken answer transcript
              </span>
              <textarea
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                rows={8}
                className="focus-ring mt-2 w-full resize-none rounded-md border border-slate-300 bg-white px-4 py-3 text-base leading-7 text-ink shadow-sm outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                placeholder="Type what you said, or paste a transcript from your recording..."
              />
            </label>
            <button
              type="submit"
              disabled={loading || !answer.trim()}
              className="focus-ring mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-ember px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#c84e2b] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Send className="h-4 w-4" aria-hidden="true" />
              )}
              Submit Answer
            </button>
          </form>
        </section>

        <section className="space-y-5">
          {feedback ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <MetricCard
                  label="Overall Band"
                  value={feedback.overallBand.toFixed(1)}
                  detail="Estimated speaking score"
                  icon={Sparkles}
                  tone="coin"
                />
                <MetricCard
                  label="Fluency"
                  value={feedback.fluency.toFixed(1)}
                  detail="Flow and development"
                  icon={Mic}
                  tone="mana"
                />
                <MetricCard
                  label="Grammar"
                  value={feedback.grammar.toFixed(1)}
                  detail="Range and accuracy"
                  icon={Mic}
                  tone="meadow"
                />
                <MetricCard
                  label="Pronunciation"
                  value={feedback.pronunciation?.toFixed(1) ?? "Audio needed"}
                  detail="Only scored with usable audio"
                  icon={Volume2}
                  tone="ember"
                />
              </div>

              <Panel title="Examiner Feedback" items={feedback.feedback} />
              <Panel title="Improvement Drills" items={feedback.improvementDrills} />
            </>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <Mic className="mx-auto h-10 w-10 text-ember" aria-hidden="true" />
              <h2 className="mt-4 text-2xl font-black text-ink dark:text-white">
                Answer the examiner question
              </h2>
              <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
                You will get a follow-up question and an estimated IELTS band after
                every answer.
              </p>
            </div>
          )}
        </section>
      </div>
    </PlatformShell>
  );
}

function Panel({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-xl font-black text-ink dark:text-white">{title}</h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="rounded-md bg-[#edf5ff] px-3 py-2 text-sm font-semibold text-slate-700 dark:bg-mana/10 dark:text-slate-200">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
