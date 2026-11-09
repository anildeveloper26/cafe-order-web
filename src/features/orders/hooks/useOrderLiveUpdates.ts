import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { orderKeys } from '@/constants/queryKeys';
import { getSocket } from '@/lib/socket';
import type { ApiResponse } from '@/types/api';
import type { Order, OrderStatusEvent } from '@/types/order';

/** Customer: pushes status changes for one order straight into the query cache. */
export function useOrderLiveUpdates(orderId: string) {
  const qc = useQueryClient();
  useEffect(() => {
    if (!orderId) return;
    const socket = getSocket();
    const subscribe = () => socket.emit('order:subscribe', orderId);
    const onStatus = (e: OrderStatusEvent) => {
      if (e._id !== orderId) return;
      qc.setQueryData<Order>(orderKeys.detail(orderId), (old) => (old ? { ...old, status: e.status, updatedAt: e.updatedAt } : old));
    };
    subscribe();
    socket.on('connect', subscribe);
    socket.on('order:status', onStatus);
    return () => {
      socket.emit('order:unsubscribe', orderId);
      socket.off('connect', subscribe);
      socket.off('order:status', onStatus);
    };
  }, [orderId, qc]);
}

type ListCache = ApiResponse<Order[]> | undefined;

/** Admin: live feed of new orders and status changes for the whole dashboard. */
export function useAdminOrderFeed(token: string | null) {
  const qc = useQueryClient();
  useEffect(() => {
    if (!token) return;
    const socket = getSocket();
    const subscribe = () => socket.emit('admin:subscribe', token);
    const onNew = (o: Order) => {
      toast(`New order ${o.orderNumber}${o.tableNumber ? ` · Table ${o.tableNumber}` : ''}`, { icon: '🛎️' });
      qc.invalidateQueries({ queryKey: orderKeys.lists() });
      qc.invalidateQueries({ queryKey: orderKeys.stats() });
    };
    const onStatus = (e: OrderStatusEvent) => {
      qc.setQueriesData<ListCache>({ queryKey: orderKeys.lists() }, (old) =>
        old ? { ...old, data: old.data.map((o) => (o._id === e._id ? { ...o, status: e.status } : o)) } : old,
      );
      qc.invalidateQueries({ queryKey: orderKeys.stats() });
    };
    subscribe();
    socket.on('connect', subscribe);
    socket.on('order:new', onNew);
    socket.on('order:status', onStatus);
    return () => {
      socket.off('connect', subscribe);
      socket.off('order:new', onNew);
      socket.off('order:status', onStatus);
    };
  }, [token, qc]);
}
