import { Card, Spinner } from '@/components/ui';
import { formatDateTime } from '@/lib/format';
import type { Order, OrderStatus } from '@/types/order';
import { StatusBadge } from './StatusBadge';
import { StatusSelect } from './StatusSelect';
import { OrderSummary } from './OrderSummary';
import { toSummaryLines } from '../utils/summary';

/** Kitchen/admin view of one order with a status control. */
export function OrderCard({ order, onStatusChange, updating }: { order: Order; onStatusChange: (s: OrderStatus) => void; updating?: boolean }) {
  return (
    <Card className="flex flex-col p-4">
      <article className="flex flex-1 flex-col" aria-label={`Order ${order.orderNumber}`}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-mono font-bold text-stone-900">{order.orderNumber}</p>
            <p className="text-xs text-stone-500">
              {formatDateTime(order.createdAt)}
              {order.tableNumber ? ` · Table ${order.tableNumber}` : ''}
            </p>
          </div>
          <StatusBadge status={order.status} />
        </div>
        <p className="mt-2 text-sm text-stone-700">
          {order.customer.name} · +91 {order.customer.phone}
        </p>
        <div className="mt-3 flex-1">
          <OrderSummary boxed={false} lines={toSummaryLines(order.items)} total={order.totalAmount} />
        </div>
        {order.customer.notes && <p className="mt-2 rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs text-amber-800">📝 {order.customer.notes}</p>}
        <div className="mt-3 flex items-center justify-end gap-2 border-t border-stone-100 pt-3">
          {updating && <Spinner className="text-brand-700" />}
          <StatusSelect value={order.status} onChange={onStatusChange} disabled={updating} label={`Status of ${order.orderNumber}`} />
        </div>
      </article>
    </Card>
  );
}
