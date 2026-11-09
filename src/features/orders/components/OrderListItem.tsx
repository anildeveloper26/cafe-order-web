import { Link } from 'react-router-dom';
import { ChevronRight, Receipt } from 'lucide-react';
import { Card } from '@/components/ui';
import { formatDateTime, formatPrice } from '@/lib/format';
import type { Order } from '@/types/order';
import { StatusBadge } from './StatusBadge';

/** Compact row linking to an order (customer "My orders"). */
export function OrderListItem({ order, to }: { order: Order; to: string }) {
  return (
    <Link to={to} className="block">
      <Card className="flex items-center gap-4 p-4 transition hover:shadow-md">
        <span className="rounded-xl bg-brand-50 p-2.5 text-brand-700">
          <Receipt size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono font-semibold">{order.orderNumber}</span>
            <StatusBadge status={order.status} />
          </div>
          <p className="truncate text-sm text-stone-500">{order.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}</p>
          <p className="text-xs text-stone-400">{formatDateTime(order.createdAt)}</p>
        </div>
        <span className="font-semibold tabular-nums">{formatPrice(order.totalAmount)}</span>
        <ChevronRight size={18} className="text-stone-400" />
      </Card>
    </Link>
  );
}
