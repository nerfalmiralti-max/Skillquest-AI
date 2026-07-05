"use client";

import type { DailyChallenge, IeltsProgressEvent } from "@/lib/ielts";

const EVENTS_KEY = "skillquest-ai-ielts-events-v1";
const CHALLENGES_KEY = "skillquest-ai-daily-challenges-v1";
const LIBRARY_KEY = "skillquest-ai-library-v1";

export type StudyLibraryItem = {
  id: string;
  name: string;
  folder: string;
  type: string;
  size: number;
  textPreview: string;
  createdAt: string;
};

export function loadProgressEvents() {
  return readJson<IeltsProgressEvent[]>(EVENTS_KEY, []);
}

export function saveProgressEvent(event: IeltsProgressEvent) {
  const events = [event, ...loadProgressEvents()].slice(0, 100);
  writeJson(EVENTS_KEY, events);
  return events;
}

export function loadDailyChallenges() {
  return readJson<Array<DailyChallenge & { id: string; completed?: boolean }>>(
    CHALLENGES_KEY,
    []
  );
}

export function saveDailyChallenges(
  challenges: Array<DailyChallenge & { id: string; completed?: boolean }>
) {
  writeJson(CHALLENGES_KEY, challenges);
}

export function loadLibraryItems() {
  return readJson<StudyLibraryItem[]>(LIBRARY_KEY, []);
}

export function saveLibraryItem(item: StudyLibraryItem) {
  const items = [item, ...loadLibraryItems()].slice(0, 80);
  writeJson(LIBRARY_KEY, items);
  return items;
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Local browser storage is optional; the UI should continue to work.
  }
}
