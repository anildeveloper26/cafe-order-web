import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/cn';

interface Props {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  size?: 'sm' | 'md';
  label: string;
}

export function QuantityStepper({ value, onIncrement, onDecrement, size = 'md', label }: Props) {
  return (
    <div className={cn('inline-flex items-center rounded-xl border border-brand-200 bg-brand-50 text-brand-700', size === 'sm' ? 'h-8' : 'h-10')}>
      <button type="button" onClick={onDecrement} className="flex h-full w-9 items-center justify-center rounded-l-xl hover:bg-brand-100" aria-label={`Decrease ${label} quantity`}>
        <Minus size={16} />
      </button>
      <span className="min-w-7 text-center text-sm font-bold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button type="button" onClick={onIncrement} className="flex h-full w-9 items-center justify-center rounded-r-xl hover:bg-brand-100" aria-label={`Increase ${label} quantity`}>
        <Plus size={16} />
      </button>
    </div>
  );
}
