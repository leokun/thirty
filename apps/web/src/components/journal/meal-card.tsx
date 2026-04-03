import type { MealResponse } from '@thirty/shared';
import { FoodLogItem } from './food-log-item.js';

interface MealCardProps {
  meal: MealResponse;
  date: string;
}

const MOMENT_LABELS: Record<string, string> = {
  BREAKFAST: 'Petit-dejeuner',
  LUNCH: 'Dejeuner',
  DINNER: 'Diner',
  SNACK: 'Collation',
};

export function MealCard({ meal, date }: MealCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <h3 className="mb-2 text-sm font-semibold">{MOMENT_LABELS[meal.moment] ?? meal.moment}</h3>
      {meal.foodLogs.length === 0 ? (
        <p className="text-xs text-muted-foreground">Aucun aliment</p>
      ) : (
        <div className="divide-y divide-border">
          {meal.foodLogs.map((log) => (
            <FoodLogItem key={log.id} log={log} mealId={meal.id} date={date} />
          ))}
        </div>
      )}
    </div>
  );
}
