import type { ReactNode } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui';
import { formatDateTime } from '@/lib/format';
import type { Order } from '@/types/order';
import { StatusBadge } from './StatusBadge';
import { OrderTimeline } from './OrderTimeline';
import { OrderSummary } from './OrderSummary';
import { toSummaryLines } from '../utils/summary';

/** Customer order receipt with live progress. */
export function OrderDetails({ order, actions }: { order: Order; actions?: ReactNode }) {
  return (
    <Card className="animate-pop-in overflow-hidden">
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 px-6 py-8 text-center text-white">
        <CheckCircle2 className="mx-auto" size={48} />
        <h1 className="mt-3 text-2xl font-bold">Order placed!</h1>
        <p className="mt-1 text-emerald-50">Thank you, {order.customer.name}. We're on it.</p>
      </div>
      <div className="space-y-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-stone-500">Order number</p>
            <p className="font-mono text-xl font-bold text-stone-900" data-testid="order-number">
              {order.orderNumber}
            </p>
          </div>
          <div className="text-right">
            <StatusBadge status={order.status} />
            <p className="mt-1 text-xs text-stone-500">{formatDateTime(order.createdAt)}</p>
          </div>
        </div>
        <OrderTimeline status={order.status} />
        <OrderSummary lines={toSummaryLines(order.items)} total={order.totalAmount} />
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-stone-500">Phone</dt>
            <dd className="font-medium">+91 {order.customer.phone}</dd>
          </div>
          {order.tableNumber && (
            <div>
              <dt className="text-stone-500">Table</dt>
              <dd className="font-medium">{order.tableNumber}</dd>
            </div>
          )}
          {order.customer.notes && (
            <div className="col-span-2">
              <dt className="text-stone-500">Notes</dt>
              <dd className="font-medium">{order.customer.notes}</dd>
            </div>
          )}
        </dl>
        {actions}
      </div>
    </Card>
  );
}
