import { useQuery } from '@tanstack/react-query';
import { orderKeys } from '@/constants/queryKeys';
import { ordersApi } from '@/features/orders';

export function useOrderStats() {
  return useQuery({
    queryKey: orderKeys.stats(),
    queryFn: ({ signal }) => ordersApi.stats(signal),
    refetchOnWindowFocus: true,
  });
}
