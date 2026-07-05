"use client";

import { FormEvent, useMemo, useState } from "react";
import { Bot, Loader2, Send, Sparkles, UserRound } from "lucide-react";
import { useGameState } from "@/hooks/useGameState";
import { getActiveStudyLevel, getActiveSubject } from "@/lib/game";
import { getFallbackTutorReply } from "@/lib/tutor";

const prompts = [
  "Make a 20 minute plan for today",
  "I am stuck on this concept",
  "Help me prepare for a quiz"
];

export default function TutorPage() {
  const { profile, appendTutorExchange } = useGameState();
  const subject = getActiveSubject(profile);
  const level = getActiveStudyLevel(profile);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messages = useMemo(
    () =>
      profile.tutorMessages.length > 0
        ? profile.tutorMessages
        : [
            {
              id: "welcome",
              role: "tutor" as const,
              content: `Welcome to SkillQuest AI Tutor. Ask about ${subject}, your study plan, a hard question, or boss quiz prep.`,
              createdAt: new Date().toISOString()
            }
          ],
    [profile.tutorMessages, subject]
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = input.trim();
    if (!message || sending) {
      return;
    }

    setInput("");
    setSending(true);

    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, subject, level })
      });
      const data = (await response.json()) as { reply?: string };
      const reply = data.reply || getFallbackTutorReply(message, { subject, level });
      appendTutorExchange(message, reply);
    } catch {
      appendTutorExchange(message, getFallbackTutorReply(message, { subject, level }));
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#fbfaf7] py-8 sm:py-12">
      <div className="section-shell max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-black uppercase text-mana">AI Tutor</p>
          <h1 className="mt-2 text-4xl font-black text-ink sm:text-5xl">
            Study chat for {subject}
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-slate-600">
            Ask for explanations, practice plans, or boss quiz prep. If no AI key is
            available, SkillQuest uses safe fallback coaching.
          </p>
        </div>

        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-[#fbfaf7] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-md bg-ink text-white">
                <Bot className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-black text-ink">Tutor Session</h2>
                <p className="text-sm text-slate-500">
                  {level} level, fallback-ready
                </p>
              </div>
            </div>
            <Sparkles className="h-5 w-5 text-coin" aria-hidden="true" />
          </div>

          <div className="max-h-[58vh] min-h-96 space-y-4 overflow-y-auto p-4 sm:p-6">
            {messages.map((message) => {
              const tutor = message.role === "tutor";
              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${tutor ? "justify-start" : "justify-end"}`}
                >
                  {tutor ? (
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-mana text-white">
                      <Bot className="h-5 w-5" aria-hidden="true" />
                    </div>
                  ) : null}
                  <div
                    className={`max-w-[82%] rounded-lg px-4 py-3 leading-7 ${
                      tutor
                        ? "bg-[#edf5ff] text-slate-800"
                        : "bg-ink text-white"
                    }`}
                  >
                    {message.content}
                  </div>
                  {!tutor ? (
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-ember text-white">
                      <UserRound className="h-5 w-5" aria-hidden="true" />
                    </div>
                  ) : null}
                </div>
              );
            })}
            {sending ? (
              <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Tutor is preparing a useful next step
              </div>
            ) : null}
          </div>

          <div className="border-t border-slate-200 p-4 sm:p-5">
            <div className="mb-3 flex flex-wrap gap-2">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setInput(prompt)}
                  className="focus-ring rounded-full border border-slate-200 bg-[#fbfaf7] px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-white"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                rows={2}
                className="focus-ring min-h-14 flex-1 resize-none rounded-md border border-slate-300 bg-white px-4 py-3 text-base text-ink shadow-sm outline-none"
                placeholder="Ask your tutor a study question..."
              />
              <button
                type="submit"
                disabled={!input.trim() || sending}
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-ember px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#c84e2b] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Send
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
