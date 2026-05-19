import { useState } from 'react';
import type { PlantDayEntry } from '@thirty/shared';
import { RadialGauge } from './radial-gauge.js';

interface PlantCounterProps {
  count: number;
  goal?: number;
  plantsByDay?: readonly PlantDayEntry[] | undefined;
}

function getPlantColor(count: number): string {
  if (count >= 30) return 'oklch(0.6 0.18 145)';
  if (count >= 20) return 'oklch(0.8 0.15 85)';
  if (count >= 10) return 'oklch(0.7 0.15 55)';
  return 'oklch(0.577 0.245 27.325)';
}

function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
}

export function PlantCounter({ count, goal = 30, plantsByDay }: PlantCounterProps) {
  const [expanded, setExpanded] = useState(false);
  const color = getPlantColor(count);

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-4">
        <RadialGauge
          value={count}
          max={goal}
          color={color}
          size={96}
          strokeWidth={7}
          label={`${count} plantes sur ${goal} cette semaine`}
        >
          <div className="flex flex-col items-center leading-none">
            <span className="text-xl font-bold tabular-nums" style={{ color }}>
              {count}
            </span>
            <span className="text-xs text-muted-foreground">/{goal}</span>
          </div>
        </RadialGauge>

        <div className="flex-1">
          <p className="text-sm font-medium">Plantes cette semaine</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {count >= goal
              ? 'Objectif atteint !'
              : `${goal - count} plant${goal - count > 1 ? 'es' : 'e'} restante${goal - count > 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {plantsByDay && plantsByDay.length > 0 && (
        <div className="mt-3">
          <button
            type="button"
            className="flex w-full items-center justify-between py-1 text-xs text-muted-foreground active:opacity-70 min-h-11"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
          >
            <span>{count} plante{count > 1 ? 's' : ''} consommée{count > 1 ? 's' : ''}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {expanded && (
            <ul className="mt-1 space-y-1">
              {[...plantsByDay].sort((a, b) => a.firstSeenDate.localeCompare(b.firstSeenDate)).map((plant) => (
                <li
                  key={plant.foodId}
                  className="flex items-center justify-between text-xs py-0.5"
                >
                  <span className="font-medium">{plant.foodName}</span>
                  <span className="text-muted-foreground">{formatShortDate(plant.firstSeenDate)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
