import type { DailyScoreBreakdown } from '@thirty/shared';

interface ScoreSummaryProps {
  score: DailyScoreBreakdown;
}

const AXES = [
  { key: 'diversityScore', label: 'Diversite vegetale', max: 25 },
  { key: 'fiberPrebioticScore', label: 'Fibres & prebiotiques', max: 20 },
  { key: 'fermentedScore', label: 'Fermente', max: 20 },
  { key: 'polyphenolScore', label: 'Polyphenols', max: 10 },
  { key: 'mucosalSupportScore', label: 'Soutien muqueux', max: 15 },
  { key: 'preparationScore', label: 'Preparation', max: 10 },
] as const;

export function ScoreSummary({ score }: ScoreSummaryProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-4 flex items-baseline gap-2">
        <span className="text-3xl font-bold">{Math.round(score.totalScore)}</span>
        <span className="text-sm text-muted-foreground">/100</span>
      </div>
      <div className="space-y-2">
        {AXES.map(({ key, label, max }) => {
          const value = score[key];
          const pct = Math.min(100, Math.round((value / max) * 100));
          return (
            <div key={key}>
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium tabular-nums">
                  {Math.round(value)}/{max}
                </span>
              </div>
              <div className="mt-0.5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary/70 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
