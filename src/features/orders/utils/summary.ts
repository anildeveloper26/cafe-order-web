import type { OrderItem } from '@/types/order';

export interface SummaryLine {
  key: string;
  name: string;
  quantity: number;
  amount: number;
}

export const toSummaryLines = (items: OrderItem[]): SummaryLine[] =>
  items.map((i) => ({ key: i.menuItem, name: i.name, quantity: i.quantity, amount: i.subtotal }));
