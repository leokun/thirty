import { useApplyFavorite, useDeleteFavorite, useFavorites } from '../../api/favorites.js';
import { cn } from '../../lib/cn.js';
import { today } from '../../lib/date.js';

const MOMENT_LABELS: Record<string, string> = {
  BREAKFAST: 'Petit-dejeuner',
  LUNCH: 'Dejeuner',
  DINNER: 'Diner',
  SNACK: 'Collation',
};

export function FavoriteList() {
  const { data: favorites, isLoading, error } = useFavorites();
  const applyFavorite = useApplyFavorite();
  const deleteFavorite = useDeleteFavorite();

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

  if (!favorites || favorites.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">Aucun favori enregistre</p>
    );
  }

  return (
    <div className="space-y-3">
      {favorites.map((fav) => (
        <div key={fav.id} className="rounded-lg border border-border bg-card p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="text-sm font-semibold">{fav.name}</h3>
              {fav.moment && (
                <p className="text-xs text-muted-foreground">
                  {MOMENT_LABELS[fav.moment] ?? fav.moment}
                </p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                {fav.items.length} aliment{fav.items.length > 1 ? 's' : ''} - utilise{' '}
                {fav.usageCount} fois
              </p>
            </div>
          </div>

          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => applyFavorite.mutate({ id: fav.id, date: today() })}
              disabled={applyFavorite.isPending}
              className={cn(
                'min-h-9 flex-1 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors active:opacity-90',
                applyFavorite.isPending && 'opacity-50',
              )}
            >
              Appliquer
            </button>
            <button
              type="button"
              onClick={() => deleteFavorite.mutate(fav.id)}
              disabled={deleteFavorite.isPending}
              className={cn(
                'min-h-9 rounded-lg bg-secondary px-3 py-1.5 text-sm font-medium text-destructive transition-colors active:opacity-90',
                deleteFavorite.isPending && 'opacity-50',
              )}
            >
              Supprimer
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
