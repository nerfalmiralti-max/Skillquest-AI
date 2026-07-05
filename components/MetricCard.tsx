import type { LucideIcon } from "lucide-react";

type MetricCardProps = {
  label: string;
  value: string | number;
  detail: string;
  icon: LucideIcon;
  tone?: "mana" | "meadow" | "ember" | "coin";
};

const toneClasses = {
  mana: "bg-[#edf5ff] text-mana dark:bg-mana/15",
  meadow: "bg-[#ecfbf5] text-meadow dark:bg-meadow/15",
  ember: "bg-[#fff1ed] text-ember dark:bg-ember/15",
  coin: "bg-[#fff7e5] text-coin dark:bg-coin/15"
};

export function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "mana"
}: MetricCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold uppercase text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <div className={`grid h-10 w-10 place-items-center rounded-md ${toneClasses[tone]}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      <p className="mt-3 text-3xl font-black text-ink dark:text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{detail}</p>
    </article>
  );
}
