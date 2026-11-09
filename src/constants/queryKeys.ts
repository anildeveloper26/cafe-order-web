import type { MenuFilters } from '@/types/menu';
import type { OrderFilters } from '@/types/order';

/** Central query-key factory: invalidate by prefix (e.g. menuKeys.all) or target exact keys. */
export const menuKeys = {
  all: ['menu'] as const,
  lists: () => [...menuKeys.all, 'list'] as const,
  list: (filters: MenuFilters) => [...menuKeys.lists(), filters] as const,
  detail: (id: string) => [...menuKeys.all, 'detail', id] as const,
};

export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters: OrderFilters) => [...orderKeys.lists(), filters] as const,
  detail: (id: string) => [...orderKeys.all, 'detail', id] as const,
  stats: () => [...orderKeys.all, 'stats'] as const,
};
