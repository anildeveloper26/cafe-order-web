import type { OrderStatus } from '../types';

const STYLES: Record<OrderStatus, string> = {
  pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  preparing: 'bg-blue-50 text-blue-700 ring-blue-200',
  ready: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  completed: 'bg-stone-100 text-stone-600 ring-stone-200',
  cancelled: 'bg-red-50 text-red-700 ring-red-200',
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ${STYLES[status]}`}>{status}</span>;
}
