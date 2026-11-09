import { cn } from '@/lib/cn';
import type { SelectOption } from './Input';

interface Props<V extends string> {
  value: V;
  onChange: (value: V) => void;
  options: readonly SelectOption<V>[];
  label: string;
}

/** Horizontally scrollable single-select chips (e.g. categories). */
export function ChipGroup<V extends string>({ value, onChange, options, label }: Props<V>) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]" role="tablist" aria-label={label}>
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value || 'all'}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={cn(
              'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium capitalize transition',
              active ? 'bg-brand-700 text-white shadow-sm' : 'border border-stone-200 bg-white text-stone-600 hover:border-brand-200 hover:text-brand-700',
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
