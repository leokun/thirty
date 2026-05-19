import type { DailyScoreBreakdown, ScoreHistoryResponse } from '@thirty/shared';
import { Sparkline } from './sparkline.js';

interface ScoreSummaryProps {
  score: DailyScoreBreakdown;
  history?: ScoreHistoryResponse | undefined;
}

const AXES = [
  { key: 'diversityScore', label: 'Diversite vegetale', max: 25 },
  { key: 'fiberPrebioticScore', label: 'Fibres & prebiotiques', max: 20 },
  { key: 'fermentedScore', label: 'Fermente', max: 20 },
  { key: 'polyphenolScore', label: 'Polyphenols', max: 10 },
  { key: 'mucosalSupportScore', label: 'Soutien muqueux', max: 15 },
  { key: 'preparationScore', label: 'Preparation', max: 10 },
] as const;

const TREND_CONFIG = {
  IMPROVING: { symbol: '↑', className: 'text-primary' },
  DECLINING: { symbol: '↓', className: 'text-destructive' },
  STABLE: { symbol: '→', className: 'text-muted-foreground' },
} as const;

export function ScoreSummary({ score, history }: ScoreSummaryProps) {
  const trend = TREND_CONFIG[score.trend];
  const sparklineData = history?.map((h) => ({ date: h.date, value: h.totalScore }));

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-1 flex items-baseline gap-2">
        <span className="text-3xl font-bold">{Math.round(score.totalScore)}</span>
        <span className="text-sm text-muted-foreground">/100</span>
        <span className={`ml-1 text-sm font-medium ${trend.className}`} aria-label={`Tendance : ${score.trend}`}>
          {trend.symbol}
        </span>
      </div>

      {sparklineData && sparklineData.length >= 2 && (
        <div className="mb-3">
          <Sparkline data={sparklineData} height={36} />
        </div>
      )}

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
