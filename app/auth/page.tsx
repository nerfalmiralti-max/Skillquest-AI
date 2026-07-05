"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Loader2, LogOut, Mail, Shield } from "lucide-react";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      return;
    }

    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });
  }, []);

  async function handleMagicLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = getSupabaseBrowserClient();
    const nextEmail = email.trim();

    if (!supabase || !nextEmail) {
      return;
    }

    setStatus("sending");
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email: nextEmail,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    setStatus("sent");
    setMessage("Check your email for the SkillQuest AI sign-in link.");
  }

  async function handleSignOut() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    setUserEmail(null);
    setMessage("Signed out. Your local fallback progress is still available on this device.");
  }

  async function handleGoogleSignIn() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      return;
    }

    setStatus("sending");
    setMessage("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
    }
  }

  return (
    <main className="quest-grid min-h-[calc(100vh-4rem)] py-10 sm:py-16">
      <div className="section-shell max-w-3xl">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-ink text-white">
              <Shield className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-black uppercase text-mana">Account Sync</p>
              <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">
                Supabase authentication
              </h1>
              <p className="mt-3 leading-7 text-slate-600">
                Sign in with an email magic link to sync SkillQuest progress through
                Supabase. If Supabase is not configured, the app keeps using localStorage.
              </p>
            </div>
          </div>

          {!configured ? (
            <div className="mt-6 rounded-lg border border-coin/30 bg-[#fff7e5] p-4 text-slate-700">
              Add `NEXT_PUBLIC_SUPABASE_URL` and
              `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to enable cloud sync.
            </div>
          ) : userEmail ? (
            <div className="mt-6 rounded-lg border border-meadow/30 bg-[#ecfbf5] p-5">
              <div className="flex items-center gap-3 text-ink">
                <CheckCircle2 className="h-5 w-5 text-meadow" aria-hidden="true" />
                <p className="font-black">Signed in as {userEmail}</p>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="focus-ring mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-slate-700"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              <button
                type="button"
                onClick={() => void handleGoogleSignIn()}
                disabled={status === "sending"}
                className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-black text-ink shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                Continue with Google
              </button>

              <form onSubmit={handleMagicLink} className="space-y-4">
                <label className="block">
                  <span className="text-sm font-black uppercase text-slate-500">
                    Email address
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="focus-ring mt-2 w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-base text-ink shadow-sm outline-none"
                    placeholder="student@example.com"
                  />
                </label>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-md bg-ember px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#c84e2b] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {status === "sending" ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Mail className="h-4 w-4" aria-hidden="true" />
                  )}
                  Send Magic Link
                </button>
              </form>
            </div>
          )}

          {message ? (
            <p
              className={`mt-5 rounded-md px-4 py-3 text-sm font-bold ${
                status === "error"
                  ? "bg-[#fff1ed] text-ember"
                  : "bg-[#edf5ff] text-mana"
              }`}
            >
              {message}
            </p>
          ) : null}

          <Link
            href="/dashboard"
            className="focus-ring mt-6 inline-flex items-center gap-2 rounded-md text-sm font-black text-ink"
          >
            Return to dashboard
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </main>
  );
}
