import { useEffect, useRef, useState } from 'react';

interface FoodSearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function FoodSearchInput({ value, onChange }: FoodSearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [local, setLocal] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setLocal(v);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onChange(v), 200);
  }

  return (
    <input
      ref={inputRef}
      type="text"
      value={local}
      onChange={handleChange}
      placeholder="Rechercher un aliment..."
      className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-ring focus:ring-2"
    />
  );
}
