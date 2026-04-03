import type { FoodLogResponse } from '@thirty/shared';
import { useDeleteFoodLog } from '../../api/journal.js';
import { cn } from '../../lib/cn.js';

interface FoodLogItemProps {
  log: FoodLogResponse;
  mealId: string;
  date: string;
}

const PREPARATION_LABELS: Record<string, string> = {
  RAW: 'Cru',
  STEAMED: 'Vapeur',
  BOILED: 'Bouilli',
  ROASTED: 'Roti',
  FRIED: 'Frit',
  FERMENTED: 'Fermente',
  LACTOFERMENTED: 'Lactofermente',
  SPROUTED: 'Germe',
  SOAKED: 'Trempe',
  DRIED: 'Seche',
  AGED: 'Affine',
  SMOKED: 'Fume',
};

const PORTION_LABELS: Record<string, string> = {
  SMALL: 'S',
  MEDIUM: 'M',
  LARGE: 'L',
};

export function FoodLogItem({ log, mealId, date }: FoodLogItemProps) {
  const deleteMutation = useDeleteFoodLog(mealId, date);

  return (
    <div className="flex items-center gap-2 py-1.5">
      <span className="flex-1 text-sm">{log.foodName}</span>
      <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
        {PREPARATION_LABELS[log.preparationMethod] ?? log.preparationMethod}
      </span>
      {log.portionSize && (
        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
          {PORTION_LABELS[log.portionSize] ?? log.portionSize}
        </span>
      )}
      <button
        type="button"
        onClick={() => deleteMutation.mutate(log.id)}
        disabled={deleteMutation.isPending}
        className={cn(
          'min-h-7 min-w-7 rounded-full text-xs text-destructive transition-opacity',
          deleteMutation.isPending && 'opacity-50',
        )}
        aria-label={`Supprimer ${log.foodName}`}
      >
        ✕
      </button>
    </div>
  );
}
