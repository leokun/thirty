import { cn } from '../../lib/cn.js';

interface PlantCounterProps {
  count: number;
  goal?: number;
}

export function PlantCounter({ count, goal = 30 }: PlantCounterProps) {
  const pct = Math.min(100, Math.round((count / goal) * 100));

  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">Plantes cette semaine</span>
        <span className="text-lg font-bold">
          {count}
          <span className="text-sm font-normal text-muted-foreground">/{goal}</span>
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            pct >= 100 ? 'bg-primary' : 'bg-primary/70',
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
