import { useNavigate } from '@tanstack/react-router';
import type { FoodResponse, MealMoment, PortionSize, PreparationMethod } from '@thirty/shared';
import { useState } from 'react';
import { useApplyFavorite } from '../../api/favorites.js';
import { useFood } from '../../api/foods.js';
import { useQuickAdd } from '../../api/journal.js';
import { today } from '../../lib/date.js';
import { FoodSearchInput } from './food-search-input.js';
import { FoodSearchResults } from './food-search-results.js';
import { getDefaultMoment, MealMomentPicker } from './meal-moment-picker.js';
import { PortionPicker } from './portion-picker.js';
import { PreparationPicker } from './preparation-picker.js';
import { QuickAddPanel } from './quick-add-panel.js';

interface LogPageProps {
  initialDate?: string | undefined;
  initialMoment?: MealMoment | undefined;
}

type Step = 'search' | 'preparation' | 'portion';

interface SelectedFood {
  id: string;
  nameFr: string;
  availablePreparations: PreparationMethod[];
  defaultPreparation: PreparationMethod;
}

export function LogPage({ initialDate, initialMoment }: LogPageProps) {
  const navigate = useNavigate();
  const date = initialDate ?? today();

  const [moment, setMoment] = useState<MealMoment>(initialMoment ?? getDefaultMoment());
  const [step, setStep] = useState<Step>('search');
  const [query, setQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<SelectedFood | null>(null);
  const [preparation, setPreparation] = useState<PreparationMethod>('RAW');
  const [portion, setPortion] = useState<PortionSize>('MEDIUM');

  const quickAdd = useQuickAdd();
  const applyFavorite = useApplyFavorite();

  // If selected food came from recents (no preparations), fetch full food data
  const { data: fullFood } = useFood(
    selectedFood && selectedFood.availablePreparations.length === 0 ? selectedFood.id : '',
  );

  const currentFood = selectedFood
    ? selectedFood.availablePreparations.length > 0
      ? selectedFood
      : fullFood
        ? {
            ...selectedFood,
            availablePreparations: fullFood.availablePreparations,
            defaultPreparation: fullFood.defaultPreparation,
          }
        : selectedFood
    : null;

  function handleSelectFood(
    food: Pick<FoodResponse, 'id' | 'nameFr' | 'availablePreparations' | 'defaultPreparation'>,
  ) {
    setSelectedFood({
      id: food.id,
      nameFr: food.nameFr,
      availablePreparations: food.availablePreparations,
      defaultPreparation: food.defaultPreparation,
    });
    setPreparation(food.defaultPreparation);
    setStep('preparation');
  }

  function handleApplyFavorite(favoriteId: string) {
    applyFavorite.mutate(
      { id: favoriteId, date },
      { onSuccess: () => navigate({ to: '/journal' }) },
    );
  }

  function handleConfirm() {
    if (!currentFood) return;
    quickAdd.mutate(
      {
        date,
        moment,
        foodId: currentFood.id,
        preparationMethod: preparation,
        portionSize: portion,
      },
      {
        onSuccess: () => {
          // Reset for another add
          setStep('search');
          setQuery('');
          setSelectedFood(null);
          setPreparation('RAW');
          setPortion('MEDIUM');
        },
      },
    );
  }

  function handleBack() {
    if (step === 'portion') {
      setStep('preparation');
    } else if (step === 'preparation') {
      setStep('search');
      setSelectedFood(null);
    } else {
      navigate({ to: '/journal' });
    }
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleBack}
          className="min-h-11 min-w-11 rounded-lg bg-secondary text-sm font-medium transition-colors active:bg-accent"
        >
          ←
        </button>
        <h1 className="text-lg font-bold">Ajouter un aliment</h1>
      </div>

      <MealMomentPicker value={moment} onChange={setMoment} />

      {step === 'search' && (
        <div className="space-y-3">
          <FoodSearchInput value={query} onChange={setQuery} />
          {query.length >= 2 ? (
            <FoodSearchResults query={query} onSelect={handleSelectFood} />
          ) : (
            <QuickAddPanel onSelectFood={handleSelectFood} onApplyFavorite={handleApplyFavorite} />
          )}
        </div>
      )}

      {step === 'preparation' && currentFood && (
        <div className="space-y-4">
          <div>
            <p className="mb-1 text-sm font-medium text-muted-foreground">Aliment</p>
            <p className="text-base font-semibold">{currentFood.nameFr}</p>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">Preparation</p>
            {currentFood.availablePreparations.length > 0 ? (
              <PreparationPicker
                availablePreparations={currentFood.availablePreparations}
                defaultPreparation={currentFood.defaultPreparation}
                value={preparation}
                onChange={setPreparation}
              />
            ) : (
              <p className="text-sm text-muted-foreground">Chargement...</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setStep('portion')}
            disabled={currentFood.availablePreparations.length === 0}
            className="min-h-11 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors disabled:opacity-50 active:opacity-90"
          >
            Suivant
          </button>
        </div>
      )}

      {step === 'portion' && currentFood && (
        <div className="space-y-4">
          <div>
            <p className="mb-1 text-sm font-medium text-muted-foreground">{currentFood.nameFr}</p>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">Portion</p>
            <PortionPicker value={portion} onChange={setPortion} />
          </div>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={quickAdd.isPending}
            className="min-h-11 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors disabled:opacity-50 active:opacity-90"
          >
            {quickAdd.isPending ? 'Ajout...' : 'Ajouter'}
          </button>
          {quickAdd.isError && (
            <p className="text-center text-sm text-destructive">Erreur lors de l'ajout</p>
          )}
        </div>
      )}
    </div>
  );
}
