import { Link } from 'react-router-dom';
import { Coffee, ShoppingBag } from 'lucide-react';
import { selectCount, useCartStore } from '../store/cartStore';

export function Header({ showCart = true }: { showCart?: boolean }) {
  const count = useCartStore(selectCount);
  const open = useCartStore((s) => s.open);
  const table = useCartStore((s) => s.tableNumber);

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/menu" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-700 text-white">
            <Coffee size={20} />
          </span>
          <span className="leading-tight">
            <span className="block font-bold text-stone-900">Brew &amp; Bite</span>
            <span className="block text-xs text-stone-500">{table ? `Table ${table}` : 'Cafe'}</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link to="/my-orders" className="btn-ghost hidden sm:inline-flex">My orders</Link>
          {showCart && (
            <button type="button" onClick={open} className="btn-primary relative" aria-label={`Open cart, ${count} items`}>
              <ShoppingBag size={18} />
              <span className="hidden sm:inline">Cart</span>
              {count > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1 text-xs font-bold text-stone-900">
                  {count}
                </span>
              )}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
