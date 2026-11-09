import type { OrderStatus } from '@/types/order';

export const ORDER_STATUSES = ['pending', 'preparing', 'ready', 'completed', 'cancelled'] as const;

export const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  preparing: 'bg-blue-50 text-blue-700 ring-blue-200',
  ready: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  completed: 'bg-stone-100 text-stone-600 ring-stone-200',
  cancelled: 'bg-red-50 text-red-700 ring-red-200',
};

/** Customer-facing progress steps (cancelled is shown separately). */
export const ORDER_PROGRESS: { status: OrderStatus; label: string }[] = [
  { status: 'pending', label: 'Received' },
  { status: 'preparing', label: 'Preparing' },
  { status: 'ready', label: 'Ready' },
  { status: 'completed', label: 'Served' },
];

export const ADMIN_ORDERS_LIMIT = 100;
export const MY_ORDERS_LIMIT = 50;
