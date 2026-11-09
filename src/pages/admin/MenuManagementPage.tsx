import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button, CenteredSpinner, EmptyState, ErrorState, PageHeader, SearchInput, Select } from '@/components/ui';
import { DeleteMenuItemDialog, MenuItemForm, MenuTable, useMenuItems, useToggleAvailability } from '@/features/menu';
import { CATEGORIES, SEARCH_DEBOUNCE_MS } from '@/constants/menu';
import { isCategory } from '@/constants/guards';
import { useUrlState } from '@/hooks/useUrlState';
import { useDebouncedInput } from '@/hooks/useDebouncedInput';
import { getErrorMessage } from '@/lib/errors';
import type { Category, MenuItem } from '@/types/menu';

const URL_DEFAULTS = { q: '', category: '' };
const URL_VALIDATORS = { category: isCategory };
const CATEGORY_OPTIONS = [{ value: '' as const, label: 'All categories' }, ...CATEGORIES.map((c) => ({ value: c, label: c }))];

type FormState = { open: false } | { open: true; item: MenuItem | null };

export default function MenuManagementPage() {
  const [url, setUrl] = useUrlState(URL_DEFAULTS, URL_VALIDATORS);
  const category = url.category as Category | '';
  const [search, setSearch] = useDebouncedInput(url.q, (q) => setUrl({ q }), SEARCH_DEBOUNCE_MS);

  const menu = useMenuItems({ search: url.q, category, available: 'all' });
  const toggle = useToggleAvailability();
  const [form, setForm] = useState<FormState>({ open: false });
  const [toDelete, setToDelete] = useState<MenuItem | null>(null);
  const items = menu.data ?? [];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Menu items"
        actions={
          <Button onClick={() => setForm({ open: true, item: null })} icon={<Plus size={16} />}>
            Add item
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchInput value={search} onChange={setSearch} placeholder="Search items…" label="Search items" className="flex-1" />
        <Select<Category | ''> value={category} onChange={(c) => setUrl({ category: c })} options={CATEGORY_OPTIONS} aria-label="Filter by category" className="capitalize sm:w-48" />
      </div>

      {menu.isError && !menu.data ? (
        <ErrorState message={getErrorMessage(menu.error)} onRetry={() => menu.refetch()} />
      ) : menu.isLoading ? (
        <CenteredSpinner />
      ) : items.length === 0 ? (
        <EmptyState title="No menu items" hint={url.q || category ? 'Nothing matches these filters.' : 'Add your first item to get started.'} />
      ) : (
        <MenuTable items={items} onEdit={(item) => setForm({ open: true, item })} onDelete={setToDelete} onToggleAvailable={(item) => toggle.mutate(item)} />
      )}

      {form.open && <MenuItemForm key={form.item?._id ?? 'new'} item={form.item} onClose={() => setForm({ open: false })} />}
      <DeleteMenuItemDialog item={toDelete} onClose={() => setToDelete(null)} />
    </div>
  );
}
