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
      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchInput value={search} onChange={onSearch} placeholder="Search coffee, snacks, desserts…" label="Search menu" className="flex-1" />
        <Select value={sort} onChange={onSort} options={SORT_SELECT_OPTIONS} aria-label="Sort by" className="sm:w-56" />
      </div>
      <ChipGroup value={category} onChange={onCategory} options={CATEGORY_OPTIONS} label="Categories" />
    </div>
  );
}
