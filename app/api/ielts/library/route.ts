import { NextResponse } from "next/server";
import { generateJson, libraryFallback, libraryPrompt } from "@/lib/gemini";
import type { LibraryQuiz } from "@/lib/ielts";

type LibraryRequest = {
  fileName?: string;
  text?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as LibraryRequest;
  const fileName = body.fileName?.trim() || "study material";
  const text = body.text?.trim() || "";

  const result = await generateJson<LibraryQuiz>(
    libraryPrompt(fileName, text),
    libraryFallback(text)
  );

  return NextResponse.json(result);
}
