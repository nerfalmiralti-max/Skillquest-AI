"use client";

import { FormEvent, useEffect, useState } from "react";
import { FileText, FolderOpen, Loader2, Plus, Sparkles, Upload } from "lucide-react";
import { PlatformShell } from "@/components/PlatformShell";
import type { LibraryQuiz } from "@/lib/ielts";
import { createProgressEvent } from "@/lib/ielts";
import {
  loadLibraryItems,
  saveLibraryItem,
  saveProgressEvent,
  type StudyLibraryItem
} from "@/lib/ielts-storage";
import {
  saveGeneratedQuizToSupabase,
  saveIeltsProgressToSupabase,
  saveStudyFileToSupabase
} from "@/lib/supabase/ielts-sync";

export default function StudyLibraryPage() {
  const [items, setItems] = useState<StudyLibraryItem[]>([]);
  const [folder, setFolder] = useState("General");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteText, setNoteText] = useState("");
  const [selected, setSelected] = useState<StudyLibraryItem | null>(null);
  const [analysis, setAnalysis] = useState<LibraryQuiz | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setItems(loadLibraryItems());
  }, []);

  async function handleFiles(files: FileList | null) {
    if (!files) {
      return;
    }

    const nextItems: StudyLibraryItem[] = [];
    for (const file of Array.from(files)) {
      const textPreview = await readFilePreview(file);
      nextItems.push({
        id: crypto.randomUUID(),
        name: file.name,
        folder,
        type: file.type || file.name.split(".").pop() || "file",
        size: file.size,
        textPreview,
        createdAt: new Date().toISOString()
      });
    }

    let updated = loadLibraryItems();
    nextItems.forEach((item) => {
      updated = saveLibraryItem(item);
      void saveStudyFileToSupabase(item);
    });
    setItems(updated);
    const progressEvent = createProgressEvent(
      "library",
      "Vocabulary",
      `Uploaded ${nextItems.length} study file`,
      15
    );
    saveProgressEvent(progressEvent);
    void saveIeltsProgressToSupabase(progressEvent);
  }

  function addNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!noteTitle.trim() || !noteText.trim()) {
      return;
    }

    const item: StudyLibraryItem = {
      id: crypto.randomUUID(),
      name: noteTitle.trim(),
      folder,
      type: "note",
      size: noteText.length,
      textPreview: noteText,
      createdAt: new Date().toISOString()
    };
    setItems(saveLibraryItem(item));
    void saveStudyFileToSupabase(item);
    const progressEvent = createProgressEvent(
      "library",
      "Grammar",
      `Added note: ${item.name}`,
      10
    );
    saveProgressEvent(progressEvent);
    void saveIeltsProgressToSupabase(progressEvent);
    setNoteTitle("");
    setNoteText("");
  }

  async function analyzeItem(item: StudyLibraryItem) {
    setSelected(item);
    setLoading(true);
    const response = await fetch("/api/ielts/library", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName: item.name, text: item.textPreview })
    });
    const result = (await response.json()) as LibraryQuiz;
    setAnalysis(result);
    void saveStudyFileToSupabase(item, result);
    void saveGeneratedQuizToSupabase({
      section: "Reading",
      title: `Study pack: ${item.name}`,
      content: result
    });
    const progressEvent = createProgressEvent(
      "library",
      "Reading",
      `Analyzed ${item.name}`,
      20
    );
    saveProgressEvent(progressEvent);
    void saveIeltsProgressToSupabase(progressEvent);
    setLoading(false);
  }

  const folders = Array.from(new Set(items.map((item) => item.folder)));

  return (
    <PlatformShell
      eyebrow="Study Library"
      title="Upload materials and turn them into practice"
      description="Organize user-owned PDFs, DOCX files, TXT notes, images, and typed notes. The AI uses readable user-provided text to summarize, explain, and generate quizzes."
    >
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <section className="space-y-5">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <label className="block">
              <span className="text-sm font-black uppercase text-slate-500">
                Folder
              </span>
              <input
                value={folder}
                onChange={(event) => setFolder(event.target.value)}
                className="focus-ring mt-2 w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-base font-bold text-ink outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </label>
            <label className="mt-5 flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-[#fbfaf7] p-6 text-center dark:border-slate-700 dark:bg-slate-950">
              <Upload className="h-8 w-8 text-mana" aria-hidden="true" />
              <span className="mt-3 text-lg font-black text-ink dark:text-white">
                Upload files
              </span>
              <span className="mt-1 text-sm text-slate-500">
                PDF, DOCX, TXT, images, notes
              </span>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt,text/*,image/*"
                className="sr-only"
                onChange={(event) => void handleFiles(event.target.files)}
              />
            </label>
          </div>

          <form
            onSubmit={addNote}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <h2 className="text-xl font-black text-ink dark:text-white">Add note</h2>
            <input
              value={noteTitle}
              onChange={(event) => setNoteTitle(event.target.value)}
              className="focus-ring mt-4 w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-base font-bold text-ink outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              placeholder="Note title"
            />
            <textarea
              value={noteText}
              onChange={(event) => setNoteText(event.target.value)}
              rows={6}
              className="focus-ring mt-3 w-full resize-none rounded-md border border-slate-300 bg-white px-4 py-3 text-base leading-7 text-ink outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              placeholder="Paste vocabulary, grammar notes, reading extracts, or your own summaries..."
            />
            <button
              type="submit"
              className="focus-ring mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-ember px-5 py-3 text-sm font-black text-white shadow-sm"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Save Note
            </button>
          </form>
        </section>

        <section className="space-y-5">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-2xl font-black text-ink dark:text-white">Library</h2>
            <div className="mt-5 space-y-5">
              {folders.length === 0 ? (
                <p className="rounded-md bg-[#fbfaf7] p-4 text-slate-600 dark:bg-slate-950 dark:text-slate-300">
                  Upload a file or add a note to begin.
                </p>
              ) : (
                folders.map((folderName) => (
                  <div key={folderName}>
                    <div className="mb-3 flex items-center gap-2 font-black text-ink dark:text-white">
                      <FolderOpen className="h-5 w-5 text-coin" />
                      {folderName}
                    </div>
                    <div className="grid gap-3">
                      {items
                        .filter((item) => item.folder === folderName)
                        .map((item) => (
                          <article
                            key={item.id}
                            className="rounded-lg border border-slate-200 p-4 dark:border-slate-800"
                          >
                            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-5 w-5 text-mana" />
                                  <h3 className="truncate font-black text-ink dark:text-white">
                                    {item.name}
                                  </h3>
                                </div>
                                <p className="mt-1 text-sm text-slate-500">
                                  {item.type} • {(item.size / 1024).toFixed(1)} KB
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => void analyzeItem(item)}
                                className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-black text-white"
                              >
                                <Sparkles className="h-4 w-4" aria-hidden="true" />
                                Analyze
                              </button>
                            </div>
                          </article>
                        ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {selected ? (
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-xl font-black text-ink dark:text-white">
                AI study pack: {selected.name}
              </h2>
              {loading ? (
                <div className="mt-5 flex items-center gap-3 text-sm font-bold text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Building summary and quiz
                </div>
              ) : analysis ? (
                <div className="mt-4 space-y-4">
                  <p className="leading-7 text-slate-700 dark:text-slate-300">
                    {analysis.summary}
                  </p>
                  <p className="rounded-md bg-[#edf5ff] p-3 text-sm font-semibold text-slate-700 dark:bg-mana/10 dark:text-slate-200">
                    {analysis.explanation}
                  </p>
                  {analysis.quiz.map((quizItem) => (
                    <article key={quizItem.question} className="rounded-md border border-slate-200 p-4 dark:border-slate-800">
                      <h3 className="font-black text-ink dark:text-white">
                        {quizItem.question}
                      </h3>
                      <p className="mt-2 text-sm font-bold text-meadow">
                        {quizItem.answer}
                      </p>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        {quizItem.explanation}
                      </p>
                    </article>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </section>
      </div>
    </PlatformShell>
  );
}

async function readFilePreview(file: File) {
  if (
    file.type.startsWith("text/") ||
    file.name.toLowerCase().endsWith(".txt")
  ) {
    return (await file.text()).slice(0, 12000);
  }

  return `${file.name} (${file.type || "unknown type"}) uploaded by the user. Add notes or transcript text for deeper AI analysis.`;
}
