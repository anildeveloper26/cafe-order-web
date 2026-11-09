import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { orderKeys } from '@/constants/queryKeys';
import type { OrderFilters } from '@/types/order';
import { ordersApi } from '../api/orders.api';

export function useOrders(filters: OrderFilters, options: { enabled?: boolean; live?: boolean } = {}) {
  return useQuery({
    queryKey: orderKeys.list(filters),
    queryFn: ({ signal }) => ordersApi.list(filters, signal),
    select: (res) => res.data,
    enabled: options.enabled ?? true,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: options.live ?? false,
  });
}
