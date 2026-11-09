import type { OrderStatus } from './order';

export interface OrderStats {
  totals: { revenue: number; orders: number; avgOrder: number };
  byStatus: { status: OrderStatus; count: number }[];
  revenueByDay: { date: string; revenue: number; orders: number }[];
  topItems: { menuItem: string; name: string; quantity: number; revenue: number }[];
}
