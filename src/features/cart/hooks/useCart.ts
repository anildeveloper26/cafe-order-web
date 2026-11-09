import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { selectCount, selectTotal, useCartStore } from '../store/cart.store';

/** Read-only cart view + actions, with stable references. */
export function useCart() {
  const lines = useCartStore((s) => s.lines);
  const count = useCartStore(selectCount);
  const total = useCartStore(selectTotal);
  const actions = useCartStore(
    useShallow((s) => ({
      add: s.add,
      increment: s.increment,
      decrement: s.decrement,
      remove: s.remove,
      clear: s.clear,
      openDrawer: s.openDrawer,
      closeDrawer: s.closeDrawer,
      openCheckout: s.openCheckout,
      closeCheckout: s.closeCheckout,
    })),
  );
  const quantityOf = useMemo(() => {
    const map = new Map(lines.map((l) => [l.item._id, l.quantity]));
    return (id: string) => map.get(id) ?? 0;
  }, [lines]);
  return { lines, count, total, quantityOf, ...actions };
}
