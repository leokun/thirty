import type { FoodResponse } from '@thirty/shared';
import { useFavorites } from '../../api/favorites.js';
import { useRecentFoods } from '../../api/foods.js';

interface QuickAddPanelProps {
  onSelectFood: (
    food: Pick<
      FoodResponse,
      'id' | 'nameFr' | 'availablePreparations' | 'defaultPreparation' | 'isPlant' | 'category'
    >,
  ) => void;
  onApplyFavorite: (favoriteId: string) => void;
}

export function QuickAddPanel({ onSelectFood, onApplyFavorite }: QuickAddPanelProps) {
  const { data: recentFoods } = useRecentFoods();
  const { data: favorites } = useFavorites();

  return (
    <div className="space-y-4">
      {recentFoods && recentFoods.length > 0 && (
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Recents</h3>
          <div className="flex flex-wrap gap-2">
            {recentFoods.slice(0, 8).map((food) => (
              <button
                key={food.foodId}
                type="button"
                onClick={() =>
                  onSelectFood({
                    id: food.foodId,
                    nameFr: food.nameFr,
                    category: food.category,
                    isPlant: false,
                    availablePreparations: [],
                    defaultPreparation: 'RAW',
                  })
                }
                className="min-h-9 rounded-full bg-secondary px-3 py-1.5 text-sm transition-colors active:bg-accent"
              >
                {food.nameFr}
              </button>
            ))}
          </div>
        </div>
      )}

      {favorites && favorites.length > 0 && (
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Favoris</h3>
          <div className="flex flex-wrap gap-2">
            {favorites.slice(0, 6).map((fav) => (
              <button
                key={fav.id}
                type="button"
                onClick={() => onApplyFavorite(fav.id)}
                className="min-h-9 rounded-full bg-secondary px-3 py-1.5 text-sm transition-colors active:bg-accent"
              >
                {fav.name}
                <span className="ml-1 text-xs text-muted-foreground">({fav.items.length})</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
