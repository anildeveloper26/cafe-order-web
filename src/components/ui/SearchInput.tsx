import { Search, X } from 'lucide-react';
import { fieldClasses } from './Input';
import { cn } from '@/lib/cn';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export function SearchInput({ value, onChange, placeholder = 'Search…', label = 'Search', className }: Props) {
  return (
    <label className={cn('relative block', className)}>
      <span className="sr-only">{label}</span>
      <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cn(fieldClasses, 'pl-10 pr-9')} />
      {value && (
        <button type="button" onClick={() => onChange('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-stone-400 hover:text-stone-700" aria-label="Clear search">
          <X size={16} />
        </button>
      )}
    </label>
  );
}
