import { useCallback, useEffect, useState } from 'react';
import { STORAGE_KEYS } from '@/constants/storage';
import { session } from '@/lib/storage';
import { useTableStore } from '../store/table.store';

export const parseTable = (raw: string | null | undefined) => {
  const n = Number(raw);
  return raw && Number.isInteger(n) && n > 0 && n <= 500 ? n : null;
};

/**
 * Applies a table number coming from the QR link and decides whether to show the
 * welcome pop-up (once per table per browser session, not on every refresh).
 */
export function useTableSession(tableFromUrl: string) {
  const urlTable = parseTable(tableFromUrl);
  const tableNumber = useTableStore((s) => s.tableNumber);
  const setTable = useTableStore((s) => s.setTable);

  useEffect(() => {
    if (urlTable && urlTable !== tableNumber) setTable(urlTable);
  }, [urlTable, tableNumber, setTable]);

  const [dismissedFor, setDismissedFor] = useState<number | null>(null);
  const welcomeOpen =
    urlTable !== null && dismissedFor !== urlTable && !session.get<boolean>(STORAGE_KEYS.welcomeSeen(urlTable), false);

  const dismissWelcome = useCallback(() => {
    if (urlTable) session.set(STORAGE_KEYS.welcomeSeen(urlTable), true);
    setDismissedFor(urlTable);
  }, [urlTable]);

  return { tableNumber: urlTable ?? tableNumber, welcomeOpen, dismissWelcome };
}
