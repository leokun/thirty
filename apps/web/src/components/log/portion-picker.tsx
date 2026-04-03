import type { PortionSize } from '@thirty/shared';
import { cn } from '../../lib/cn.js';

interface PortionPickerProps {
  value: PortionSize;
  onChange: (size: PortionSize) => void;
}

const PORTIONS: { value: PortionSize; label: string }[] = [
  { value: 'SMALL', label: 'S' },
  { value: 'MEDIUM', label: 'M' },
  { value: 'LARGE', label: 'L' },
];

export function PortionPicker({ value, onChange }: PortionPickerProps) {
  return (
    <div className="flex gap-2">
      {PORTIONS.map((p) => (
        <button
          key={p.value}
          type="button"
          onClick={() => onChange(p.value)}
          className={cn(
            'min-h-11 min-w-11 rounded-lg px-4 py-2 text-sm font-bold transition-colors',
            value === p.value
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground',
          )}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
