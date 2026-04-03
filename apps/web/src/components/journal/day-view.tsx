import { useDayJournal } from '../../api/journal.js';
import { useDailyScore } from '../../api/scores.js';
import { formatDateFr } from '../../lib/date.js';
import { MealCard } from './meal-card.js';
import { PlantCounter } from './plant-counter.js';
import { ScoreSummary } from './score-summary.js';

interface DayViewProps {
  date: string;
}

const MOMENT_ORDER = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'] as const;

export function DayView({ date }: DayViewProps) {
  const { data: day, isLoading, error } = useDayJournal(date);
  const { data: scoreData } = useDailyScore(date);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Chargement...
      </div>
    );
  }

  if (error) {
    return <div className="px-4 py-12 text-center text-destructive">Erreur de chargement</div>;
  }

  const score = day?.score ?? scoreData;
  const meals = day?.meals ?? [];

  const sortedMeals = [...meals].sort(
    (a, b) =>
      MOMENT_ORDER.indexOf(a.moment as (typeof MOMENT_ORDER)[number]) -
      MOMENT_ORDER.indexOf(b.moment as (typeof MOMENT_ORDER)[number]),
  );

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-base font-semibold capitalize">{formatDateFr(date)}</h2>

      {score && <ScoreSummary score={score} />}

      {score && <PlantCounter count={score.rollingPlantCount} />}

      {sortedMeals.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Aucun repas enregistre</p>
      ) : (
        <div className="space-y-3">
          {sortedMeals.map((meal) => (
            <MealCard key={meal.id} meal={meal} date={date} />
          ))}
        </div>
      )}
    </div>
  );
}
