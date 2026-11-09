import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderKeys } from '@/constants/queryKeys';
import type { PlaceOrderInput } from '@/types/order';
import { ordersApi } from '../api/orders.api';

export function usePlaceOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: PlaceOrderInput) => ordersApi.place(body),
    onSuccess: (order) => {
      qc.setQueryData(orderKeys.detail(order._id), order);
      return qc.invalidateQueries({ queryKey: orderKeys.lists() });
    },
    meta: { skipGlobalError: true }, // checkout form shows field errors + its own toast
  });
}
