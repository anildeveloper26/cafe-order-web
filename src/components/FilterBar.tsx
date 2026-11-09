import { Search, X } from 'lucide-react';
import { CATEGORIES, type Category, type SortOption } from '../types';

interface Props {
  search: string;
  onSearch: (v: string) => void;
  category: Category | '';
  onCategory: (c: Category | '') => void;
  sort: SortOption;
  onSort: (s: SortOption) => void;
}

const SORT_LABELS: Record<SortOption, string> = {
  name: 'Name (A–Z)',
  price_asc: 'Price: Low to High',
  price_desc: 'Price: High to Low',
  newest: 'Newest',
};

export function FilterBar({ search, onSearch, category, onCategory, sort, onSort }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search menu</span>
          <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search coffee, snacks, desserts…"
            className="input pl-10 pr-9"
          />
          {search && (
            <button type="button" onClick={() => onSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-stone-400 hover:text-stone-700" aria-label="Clear search">
              <X size={16} />
            </button>
          )}
        </label>
        <label className="sm:w-56">
          <span className="sr-only">Sort by</span>
          <select value={sort} onChange={(e) => onSort(e.target.value as SortOption)} className="input cursor-pointer">
            {(Object.keys(SORT_LABELS) as SortOption[]).map((s) => (
              <option key={s} value={s}>
                {SORT_LABELS[s]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]" role="tablist" aria-label="Categories">
        {(['', ...CATEGORIES] as const).map((c) => {
          const active = category === c;
          return (
            <button
              key={c || 'all'}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onCategory(c)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
                active ? 'bg-brand-700 text-white shadow-sm' : 'border border-stone-200 bg-white text-stone-600 hover:border-brand-200 hover:text-brand-700'
              }`}
            >
              {c || 'All'}
            </button>
          );
        })}
      </div>
    </div>
  );
}
