import { FoodCategory } from '@thirty/shared';
import { cn } from '../../lib/cn.js';

const CATEGORY_ORDER: FoodCategory[] = [
  FoodCategory.VEGETABLE,
  FoodCategory.FRUIT,
  FoodCategory.LEGUME,
  FoodCategory.GRAIN,
  FoodCategory.NUT_SEED,
  FoodCategory.HERB_SPICE,
  FoodCategory.DAIRY,
  FoodCategory.CHEESE,
  FoodCategory.MEAT,
  FoodCategory.FISH,
  FoodCategory.EGG,
  FoodCategory.FERMENTED_CONDIMENT,
  FoodCategory.BEVERAGE,
  FoodCategory.OTHER,
];

const LABELS: Record<FoodCategory, string> = {
  [FoodCategory.VEGETABLE]: 'Legume',
  [FoodCategory.FRUIT]: 'Fruit',
  [FoodCategory.LEGUME]: 'Legumineuse',
  [FoodCategory.GRAIN]: 'Cereale',
  [FoodCategory.NUT_SEED]: 'Noix / graine',
  [FoodCategory.HERB_SPICE]: 'Herbe / epice',
  [FoodCategory.DAIRY]: 'Produit laitier',
  [FoodCategory.CHEESE]: 'Fromage',
  [FoodCategory.MEAT]: 'Viande',
  [FoodCategory.FISH]: 'Poisson',
  [FoodCategory.EGG]: 'Oeuf',
  [FoodCategory.FERMENTED_CONDIMENT]: 'Condiment fermente',
  [FoodCategory.BEVERAGE]: 'Boisson',
  [FoodCategory.OTHER]: 'Autre',
};

interface FoodCategoryPickerProps {
  value: FoodCategory | null;
  onChange: (c: FoodCategory) => void;
}

export function FoodCategoryPicker({ value, onChange }: FoodCategoryPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORY_ORDER.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onChange(cat)}
          className={cn(
            'min-h-9 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
            value === cat
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground',
          )}
        >
          {LABELS[cat]}
        </button>
      ))}
    </div>
  );
}
