import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { menuKeys } from '@/constants/queryKeys';
import type { MenuFilters } from '@/types/menu';
import { menuApi } from '../api/menu.api';

/** Normalises filters so equivalent filters share one cache entry. */
const normalise = ({ search = '', category = '', sort = 'name', available = 'true' }: MenuFilters): MenuFilters => ({
  search: search.trim(),
  category,
  sort,
  available,
});

export function useMenuItems(filters: MenuFilters = {}) {
  const key = normalise(filters);
  return useQuery({
    queryKey: menuKeys.list(key),
    queryFn: ({ signal }) => menuApi.list(key, signal),
    select: (res) => res.data,
    placeholderData: keepPreviousData,
  });
}
