import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { orderKeys } from '@/constants/queryKeys';
import type { ApiResponse } from '@/types/api';
import type { Order, OrderStatus } from '@/types/order';
import { ordersApi } from '../api/orders.api';

type ListCache = ApiResponse<Order[]> | undefined;

/** Optimistic status change across cached lists and the order detail. */
export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ order, status }: { order: Order; status: OrderStatus }) => ordersApi.updateStatus(order._id, status),
    onMutate: async ({ order, status }) => {
      await qc.cancelQueries({ queryKey: orderKeys.all });
      const lists = qc.getQueriesData<ListCache>({ queryKey: orderKeys.lists() });
      const detail = qc.getQueryData<Order>(orderKeys.detail(order._id));
      qc.setQueriesData<ListCache>({ queryKey: orderKeys.lists() }, (old) =>
        old ? { ...old, data: old.data.map((o) => (o._id === order._id ? { ...o, status } : o)) } : old,
      );
      if (detail) qc.setQueryData(orderKeys.detail(order._id), { ...detail, status });
      return { lists, detail };
    },
    onError: (_e, { order }, ctx) => {
      ctx?.lists.forEach(([key, data]) => qc.setQueryData(key, data));
      if (ctx?.detail) qc.setQueryData(orderKeys.detail(order._id), ctx.detail);
    },
    onSuccess: (updated) => toast.success(`${updated.orderNumber} → ${updated.status}`),
    onSettled: () => qc.invalidateQueries({ queryKey: orderKeys.all }),
  });
}
