import type {
  CreateFavoriteInput,
  MealMoment,
  PortionSize,
  PreparationMethod,
} from '@thirty/shared';
import { useState } from 'react';
import { useCreateFavorite } from '../../api/favorites.js';
import { cn } from '../../lib/cn.js';

interface SaveFavoriteDialogProps {
  items: { foodId: string; preparationMethod: string; portionSize?: string | undefined }[];
  onClose: () => void;
}

const MOMENTS: { value: MealMoment | ''; label: string }[] = [
  { value: '', label: 'Aucun' },
  { value: 'BREAKFAST', label: 'Petit-dejeuner' },
  { value: 'LUNCH', label: 'Dejeuner' },
  { value: 'DINNER', label: 'Diner' },
  { value: 'SNACK', label: 'Collation' },
];

export function SaveFavoriteDialog({ items, onClose }: SaveFavoriteDialogProps) {
  const [name, setName] = useState('');
  const [moment, setMoment] = useState<MealMoment | ''>('');
  const createFavorite = useCreateFavorite();

  function handleSave() {
    if (!name.trim()) return;
    const mappedItems = items.map((item) => ({
      foodId: item.foodId,
      preparationMethod: item.preparationMethod as PreparationMethod,
      ...(item.portionSize ? { portionSize: item.portionSize as PortionSize } : {}),
    }));
    const input: CreateFavoriteInput = moment
      ? { name: name.trim(), moment, items: mappedItems }
      : { name: name.trim(), items: mappedItems };
    createFavorite.mutate(input, { onSuccess: () => onClose() });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40">
      <div className="w-full max-w-lg rounded-t-2xl bg-background p-4 pb-[env(safe-area-inset-bottom)]">
        <h2 className="mb-4 text-lg font-bold">Sauvegarder en favori</h2>

        <div className="space-y-3">
          <div>
            <label htmlFor="fav-name" className="mb-1 block text-sm font-medium">
              Nom
            </label>
            <input
              id="fav-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Mon repas prefere"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-ring focus:ring-2"
            />
          </div>

          <div>
            <p className="mb-1 text-sm font-medium">Moment</p>
            <div className="flex flex-wrap gap-2">
              {MOMENTS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMoment(m.value as MealMoment | '')}
                  className={cn(
                    'min-h-9 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                    moment === m.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground',
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="min-h-11 flex-1 rounded-lg bg-secondary px-4 py-2.5 text-sm font-medium transition-colors active:opacity-90"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!name.trim() || createFavorite.isPending}
              className="min-h-11 flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors disabled:opacity-50 active:opacity-90"
            >
              {createFavorite.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
