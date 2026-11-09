import { useEffect } from 'react';
import type { MenuItem } from '@/types/menu';
import { useCartStore } from '../store/cart.store';

/** Keeps the persisted cart consistent with the full list of orderable items. */
export function useCartSync(availableItems: MenuItem[] | undefined) {
  const syncWithMenu = useCartStore((s) => s.syncWithMenu);
  useEffect(() => {
    if (availableItems) syncWithMenu(availableItems);
  }, [availableItems, syncWithMenu]);
}
