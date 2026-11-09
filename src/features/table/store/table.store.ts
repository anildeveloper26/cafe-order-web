import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/constants/storage';

interface TableState {
  tableNumber: number | null;
  setTable: (n: number | null) => void;
}

/** The table the customer scanned; persisted so it survives refresh and navigation. */
export const useTableStore = create<TableState>()(
  persist((set) => ({ tableNumber: null, setTable: (tableNumber) => set({ tableNumber }) }), { name: STORAGE_KEYS.table }),
);
