"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenCheck, Menu, Swords, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/ielts", label: "IELTS" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/quiz", label: "Boss Quiz" },
  { href: "/achievements", label: "Achievements" },
  { href: "/tutor", label: "AI Tutor" },
  { href: "/auth", label: "Account" }
];

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-[#fbfaf7]/92 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/92">
      <nav className="section-shell flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="focus-ring flex items-center gap-2 rounded-md text-base font-black tracking-normal text-ink dark:text-white"
          onClick={() => setOpen(false)}
        >
          <span className="grid h-9 w-9 place-items-center rounded-md bg-ink text-white shadow-sm">
            <BookOpenCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          SkillQuest AI
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`focus-ring rounded-md px-3 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100 hover:text-ink dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Link
            href="/onboarding"
            className="focus-ring inline-flex items-center gap-2 rounded-md bg-ember px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#c84e2b]"
          >
            <Swords className="h-4 w-4" aria-hidden="true" />
            Start Quest
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="focus-ring grid h-10 w-10 place-items-center rounded-md border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            onClick={() => setOpen((current) => !current)}
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 md:hidden">
          <div className="section-shell flex flex-col gap-2 py-3">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`focus-ring rounded-md px-3 py-3 text-sm font-semibold ${
                    active ? "bg-slate-900 text-white" : "text-slate-700 dark:text-slate-200"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/onboarding"
              className="focus-ring mt-1 inline-flex items-center justify-center gap-2 rounded-md bg-ember px-4 py-3 text-sm font-bold text-white"
              onClick={() => setOpen(false)}
            >
              <Swords className="h-4 w-4" aria-hidden="true" />
              Start Quest
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
