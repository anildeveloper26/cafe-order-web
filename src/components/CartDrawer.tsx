import { useEffect } from 'react';
import { ShoppingBag, Trash2, X } from 'lucide-react';
import { selectCount, selectTotal, useCartStore } from '../store/cartStore';
import { formatPrice } from '../lib/format';
import { ItemImage } from './ItemImage';
import { QuantityStepper } from './QuantityStepper';

export function CartDrawer({ onCheckout }: { onCheckout: () => void }) {
  const { lines, isOpen, close, increment, decrement, remove, clear, tableNumber } = useCartStore();
  const count = useCartStore(selectCount);
  const total = useCartStore(selectTotal);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label="Your cart">
      <div className="animate-fade-in absolute inset-0 bg-stone-900/40" onClick={close} />
      <aside className="animate-slide-in absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-stone-900">Your order</h2>
            <p className="text-xs text-stone-500">
              {count} item{count !== 1 && 's'}
              {tableNumber ? ` · Table ${tableNumber}` : ''}
            </p>
          </div>
          <button type="button" onClick={close} className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700" aria-label="Close cart">
            <X size={20} />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="rounded-full bg-brand-50 p-4 text-brand-600">
              <ShoppingBag size={28} />
            </div>
            <p className="mt-3 font-semibold text-stone-900">Your cart is empty</p>
            <p className="mt-1 text-sm text-stone-500">Add something tasty from the menu.</p>
            <button type="button" onClick={close} className="btn-primary mt-5">
              Browse menu
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-stone-100 overflow-y-auto px-5">
              {lines.map(({ item, quantity }) => (
                <li key={item._id} className="flex gap-3 py-4">
                  <ItemImage src={item.imageUrl} alt={item.name} category={item.category} className="h-16 w-16 shrink-0 rounded-xl" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate font-medium text-stone-900">{item.name}</p>
                      <button type="button" onClick={() => remove(item._id)} className="rounded-md p-1 text-stone-400 hover:bg-red-50 hover:text-red-600" aria-label={`Remove ${item.name}`}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-xs text-stone-500">{formatPrice(item.price)} each</p>
                    <div className="mt-2 flex items-center justify-between">
                      <QuantityStepper size="sm" value={quantity} onIncrement={() => increment(item._id)} onDecrement={() => decrement(item._id)} label={item.name} />
                      <span className="font-semibold tabular-nums text-stone-900">{formatPrice(item.price * quantity)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <footer className="space-y-3 border-t border-stone-100 bg-stone-50 px-5 py-4">
              <div className="flex items-center justify-between text-sm text-stone-600">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatPrice(total)}</span>
              </div>
              <div className="flex items-center justify-between text-lg font-bold text-stone-900">
                <span>Total</span>
                <span className="tabular-nums">{formatPrice(total)}</span>
              </div>
              <button type="button" onClick={onCheckout} className="btn-primary h-12 w-full text-base">
                Checkout · {formatPrice(total)}
              </button>
              <button type="button" onClick={clear} className="btn-ghost w-full text-stone-500">
                Clear cart
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
