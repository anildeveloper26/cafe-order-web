import { ChipGroup, SearchInput, Select, type SelectOption } from '@/components/ui';
import { CATEGORIES, SORT_OPTIONS } from '@/constants/menu';
import type { Category, SortOption } from '@/types/menu';

const CATEGORY_OPTIONS: SelectOption<Category | ''>[] = [
  { value: '', label: 'All' },
  ...CATEGORIES.map((c) => ({ value: c, label: c })),
];

const SORT_SELECT_OPTIONS = (Object.keys(SORT_OPTIONS) as SortOption[]).map((value) => ({ value, label: SORT_OPTIONS[value] }));

interface Props {
  search: string;
  onSearch: (v: string) => void;
  category: Category | '';
  onCategory: (c: Category | '') => void;
  sort: SortOption;
  onSort: (s: SortOption) => void;
}

export function MenuFilters({ search, onSearch, category, onCategory, sort, onSort }: Props) {
  return (
    <div className="space-y-3">
      {/* Search and sort share one row on phones too, so the sticky bar stays compact. */}
      <div className="flex gap-2 sm:gap-3">
        <SearchInput value={search} onChange={onSearch} placeholder="Search coffee, snacks…" label="Search menu" className="min-w-0 flex-1" />
        <Select value={sort} onChange={onSort} options={SORT_SELECT_OPTIONS} aria-label="Sort by" className="w-32 shrink-0 px-2.5 sm:w-56 sm:px-3.5" />
      </div>
      <ChipGroup value={category} onChange={onCategory} options={CATEGORY_OPTIONS} label="Categories" />
    </div>
  );
}
