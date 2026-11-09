import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MAX_CART_QTY } from '@/constants/menu';
import { STORAGE_KEYS } from '@/constants/storage';
import { roundMoney } from '@/lib/format';
import type { MenuItem } from '@/types/menu';

export type CartItem = Pick<MenuItem, '_id' | 'name' | 'price' | 'imageUrl' | 'category' | 'isVeg'>;
export interface CartLine {
  item: CartItem;
  quantity: number;
}

const toCartItem = ({ _id, name, price, imageUrl, category, isVeg }: CartItem): CartItem => ({ _id, name, price, imageUrl, category, isVeg });
const clampQty = (n: number) => Math.min(Math.max(Math.floor(n), 0), MAX_CART_QTY);

interface CartState {
  lines: CartLine[];
  isDrawerOpen: boolean;
  isCheckoutOpen: boolean;
  add: (item: MenuItem) => void;
  setQuantity: (id: string, qty: number) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  /** Drops lines whose item is gone/unavailable and refreshes name/price from the live menu. */
  syncWithMenu: (items: MenuItem[]) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isDrawerOpen: false,
      isCheckoutOpen: false,
      add: (item) => {
        const existing = get().lines.find((l) => l.item._id === item._id);
        if (existing) return get().increment(item._id);
        set((s) => ({ lines: [...s.lines, { item: toCartItem(item), quantity: 1 }] }));
      },
      setQuantity: (id, qty) =>
        set((s) => ({
          lines: s.lines.flatMap((l) => (l.item._id !== id ? [l] : clampQty(qty) > 0 ? [{ ...l, quantity: clampQty(qty) }] : [])),
        })),
      increment: (id) => get().setQuantity(id, (get().lines.find((l) => l.item._id === id)?.quantity ?? 0) + 1),
      decrement: (id) => get().setQuantity(id, (get().lines.find((l) => l.item._id === id)?.quantity ?? 0) - 1),
      remove: (id) => set((s) => ({ lines: s.lines.filter((l) => l.item._id !== id) })),
      clear: () => set({ lines: [] }),
      syncWithMenu: (items) => {
        const byId = new Map(items.map((i) => [i._id, i]));
        const lines = get().lines.flatMap((l) => {
          const fresh = byId.get(l.item._id);
          return fresh ? [{ ...l, item: toCartItem(fresh) }] : [];
        });
        const changed = lines.length !== get().lines.length || lines.some((l, i) => l.item.price !== get().lines[i].item.price || l.item.name !== get().lines[i].item.name);
        if (changed) set({ lines });
      },
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      openCheckout: () => set({ isCheckoutOpen: true }),
      closeCheckout: () => set({ isCheckoutOpen: false }),
    }),
    { name: STORAGE_KEYS.cart, partialize: (s) => ({ lines: s.lines }) },
  ),
);

export const selectCount = (s: CartState) => s.lines.reduce((n, l) => n + l.quantity, 0);
export const selectTotal = (s: CartState) => roundMoney(s.lines.reduce((n, l) => n + l.item.price * l.quantity, 0));
export const selectQuantities = (s: CartState) => s.lines;
