import { NextResponse } from "next/server";
import { dailyFallback, dailyPrompt, generateJson } from "@/lib/gemini";
import type { DailyChallenge } from "@/lib/ielts";

type DailyRequest = {
  weakSkill?: string;
  targetBand?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as DailyRequest;
  const weakSkill = body.weakSkill?.trim() || "Writing Task 2";
  const targetBand = body.targetBand?.trim() || "7.0";

  const challenges = await generateJson<DailyChallenge[]>(
    dailyPrompt(weakSkill, targetBand),
    dailyFallback(weakSkill)
  );

  return NextResponse.json({ challenges });
}
