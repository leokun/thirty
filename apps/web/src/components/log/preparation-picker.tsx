import type { PreparationMethod } from '@thirty/shared';
import { cn } from '../../lib/cn.js';

interface PreparationPickerProps {
  availablePreparations: PreparationMethod[];
  defaultPreparation: PreparationMethod;
  value: PreparationMethod;
  onChange: (method: PreparationMethod) => void;
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

export function PreparationPicker({
  availablePreparations,
  value,
  onChange,
}: PreparationPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {availablePreparations.map((prep) => (
        <button
          key={prep}
          type="button"
          onClick={() => onChange(prep)}
          className={cn(
            'min-h-9 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
            value === prep
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground',
          )}
        >
          {PREPARATION_LABELS[prep] ?? prep}
        </button>
      ))}
    </div>
  );
}
