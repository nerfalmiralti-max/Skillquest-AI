import { NextResponse } from "next/server";
import { generateJson, listeningFallback, listeningPrompt } from "@/lib/gemini";
import type { ListeningTest } from "@/lib/ielts";

type ListeningRequest = {
  fileName?: string;
  notes?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as ListeningRequest;
  const fileName = body.fileName?.trim() || "uploaded audio";
  const notes = body.notes?.trim() || "";

  const test = await generateJson<ListeningTest>(
    listeningPrompt(fileName, notes),
    listeningFallback(fileName)
  );

  return NextResponse.json(test);
}
