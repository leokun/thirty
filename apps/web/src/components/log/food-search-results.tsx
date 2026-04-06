import type { FoodResponse } from '@thirty/shared';
import { useSearchFoods } from '../../api/foods.js';
import { cn } from '../../lib/cn.js';

interface FoodSearchResultsProps {
  query: string;
  onSelect: (food: FoodResponse) => void;
  onAddCustom: (prefillName: string) => void;
}

export function FoodSearchResults({ query, onSelect, onAddCustom }: FoodSearchResultsProps) {
  const { data: foods, isLoading } = useSearchFoods(query);

  if (query.length < 2) return null;

  if (isLoading) {
    return <p className="py-4 text-center text-sm text-muted-foreground">Recherche...</p>;
  }

  const q = query.trim();

  return (
    <div className="space-y-2">
      {foods && foods.length > 0 ? (
        <ul className="divide-y divide-border rounded-lg border border-border bg-card">
          {foods.map((food) => (
            <li key={food.id}>
              <button
                type="button"
                onClick={() => onSelect(food)}
                className="flex min-h-11 w-full items-center gap-2 px-3 py-2 text-left transition-colors active:bg-secondary"
              >
                <span
                  className={cn(
                    'h-2 w-2 shrink-0 rounded-full',
                    food.isPlant ? 'bg-primary' : 'bg-muted-foreground/40',
                  )}
                />
                <span className="flex-1 text-sm">{food.nameFr}</span>
                <span className="text-xs text-muted-foreground">{food.category}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-2 text-center text-sm text-muted-foreground">
          Aucun resultat dans la base
        </p>
      )}
      <button
        type="button"
        onClick={() => onAddCustom(q)}
        className="min-h-11 w-full rounded-lg border border-dashed border-border bg-card px-3 py-2.5 text-left text-sm font-medium text-muted-foreground transition-colors active:bg-secondary"
      >
        Ajouter « {q || '…'} » comme aliment personnalise
      </button>
    </div>
  );
}
