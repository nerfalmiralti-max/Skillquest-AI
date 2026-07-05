import { NextResponse } from "next/server";
import {
  generateJson,
  writingFallback,
  writingPrompt
} from "@/lib/gemini";
import type { WritingFeedback } from "@/lib/ielts";

type WritingRequest = {
  taskType?: string;
  prompt?: string;
  essay?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as WritingRequest;
  const taskType = body.taskType === "task1" ? "task1" : "task2";
  const prompt = body.prompt?.trim() || "Original IELTS-style writing prompt";
  const essay = body.essay?.trim() || "";
  const fallback = writingFallback(essay, taskType);

  if (essay.length < 40) {
    return NextResponse.json({
      ...fallback,
      summary: "Write at least a short paragraph so the checker can give useful feedback."
    });
  }

  const feedback = await generateJson<WritingFeedback>(
    writingPrompt(taskType, prompt, essay),
    fallback
  );

  return NextResponse.json(feedback);
}
