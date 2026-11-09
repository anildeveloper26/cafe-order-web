import { cleanParams, http, unwrap } from '@/lib/http';
import { ENDPOINTS } from '@/constants/endpoints';
import type { ApiResponse } from '@/types/api';
import type { Order, OrderFilters, OrderStatus, PlaceOrderInput } from '@/types/order';
import type { OrderStats } from '@/types/stats';

export const ordersApi = {
  place: (body: PlaceOrderInput) => http.post<ApiResponse<Order>>(ENDPOINTS.orders, body).then(unwrap).then((r) => r.data),
  get: (id: string, signal?: AbortSignal) => http.get<ApiResponse<Order>>(ENDPOINTS.order(id), { signal }).then(unwrap).then((r) => r.data),
  list: (filters: OrderFilters, signal?: AbortSignal) =>
    http.get<ApiResponse<Order[]>>(ENDPOINTS.orders, { params: cleanParams(filters), signal }).then(unwrap),
  updateStatus: (id: string, status: OrderStatus) =>
    http.patch<ApiResponse<Order>>(ENDPOINTS.orderStatus(id), { status }).then(unwrap).then((r) => r.data),
  stats: (signal?: AbortSignal) => http.get<ApiResponse<OrderStats>>(ENDPOINTS.orderStats, { signal }).then(unwrap).then((r) => r.data),
};
