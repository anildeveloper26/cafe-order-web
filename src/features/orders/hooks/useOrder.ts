import { useQuery } from '@tanstack/react-query';
import { orderKeys } from '@/constants/queryKeys';
import { ordersApi } from '../api/orders.api';

export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: ({ signal }) => ordersApi.get(id, signal),
    enabled: Boolean(id),
  });
}
