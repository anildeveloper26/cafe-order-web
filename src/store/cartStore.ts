import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MenuItem } from '../types';

export interface CartLine {
  item: Pick<MenuItem, '_id' | 'name' | 'price' | 'imageUrl' | 'category' | 'isVeg'>;
  quantity: number;
}

const MAX_QTY = 50;

interface CartState {
  lines: CartLine[];
  tableNumber: number | null;
  isOpen: boolean;
  add: (item: MenuItem) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  setQuantity: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  setTable: (n: number | null) => void;
  open: () => void;
  close: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      tableNumber: null,
      isOpen: false,
      add: (item) =>
        set((s) => {
          const existing = s.lines.find((l) => l.item._id === item._id);
          if (existing) {
            return { lines: s.lines.map((l) => (l === existing ? { ...l, quantity: Math.min(l.quantity + 1, MAX_QTY) } : l)) };
          }
          const { _id, name, price, imageUrl, category, isVeg } = item;
          return { lines: [...s.lines, { item: { _id, name, price, imageUrl, category, isVeg }, quantity: 1 }] };
        }),
      increment: (id) =>
        set((s) => ({ lines: s.lines.map((l) => (l.item._id === id ? { ...l, quantity: Math.min(l.quantity + 1, MAX_QTY) } : l)) })),
      decrement: (id) =>
        set((s) => ({
          lines: s.lines.flatMap((l) => (l.item._id !== id ? [l] : l.quantity > 1 ? [{ ...l, quantity: l.quantity - 1 }] : [])),
        })),
      setQuantity: (id, qty) =>
        set((s) => ({
          lines: s.lines.flatMap((l) =>
            l.item._id !== id ? [l] : qty > 0 ? [{ ...l, quantity: Math.min(Math.floor(qty), MAX_QTY) }] : [],
          ),
        })),
      remove: (id) => set((s) => ({ lines: s.lines.filter((l) => l.item._id !== id) })),
      clear: () => set({ lines: [] }),
      setTable: (n) => set({ tableNumber: n }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    { name: 'cafe-cart', partialize: (s) => ({ lines: s.lines, tableNumber: s.tableNumber }) },
  ),
);

export const selectCount = (s: CartState) => s.lines.reduce((n, l) => n + l.quantity, 0);
export const selectTotal = (s: CartState) => Math.round(s.lines.reduce((n, l) => n + l.item.price * l.quantity, 0) * 100) / 100;
export const selectQty = (id: string) => (s: CartState) => s.lines.find((l) => l.item._id === id)?.quantity ?? 0;
