import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Brain,
  Check,
  Clock,
  Flame,
  Shield,
  Sparkles,
  Swords,
  Target,
  Trophy,
  Zap
} from "lucide-react";
import { HeroQuestMap } from "@/components/HeroQuestMap";

const features = [
  {
    icon: Target,
    title: "Daily quest paths",
    body: "Turn each study session into three focused quests sized to your subject, level, and available time."
  },
  {
    icon: Zap,
    title: "XP and levels",
    body: "Earn XP for consistent effort, level up every 100 XP, and keep visible momentum between sessions."
  },
  {
    icon: Shield,
    title: "Boss quizzes",
    body: "Face five-question quizzes tailored to your chosen subject and collect bonus XP when you pass."
  },
  {
    icon: Trophy,
    title: "Auto badges",
    body: "Achievements unlock automatically for first quest, 100 XP, boss wins, and three-day streaks."
  },
  {
    icon: Brain,
    title: "AI tutor mode",
    body: "Ask for study help in a chat interface that falls back gracefully when no AI key is configured."
  },
  {
    icon: Clock,
    title: "Persistent progress",
    body: "Your subject, streak, completed quests, XP, and chat history persist locally in the browser."
  }
];

const steps = [
  {
    title: "Choose your campaign",
    body: "Pick English, IELTS, Biology, Math, or Programming, then set your level and daily study time."
  },
  {
    title: "Clear today's quests",
    body: "Complete three compact study tasks. Each finished quest updates XP, streak, and daily progress."
  },
  {
    title: "Challenge the boss",
    body: "Take a subject-based quiz, learn from the result, and unlock achievements as your record grows."
  }
];

const plans = [
  {
    name: "Starter",
    price: "$0",
    description: "For students building a daily habit.",
    points: ["Daily quests", "XP and levels", "Local progress saving"]
  },
  {
    name: "Scholar",
    price: "$8",
    description: "For deeper guided practice.",
    points: ["Everything in Starter", "Expanded quiz banks", "Study streak insights"],
    featured: true
  },
  {
    name: "Classroom",
    price: "$18",
    description: "For tutors and small groups.",
    points: ["Teacher dashboards", "Custom quest packs", "Group progress views"]
  }
];

const faqs = [
  {
    question: "Is SkillQuest AI a mobile app?",
    answer:
      "This version is built first as a responsive website. It works on desktop and mobile browsers and is ready for Vercel deployment."
  },
  {
    question: "Does progress really save?",
    answer:
      "Yes. The onboarding choices, XP, completed quests, streak, boss results, achievements, and tutor messages are stored in localStorage."
  },
  {
    question: "What happens without an AI API key?",
    answer:
      "The AI Tutor still works with subject-aware fallback replies, so the chat never collapses into an error state."
  },
  {
    question: "Can I change subjects later?",
    answer:
      "Yes. Return to onboarding, choose a new subject or level, and continue with your existing XP and achievement history."
  }
];

