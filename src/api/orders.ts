import { api } from './client';
import type { ApiResponse, Order, OrderStats, OrderStatus } from '../types';

export interface PlaceOrderInput {
  customer: { name: string; phone: string; notes?: string };
  tableNumber?: number;
  items: { menuItem: string; quantity: number }[];
}

export const placeOrder = (body: PlaceOrderInput) => api.post<ApiResponse<Order>>('/orders', body).then((r) => r.data);
export const fetchOrder = (id: string) => api.get<ApiResponse<Order>>(`/orders/${id}`).then((r) => r.data);
export const fetchOrders = (params: { phone?: string; status?: OrderStatus | ''; page?: number; limit?: number }) =>
  api
    .get<ApiResponse<Order[]>>('/orders', { params: Object.fromEntries(Object.entries(params).filter(([, v]) => v)) })
    .then((r) => r.data);
export const updateOrderStatus = (id: string, status: OrderStatus) =>
  api.patch<ApiResponse<Order>>(`/orders/${id}/status`, { status }).then((r) => r.data);
export const fetchStats = () => api.get<ApiResponse<OrderStats>>('/orders/stats').then((r) => r.data);
