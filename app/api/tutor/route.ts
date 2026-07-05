import { NextResponse } from "next/server";
import { getFallbackTutorReply } from "@/lib/tutor";
import { SUBJECTS, STUDY_LEVELS, type StudyLevel, type Subject } from "@/lib/game";

type TutorRequest = {
  message?: string;
  subject?: Subject | null;
  level?: StudyLevel | null;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as TutorRequest;
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const subject = SUBJECTS.includes(body.subject as Subject)
    ? (body.subject as Subject)
    : "English";
  const level = STUDY_LEVELS.includes(body.level as StudyLevel)
    ? (body.level as StudyLevel)
    : "Beginner";

  if (!message) {
    return NextResponse.json({
      reply: "Send me the exact question or concept, and I will help you break it down."
    });
  }

  const fallback = getFallbackTutorReply(message, { subject, level });
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ reply: fallback, source: "fallback" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        temperature: 0.4,
        messages: [
          {
            role: "system",
            content:
              "You are SkillQuest AI, a concise study tutor. Give practical help, one small next step, and avoid doing all homework without explanation."
          },
          {
            role: "user",
            content: `Subject: ${subject}\nLevel: ${level}\nQuestion: ${message}`
          }
        ]
      })
    });

    if (!response.ok) {
      return NextResponse.json({ reply: fallback, source: "fallback" });
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const reply = data.choices?.[0]?.message?.content?.trim();
    return NextResponse.json({ reply: reply || fallback, source: reply ? "ai" : "fallback" });
  } catch {
    return NextResponse.json({ reply: fallback, source: "fallback" });
  }
}
