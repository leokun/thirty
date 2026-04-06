import { useNavigate } from '@tanstack/react-router';
import {
  type FoodCategory,
  type FoodResponse,
  type MealMoment,
  type PortionSize,
  PreparationMethod,
} from '@thirty/shared';
import { useMemo, useState } from 'react';
import { useApplyFavorite } from '../../api/favorites.js';
import { useFood } from '../../api/foods.js';
import { useQuickAdd } from '../../api/journal.js';
import { today } from '../../lib/date.js';
import { FoodCategoryPicker } from './food-category-picker.js';
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

type Step = 'search' | 'customCategory' | 'preparation';

const ALL_PREPARATIONS = Object.values(PreparationMethod) as PreparationMethod[];

type CatalogSelection = {
  kind: 'catalog';
  id: string;
  nameFr: string;
  availablePreparations: PreparationMethod[];
  defaultPreparation: PreparationMethod;
};

type CustomSelection = {
  kind: 'custom';
  nameFr: string;
  category: FoodCategory;
  availablePreparations: PreparationMethod[];
  defaultPreparation: PreparationMethod;
};

type DisplayFood = CatalogSelection | CustomSelection;

export function LogPage({ initialDate, initialMoment }: LogPageProps) {
  const navigate = useNavigate();
  const date = initialDate ?? today();

  const [moment, setMoment] = useState<MealMoment>(initialMoment ?? getDefaultMoment());
  const [step, setStep] = useState<Step>('search');
  const [query, setQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<CatalogSelection | CustomSelection | null>(null);
  const [preparation, setPreparation] = useState<PreparationMethod>(PreparationMethod.RAW);
  const [portion, setPortion] = useState<PortionSize | null>(null);
  const [customDraftName, setCustomDraftName] = useState('');
  const [customCategory, setCustomCategory] = useState<FoodCategory | null>(null);

  const quickAdd = useQuickAdd();
  const applyFavorite = useApplyFavorite();

  const { data: fullFood } = useFood(
    selectedFood?.kind === 'catalog' && selectedFood.availablePreparations.length === 0
      ? selectedFood.id
      : '',
  );

  const currentFood = useMemo((): DisplayFood | null => {
    if (!selectedFood) return null;
    if (selectedFood.kind === 'custom') return selectedFood;
    if (selectedFood.availablePreparations.length > 0) return selectedFood;
    if (fullFood) {
      return {
        kind: 'catalog',
        id: selectedFood.id,
        nameFr: selectedFood.nameFr,
        availablePreparations: fullFood.availablePreparations,
        defaultPreparation: fullFood.defaultPreparation,
      };
    }
    return selectedFood;
  }, [selectedFood, fullFood]);

  function handleSelectFood(
    food: Pick<FoodResponse, 'id' | 'nameFr' | 'availablePreparations' | 'defaultPreparation'>,
  ) {
    setSelectedFood({
      kind: 'catalog',
      id: food.id,
      nameFr: food.nameFr,
      availablePreparations: food.availablePreparations,
      defaultPreparation: food.defaultPreparation,
    });
    setPreparation(food.defaultPreparation);
    setStep('preparation');
  }

  function handleStartCustom(prefill: string) {
    setCustomDraftName(prefill);
    setCustomCategory(null);
    setStep('customCategory');
  }

  function handleCustomContinue() {
    const name = customDraftName.trim();
    if (!name || customCategory == null) return;
    setSelectedFood({
      kind: 'custom',
      nameFr: name,
      category: customCategory,
      availablePreparations: ALL_PREPARATIONS,
      defaultPreparation: PreparationMethod.RAW,
    });
    setPreparation(PreparationMethod.RAW);
    setStep('preparation');
  }

  function handleApplyFavorite(favoriteId: string) {
    applyFavorite.mutate(
      { id: favoriteId, date },
      { onSuccess: () => navigate({ to: '/journal' }) },
    );
  }

  function resetAfterAdd() {
    setStep('search');
    setQuery('');
    setSelectedFood(null);
    setPreparation(PreparationMethod.RAW);
    setPortion(null);
    setCustomDraftName('');
    setCustomCategory(null);
  }

  function handleConfirm() {
    if (!currentFood) return;
    const base = {
      date,
      moment,
      preparationMethod: preparation,
      ...(portion != null && { portionSize: portion }),
    };
    if (currentFood.kind === 'catalog') {
      quickAdd.mutate({ ...base, foodId: currentFood.id }, { onSuccess: resetAfterAdd });
    } else {
      quickAdd.mutate(
        {
          ...base,
          customFood: {
            nameFr: currentFood.nameFr.trim(),
            category: currentFood.category,
          },
        },
        { onSuccess: resetAfterAdd },
      );
    }
  }

  function handleBack() {
    if (step === 'preparation') {
      setStep('search');
      setSelectedFood(null);
    } else if (step === 'customCategory') {
      setStep('search');
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
            <FoodSearchResults
              query={query}
              onSelect={handleSelectFood}
              onAddCustom={handleStartCustom}
            />
          ) : (
            <QuickAddPanel
              onSelectFood={handleSelectFood}
              onApplyFavorite={handleApplyFavorite}
              onStartCustomFood={() => handleStartCustom('')}
            />
          )}
        </div>
      )}

      {step === 'customCategory' && (
        <div className="space-y-4">
          <div>
            <label
              htmlFor="custom-food-name"
              className="mb-1 block text-sm font-medium text-muted-foreground"
            >
              Nom de l&apos;aliment
            </label>
            <input
              id="custom-food-name"
              type="text"
              value={customDraftName}
              onChange={(e) => setCustomDraftName(e.target.value)}
              placeholder="Ex. soupe du jour"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-ring focus:ring-2"
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">
              Categorie (pour le score)
            </p>
            <FoodCategoryPicker value={customCategory} onChange={setCustomCategory} />
          </div>
          <button
            type="button"
            onClick={handleCustomContinue}
            disabled={!customDraftName.trim() || customCategory == null}
            className="min-h-11 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors disabled:opacity-50 active:opacity-90"
          >
            Continuer
          </button>
        </div>
      )}

      {step === 'preparation' && currentFood && (
        <div className="space-y-4">
          <div>
            <p className="mb-1 text-sm font-medium text-muted-foreground">Aliment</p>
            <p className="text-base font-semibold">{currentFood.nameFr}</p>
            {currentFood.kind === 'custom' && (
              <p className="text-xs text-muted-foreground">
                Personnalise : score estime selon la categorie
              </p>
            )}
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
          <div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">Portion (optionnel)</p>
            <PortionPicker value={portion} onChange={setPortion} />
          </div>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={quickAdd.isPending || currentFood.availablePreparations.length === 0}
            className="min-h-11 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors disabled:opacity-50 active:opacity-90"
          >
            {quickAdd.isPending ? 'Ajout...' : 'Ajouter'}
          </button>
          {quickAdd.isError && (
            <p className="text-center text-sm text-destructive">Erreur lors de l&apos;ajout</p>
          )}
        </div>
      )}
    </div>
  );
}
