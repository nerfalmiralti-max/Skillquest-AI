type ProgressBarProps = {
  value: number;
  max: number;
  label: string;
  tone?: "mana" | "meadow" | "ember" | "coin";
};

const toneClasses = {
  mana: "bg-mana",
  meadow: "bg-meadow",
  ember: "bg-ember",
  coin: "bg-coin"
};

export function ProgressBar({
  value,
  max,
  label,
  tone = "mana"
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm font-medium text-slate-700">
        <span>{label}</span>
        <span>
          {value}/{max}
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full ${toneClasses[tone]} transition-all duration-500 ease-out`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
