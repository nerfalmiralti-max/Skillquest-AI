import Link from "next/link";
import type { ReactNode } from "react";
import {
  BarChart3,
  BookOpen,
  CalendarCheck,
  FileText,
  Headphones,
  Library,
  Mic,
  PenLine,
  Sparkles,
  SpellCheck,
  Target
} from "lucide-react";

const platformLinks = [
  { href: "/ielts", label: "Overview", icon: Target },
  { href: "/ielts/writing", label: "Writing", icon: PenLine },
  { href: "/ielts/speaking", label: "Speaking", icon: Mic },
  { href: "/ielts/reading", label: "Reading", icon: BookOpen },
  { href: "/ielts/listening", label: "Listening", icon: Headphones },
  { href: "/ielts/library", label: "Library", icon: Library },
  { href: "/ielts/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/ielts/daily", label: "Daily", icon: CalendarCheck },
  { href: "/ielts/vocabulary", label: "Vocabulary", icon: FileText },
  { href: "/ielts/grammar", label: "Grammar", icon: SpellCheck }
];

type PlatformShellProps = {
  title: string;
  eyebrow: string;
  description: string;
  children: ReactNode;
  action?: ReactNode;
};

export function PlatformShell({
  title,
  eyebrow,
  description,
  children,
  action
}: PlatformShellProps) {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#fbfaf7] dark:bg-slate-950">
      <div className="section-shell grid gap-6 py-6 lg:grid-cols-[15rem_1fr] lg:py-8">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex items-center gap-2 px-2 py-2 text-sm font-black uppercase text-mana">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              IELTS Prep
            </div>
            <nav className="grid gap-1">
              {platformLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="focus-ring flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 hover:text-ink dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <item.icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="mb-6 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
            <div>
              <p className="text-sm font-black uppercase text-ember">{eyebrow}</p>
              <h1 className="mt-2 text-4xl font-black text-ink dark:text-white sm:text-5xl">
                {title}
              </h1>
              <p className="mt-4 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
                {description}
              </p>
            </div>
            {action}
          </div>
          {children}
        </section>
      </div>
    </main>
  );
}
