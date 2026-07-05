"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Check, RotateCcw, Shield, Swords, X, Zap } from "lucide-react";
import { ProgressBar } from "@/components/ProgressBar";
import { useGameState } from "@/hooks/useGameState";
import { getActiveSubject, getBossXpAward, getQuizQuestions } from "@/lib/game";

type QuizResult = {
  score: number;
  xpAwarded: number;
  passed: boolean;
};

export default function BossQuizPage() {
  const { profile, finishBossQuiz } = useGameState();
  const subject = getActiveSubject(profile);
  const questions = useMemo(() => getQuizQuestions(subject), [subject]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<QuizResult | null>(null);

  const question = questions[current];
  const answeredCount = Object.keys(answers).length;
  const selectedAnswer = answers[current];
  const finished = result !== null;

  function selectAnswer(index: number) {
    if (finished) {
      return;
    }
    setAnswers((currentAnswers) => ({ ...currentAnswers, [current]: index }));
  }

  function finishQuiz() {
    const score = questions.reduce(
      (total, item, index) => total + (answers[index] === item.answerIndex ? 1 : 0),
      0
    );
    const award = finishBossQuiz(score, questions.length);
    setResult({
      score,
      xpAwarded: award.xpAwarded,
      passed: award.passed
    });
  }

  function restartQuiz() {
    setCurrent(0);
    setAnswers({});
    setResult(null);
  }

  return (
    <main className="quest-grid min-h-[calc(100vh-4rem)] py-8 sm:py-12">
      <div className="section-shell max-w-5xl">
        <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-black uppercase text-ember">Boss Quiz</p>
            <h1 className="mt-2 text-4xl font-black text-ink sm:text-5xl">
              {subject} boss gate
            </h1>
            <p className="mt-4 max-w-2xl leading-7 text-slate-600">
              Answer five questions. Score at least 3 to defeat the boss and unlock
              the Boss Defeated badge.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-black text-ink shadow-sm transition hover:bg-slate-50"
          >
            Dashboard
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="grid gap-4 border-b border-slate-200 pb-5 md:grid-cols-[1fr_0.36fr] md:items-center">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-md bg-ink text-white">
                <Shield className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-ink">
                  {finished ? "Battle report" : `Question ${current + 1} of ${questions.length}`}
                </h2>
                <p className="text-sm text-slate-500">
                  {finished
                    ? `XP reward: +${result.xpAwarded}`
                    : `Potential reward: +${getBossXpAward(answeredCount)} XP and more after correct answers`}
                </p>
              </div>
            </div>
            <ProgressBar value={answeredCount} max={questions.length} label="Answered" tone="ember" />
          </div>

          {!finished ? (
            <div className="mt-6">
              <h3 className="text-2xl font-black leading-9 text-ink">{question.question}</h3>
              <div className="mt-5 grid gap-3">
                {question.options.map((option, index) => {
                  const selected = selectedAnswer === index;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => selectAnswer(index)}
                      className={`focus-ring flex min-h-16 items-center justify-between rounded-md border p-4 text-left font-bold transition ${
                        selected
                          ? "border-mana bg-[#edf5ff] text-ink shadow-sm"
                          : "border-slate-200 bg-[#fbfaf7] text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <span>{option}</span>
                      {selected ? <Check className="h-5 w-5 text-mana" aria-hidden="true" /> : null}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={() => setCurrent((value) => Math.max(0, value - 1))}
                  disabled={current === 0}
                  className="focus-ring inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-black text-ink shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                {current < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrent((value) => Math.min(questions.length - 1, value + 1))}
                    disabled={selectedAnswer === undefined}
                    className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-ink px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next Question
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={finishQuiz}
                    disabled={answeredCount < questions.length}
                    className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-ember px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#c84e2b] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Swords className="h-4 w-4" aria-hidden="true" />
                    Finish Battle
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-6">
              <div
                className={`rounded-lg border p-6 ${
                  result.passed
                    ? "border-meadow bg-[#ecfbf5]"
                    : "border-coin bg-[#fff7e5]"
                }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-black uppercase text-slate-600">
                      {result.passed ? "Boss defeated" : "Boss survived"}
                    </p>
                    <h2 className="mt-2 text-4xl font-black text-ink">
                      {result.score}/{questions.length} correct
                    </h2>
                    <p className="mt-2 text-slate-600">
                      You earned +{result.xpAwarded} XP. Review the explanations, then restart
                      when you want another run.
                    </p>
                  </div>
                  <div className="grid h-16 w-16 place-items-center rounded-md bg-white text-ink shadow-sm">
                    <Zap className="h-8 w-8 text-coin" aria-hidden="true" />
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {questions.map((item, index) => {
                  const correct = answers[index] === item.answerIndex;
                  return (
                    <article
                      key={item.question}
                      className="rounded-lg border border-slate-200 bg-[#fbfaf7] p-4"
                    >
                      <div className="flex gap-3">
                        <div
                          className={`mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-md text-white ${
                            correct ? "bg-meadow" : "bg-ember"
                          }`}
                        >
                          {correct ? (
                            <Check className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <X className="h-4 w-4" aria-hidden="true" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-black text-ink">{item.question}</h3>
                          <p className="mt-1 text-sm text-slate-600">{item.explanation}</p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={restartQuiz}
                  className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-ink px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-slate-700"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Restart Quiz
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
