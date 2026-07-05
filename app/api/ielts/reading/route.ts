import { NextResponse } from "next/server";
import { generateJson, readingFallback, readingPrompt } from "@/lib/gemini";
import type { ReadingTest } from "@/lib/ielts";

type ReadingRequest = {
  topic?: string;
  difficulty?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as ReadingRequest;
  const topic = body.topic?.trim() || "education and technology";
  const difficulty = body.difficulty?.trim() || "Band 7";

  const test = await generateJson<ReadingTest>(
    readingPrompt(topic, difficulty),
    readingFallback(topic)
  );

  return NextResponse.json(test);
}
