import type { MealMoment } from '@thirty/shared';
import { cn } from '../../lib/cn.js';

interface MealMomentPickerProps {
  value: MealMoment;
  onChange: (moment: MealMoment) => void;
}

const MOMENTS: { value: MealMoment; label: string }[] = [
  { value: 'BREAKFAST', label: 'Petit-dej' },
  { value: 'LUNCH', label: 'Dejeuner' },
  { value: 'DINNER', label: 'Diner' },
  { value: 'SNACK', label: 'Collation' },
];

export function getDefaultMoment(): MealMoment {
  const hour = new Date().getHours();
  if (hour < 10) return 'BREAKFAST';
  if (hour < 14) return 'LUNCH';
  if (hour < 18) return 'SNACK';
  return 'DINNER';
}

export function MealMomentPicker({ value, onChange }: MealMomentPickerProps) {
  return (
    <div className="flex gap-2">
      {MOMENTS.map((m) => (
        <button
          key={m.value}
          type="button"
          onClick={() => onChange(m.value)}
          className={cn(
            'min-h-11 flex-1 rounded-lg px-2 py-2 text-sm font-medium transition-colors',
            value === m.value
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground',
          )}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
