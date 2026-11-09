import { Plus } from 'lucide-react';
import type { MenuItem } from '../types';
import { formatPrice } from '../lib/format';
import { selectQty, useCartStore } from '../store/cartStore';
import { ItemImage } from './ItemImage';
import { QuantityStepper } from './QuantityStepper';
import { VegBadge } from './VegBadge';

export function MenuCard({ item }: { item: MenuItem }) {
  const qty = useCartStore(selectQty(item._id));
  const add = useCartStore((s) => s.add);
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);

  return (
    <article className="card group flex flex-col overflow-hidden transition hover:shadow-md">
      <div className="relative">
        <ItemImage src={item.imageUrl} alt={item.name} category={item.category} className="h-40 w-full sm:h-44" />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-medium capitalize text-stone-700 backdrop-blur">
          {item.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start gap-2">
          <VegBadge isVeg={item.isVeg} />
          <h3 className="font-semibold leading-tight text-stone-900">{item.name}</h3>
        </div>
        <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-stone-500">{item.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-stone-900">{formatPrice(item.price)}</span>
          {qty > 0 ? (
            <QuantityStepper value={qty} onIncrement={() => increment(item._id)} onDecrement={() => decrement(item._id)} label={item.name} />
          ) : (
            <button type="button" onClick={() => add(item)} className="btn-primary h-10 px-4" aria-label={`Add ${item.name} to cart`}>
              <Plus size={16} /> Add
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
