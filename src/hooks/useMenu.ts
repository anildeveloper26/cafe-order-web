import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { fetchMenu, type MenuQuery } from '../api/menu';
import { getErrorMessage } from '../api/client';
import type { MenuItem } from '../types';

/** Loads menu items for the given query; cancels stale requests; flags slow (cold-start) loads. */
export function useMenu(query: MenuQuery) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [slow, setSlow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const { search, category, sort, available } = query;

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    const slowTimer = setTimeout(() => setSlow(true), 4000);

    fetchMenu({ search, category, sort, available }, controller.signal)
      .then((res) => setItems(res.data))
      .catch((err) => {
        if (!axios.isCancel(err)) setError(getErrorMessage(err));
      })
      .finally(() => {
        clearTimeout(slowTimer);
        if (!controller.signal.aborted) {
          setLoading(false);
          setSlow(false);
        }
      });

    return () => {
      clearTimeout(slowTimer);
      controller.abort();
    };
  }, [search, category, sort, available, reloadKey]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);
  return { items, setItems, loading, slow, error, reload };
}