export default function LandingPage() {
  return (
    <main>
      <section className="relative isolate min-h-[82dvh] overflow-hidden border-b border-slate-200">
        <HeroQuestMap />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(251,250,247,0.96)_0%,rgba(251,250,247,0.84)_42%,rgba(251,250,247,0.26)_100%)]" />
        <div className="section-shell relative z-10 grid min-h-[82dvh] items-center gap-10 py-14 lg:grid-cols-[1fr_0.78fr] lg:py-20">
          <div className="max-w-3xl animate-slideUp">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/85 px-3 py-1 text-sm font-bold text-slate-700 shadow-sm">
              <Sparkles className="h-4 w-4 text-coin" aria-hidden="true" />
              AI-powered study RPG
            </div>
            <h1 className="text-5xl font-black tracking-normal text-ink sm:text-6xl lg:text-7xl">
              SkillQuest AI
            </h1>
            <p className="mt-5 max-w-2xl text-xl font-semibold leading-8 text-slate-700 sm:text-2xl">
              Turn studying into an adventure.
            </p>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Choose a subject, complete daily quests, earn XP, level up, unlock
              achievements, and pass boss quizzes without losing the calm focus of
              a serious study tool.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/onboarding"
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-ember px-5 py-3 text-base font-black text-white shadow-lift transition hover:bg-[#c84e2b]"
              >
                <Swords className="h-5 w-5" aria-hidden="true" />
                Start Quest
              </Link>
              <Link
                href="/dashboard"
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-3 text-base font-black text-ink shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
              >
                View Demo
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="surface animate-float rounded-lg p-5">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <p className="text-sm font-bold uppercase text-slate-500">Quest Console</p>
                <h2 className="mt-1 text-2xl font-black text-ink">Today&apos;s Route</h2>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-md bg-ink text-white">
                <Flame className="h-6 w-6" aria-hidden="true" />
              </div>
            </div>
            <div className="mt-5 space-y-4">
              {["Vocabulary Forge", "Problem Sprint", "Boss Gate"].map((item, index) => (
                <div
                  key={item}
                  className="flex items-center gap-4 rounded-md border border-slate-200 bg-[#fbfaf7] p-4"
                >
                  <div
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-md font-black text-white ${
                      index === 0
                        ? "bg-meadow"
                        : index === 1
                          ? "bg-mana"
                          : "bg-ember"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-black text-ink">{item}</p>
                    <p className="text-sm text-slate-600">
                      {index === 2 ? "Unlock bonus XP" : "Complete for +25 XP"}
                    </p>
                  </div>
                  <BadgeCheck className="h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="bg-white py-20">
        <div className="section-shell">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase text-mana">Features</p>
            <h2 className="mt-3 text-3xl font-black text-ink sm:text-4xl">
              A study loop with enough game energy to keep moving.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-lg border border-slate-200 bg-[#fbfaf7] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lift"
              >
                <feature.icon className="h-7 w-7 text-ember" aria-hidden="true" />
                <h3 className="mt-5 text-xl font-black text-ink">{feature.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{feature.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="quest-grid border-y border-slate-200 py-20">
        <div className="section-shell">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-sm font-black uppercase text-ember">How It Works</p>
              <h2 className="mt-3 text-3xl font-black text-ink sm:text-4xl">
                From setup to boss fight in three clear moves.
              </h2>
            </div>
            <div className="grid gap-4">
              {steps.map((step, index) => (
                <article
                  key={step.title}
                  className="flex gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-ink text-lg font-black text-white">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-ink">{step.title}</h3>
                    <p className="mt-2 leading-7 text-slate-600">{step.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-white py-20">
        <div className="section-shell">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase text-meadow">Pricing</p>
            <h2 className="mt-3 text-3xl font-black text-ink sm:text-4xl">
              Start free, grow into richer quest systems.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`rounded-lg border p-6 shadow-sm ${
                  plan.featured
                    ? "border-ember bg-[#fff8f2] shadow-lift"
                    : "border-slate-200 bg-[#fbfaf7]"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-black text-ink">{plan.name}</h3>
                    <p className="mt-2 text-slate-600">{plan.description}</p>
                  </div>
                  {plan.featured ? (
                    <span className="rounded-full bg-ember px-3 py-1 text-xs font-black uppercase text-white">
                      Popular
                    </span>
                  ) : null}
                </div>
                <p className="mt-6 text-4xl font-black text-ink">
                  {plan.price}
                  <span className="text-base font-bold text-slate-500"> /mo</span>
                </p>
                <ul className="mt-6 space-y-3">
                  {plan.points.map((point) => (
                    <li key={point} className="flex items-center gap-3 text-slate-700">
                      <Check className="h-5 w-5 text-meadow" aria-hidden="true" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="border-t border-slate-200 bg-[#fbfaf7] py-20">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-black uppercase text-coin">FAQ</p>
            <h2 className="mt-3 text-3xl font-black text-ink sm:text-4xl">
              Practical answers before the first quest.
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
              >
                <summary className="focus-ring cursor-pointer list-none rounded-md text-lg font-black text-ink">
                  <span className="inline-flex w-full items-center justify-between gap-4">
                    {faq.question}
                    <ArrowRight className="h-5 w-5 shrink-0 transition group-open:rotate-90" />
                  </span>
                </summary>
                <p className="mt-4 leading-7 text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
