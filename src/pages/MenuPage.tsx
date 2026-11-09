import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { QrCode, ShoppingBag } from 'lucide-react';
import { Header } from '../components/Header';
import { FilterBar } from '../components/FilterBar';
import { MenuCard } from '../components/MenuCard';
import { CartDrawer } from '../components/CartDrawer';
import { CheckoutModal } from '../components/CheckoutModal';
import { Modal } from '../components/Modal';
import { EmptyState, ErrorState, MenuSkeleton, WakingBanner } from '../components/States';
import { useDebounce } from '../hooks/useDebounce';
import { useMenu } from '../hooks/useMenu';
import { selectCount, selectTotal, useCartStore } from '../store/cartStore';
import { formatPrice } from '../lib/format';
import { CATEGORIES, type Category, type SortOption } from '../types';

export default function MenuPage() {
  const [params, setParams] = useSearchParams();
  const search = params.get('q') ?? '';
  const categoryParam = params.get('category') ?? '';
  const category: Category | '' = (CATEGORIES as readonly string[]).includes(categoryParam) ? (categoryParam as Category) : '';
  const sort = (params.get('sort') as SortOption) || 'name';
  const tableParam = params.get('table');

  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput.trim());
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [welcomeOpen, setWelcomeOpen] = useState(false);

  const setTable = useCartStore((s) => s.setTable);
  const tableNumber = useCartStore((s) => s.tableNumber);
  const openCart = useCartStore((s) => s.open);
  const count = useCartStore(selectCount);
  const total = useCartStore(selectTotal);

  // Arriving from a table QR code: remember the table and show the welcome pop-up.
  useEffect(() => {
    const n = Number(tableParam);
    if (tableParam && Number.isInteger(n) && n > 0) {
      setTable(n);
      setWelcomeOpen(true);
    }
  }, [tableParam, setTable]);

  const updateParam = (key: string, value: string) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        next.delete('table');
        return next;
      },
      { replace: true },
    );
  };

  useEffect(() => {
    if (debouncedSearch !== search) updateParam('q', debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const query = useMemo(() => ({ search: debouncedSearch, category, sort }), [debouncedSearch, category, sort]);
  const { items, loading, slow, error, reload } = useMenu(query);
  const syncWithMenu = useCartStore((s) => s.syncWithMenu);

  // The unfiltered list is the full set of orderable items: drop stale cart lines and refresh prices.
  useEffect(() => {
    if (!loading && !error && !debouncedSearch && !category) syncWithMenu(items);
  }, [items, loading, error, debouncedSearch, category, syncWithMenu]);

  const hasFilters = Boolean(debouncedSearch || category);

  return (
    <div className="min-h-screen pb-28">
      <Header />

      <section className="bg-gradient-to-br from-brand-700 via-brand-600 to-amber-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
          <p className="text-sm font-medium text-brand-100">{tableNumber ? `Welcome, Table ${tableNumber}` : 'Welcome'}</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">What would you like today?</h1>
          <p className="mt-2 max-w-xl text-sm text-brand-100">Browse the menu, add items to your cart and order straight from your table — no login needed.</p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4">
        <div className="sticky top-16 z-20 -mx-4 bg-stone-50/95 px-4 py-4 backdrop-blur">
          <FilterBar
            search={searchInput}
            onSearch={setSearchInput}
            category={category}
            onCategory={(c) => updateParam('category', c)}
            sort={sort}
            onSort={(s) => updateParam('sort', s === 'name' ? '' : s)}
          />
        </div>

        {slow && loading && <WakingBanner />}

        {error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : loading && items.length === 0 ? (
          <MenuSkeleton />
        ) : items.length === 0 ? (
          <EmptyState
            title="No items found"
            hint={hasFilters ? 'Try a different search or category.' : 'The menu is empty right now.'}
            action={
              hasFilters && (
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => {
                    setSearchInput('');
                    setParams({}, { replace: true });
                  }}
                >
                  Clear filters
                </button>
              )
            }
          />
        ) : (
          <>
            <p className="mb-3 text-sm text-stone-500" aria-live="polite">
              {items.length} item{items.length !== 1 && 's'}
              {category && <> in <span className="capitalize">{category}</span></>}
              {debouncedSearch && <> matching “{debouncedSearch}”</>}
            </p>
            <div className={`grid grid-cols-1 gap-4 transition-opacity sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${loading ? 'opacity-60' : ''}`}>
              {items.map((item) => (
                <MenuCard key={item._id} item={item} />
              ))}
            </div>
          </>
        )}
      </main>

      {count > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 p-4 sm:hidden">
          <button type="button" onClick={openCart} className="btn-primary h-14 w-full justify-between rounded-2xl px-5 text-base shadow-lg">
            <span className="flex items-center gap-2">
              <ShoppingBag size={18} /> {count} item{count !== 1 && 's'}
            </span>
            <span>View cart · {formatPrice(total)}</span>
          </button>
        </div>
      )}

      <CartDrawer onCheckout={() => setCheckoutOpen(true)} />
      <CheckoutModal key={String(checkoutOpen)} open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />

      <Modal open={welcomeOpen} onClose={() => setWelcomeOpen(false)} title={`Table ${tableNumber ?? ''}`}>
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
            <QrCode size={28} />
          </div>
          <h3 className="mt-3 text-lg font-bold text-stone-900">Welcome to Brew &amp; Bite!</h3>
          <ol className="mx-auto mt-3 max-w-xs space-y-1.5 text-left text-sm text-stone-600">
            <li>1. Pick your favourites from the menu</li>
            <li>2. Enter your mobile number at checkout</li>
            <li>3. We bring your order to Table {tableNumber}</li>
          </ol>
          <button type="button" onClick={() => setWelcomeOpen(false)} className="btn-primary mt-5 h-12 w-full">
            View menu
          </button>
        </div>
      </Modal>
    </div>
  );
}
