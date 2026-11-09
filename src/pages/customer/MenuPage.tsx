import { Button, EmptyState, ErrorState } from '@/components/ui';
import { WakingBanner } from '@/components/common/WakingBanner';
import { MenuCard, MenuFilters, MenuGrid, MenuGridSkeleton, MenuHero, useMenuItems } from '@/features/menu';
import { MobileCartBar, useCart } from '@/features/cart';
import { useTableSession, WelcomeTableModal } from '@/features/table';
import { DEFAULT_SORT, SEARCH_DEBOUNCE_MS } from '@/constants/menu';
import { isCategory, isPositiveInt, isSort } from '@/constants/guards';
import { useUrlState } from '@/hooks/useUrlState';
import { useDebouncedInput } from '@/hooks/useDebouncedInput';
import { useSlowLoading } from '@/hooks/useSlowLoading';
import { getErrorMessage } from '@/lib/errors';
import { pluralize } from '@/lib/format';
import type { Category, SortOption } from '@/types/menu';

const URL_DEFAULTS = { q: '', category: '', sort: DEFAULT_SORT, table: '' };
const URL_VALIDATORS = { category: isCategory, sort: isSort, table: isPositiveInt };

export default function MenuPage() {
  const [url, setUrl, resetUrl] = useUrlState(URL_DEFAULTS, URL_VALIDATORS);
  const category = url.category as Category | '';
  const sort = url.sort as SortOption;

  const { tableNumber, welcomeOpen, dismissWelcome } = useTableSession(url.table);
  const [search, setSearch] = useDebouncedInput(url.q, (q) => setUrl({ q }), SEARCH_DEBOUNCE_MS);

  const menu = useMenuItems({ search: url.q, category, sort });
  const slow = useSlowLoading(menu.isLoading);
  const cart = useCart();
  const items = menu.data ?? [];
  const hasFilters = Boolean(url.q || category);

  return (
    <div className="pb-28">
      <MenuHero tableNumber={tableNumber} />

      <main className="mx-auto max-w-7xl px-4">
        <div className="sticky top-16 z-20 -mx-4 bg-stone-50/95 px-4 py-4 backdrop-blur">
          <MenuFilters
            search={search}
            onSearch={setSearch}
            category={category}
            onCategory={(c) => setUrl({ category: c })}
            sort={sort}
            onSort={(s) => setUrl({ sort: s })}
          />
        </div>

        {slow && <WakingBanner />}

        {menu.isError && !menu.data ? (
          <ErrorState message={getErrorMessage(menu.error)} onRetry={() => menu.refetch()} />
        ) : menu.isLoading ? (
          <MenuGridSkeleton />
        ) : items.length === 0 ? (
          <EmptyState
            title="No items found"
            hint={hasFilters ? 'Try a different search or category.' : 'The menu is empty right now.'}
            action={
              hasFilters && (
                <Button variant="outline" onClick={() => resetUrl(['table'])}>
                  Clear filters
                </Button>
              )
            }
          />
        ) : (
          <>
            <p className="mb-3 text-sm text-stone-500" aria-live="polite">
              {pluralize(items.length, 'item')}
              {category && <> in <span className="capitalize">{category}</span></>}
              {url.q && <> matching “{url.q}”</>}
            </p>
            <MenuGrid dimmed={menu.isPlaceholderData}>
              {items.map((item) => (
                <MenuCard
                  key={item._id}
                  item={item}
                  quantity={cart.quantityOf(item._id)}
                  onAdd={cart.add}
                  onIncrement={cart.increment}
                  onDecrement={cart.decrement}
                />
              ))}
            </MenuGrid>
          </>
        )}
      </main>

      <MobileCartBar />
      <WelcomeTableModal open={welcomeOpen} tableNumber={tableNumber} onClose={dismissWelcome} />
    </div>
  );
}
