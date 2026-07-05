import { NextResponse } from "next/server";
import { generateJson, speakingFallback, speakingPrompt } from "@/lib/gemini";
import type { SpeakingFeedback, SpeakingTurn } from "@/lib/ielts";

type SpeakingRequest = {
  part?: string;
  turns?: SpeakingTurn[];
  answer?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as SpeakingRequest;
  const part = ["1", "2", "3"].includes(body.part ?? "") ? body.part ?? "1" : "1";
  const turns = Array.isArray(body.turns) ? body.turns : [];
  const answer = body.answer?.trim() || "";
  const fallback = speakingFallback(answer, part);

  const feedback = await generateJson<SpeakingFeedback>(
    speakingPrompt(part, turns, answer),
    fallback
  );

  return NextResponse.json(feedback);
}
