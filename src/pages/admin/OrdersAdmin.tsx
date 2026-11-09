import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { RefreshCw } from 'lucide-react';
import { fetchOrders, updateOrderStatus } from '../../api/orders';
import { getErrorMessage } from '../../api/client';
import { EmptyState, ErrorState, Spinner } from '../../components/States';
import { StatusBadge } from '../../components/StatusBadge';
import { formatDateTime, formatPrice } from '../../lib/format';
import { getSocket } from '../../lib/socket';
import { useAuthStore } from '../../store/authStore';
import { ORDER_STATUSES, type Order, type OrderStatus } from '../../types';

export default function OrdersAdmin() {
  const [status, setStatus] = useState<OrderStatus | ''>('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const token = useAuthStore((s) => s.token);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchOrders({ status, limit: 100 })
      .then((r) => setOrders(r.data))
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [status]);

  useEffect(load, [load]);

  // New orders and status changes arrive live.
  useEffect(() => {
    const socket = getSocket();
    const sub = () => socket.emit('admin:subscribe', token);
    const onNew = (o: Order) => {
      toast(`New order ${o.orderNumber}${o.tableNumber ? ` · Table ${o.tableNumber}` : ''}`, { icon: '🛎️' });
      if (!status || status === o.status) setOrders((list) => (list.some((x) => x._id === o._id) ? list : [o, ...list]));
    };
    const onStatus = (p: { _id: string; status: OrderStatus }) =>
      setOrders((list) => list.map((o) => (o._id === p._id ? { ...o, status: p.status } : o)));
    sub();
    socket.on('connect', sub);
    socket.on('order:new', onNew);
    socket.on('order:status', onStatus);
    return () => {
      socket.off('connect', sub);
      socket.off('order:new', onNew);
      socket.off('order:status', onStatus);
    };
  }, [token, status]);

  async function changeStatus(order: Order, next: OrderStatus) {
    setUpdating(order._id);
    try {
      const res = await updateOrderStatus(order._id, next);
      setOrders((list) => list.map((o) => (o._id === order._id ? res.data : o)));
      toast.success(`${order.orderNumber} → ${next}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-stone-900">Orders</h1>
        <div className="flex gap-2">
          <select className="input w-44 capitalize" value={status} onChange={(e) => setStatus(e.target.value as OrderStatus | '')} aria-label="Filter by status">
            <option value="">All statuses</option>
            {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button type="button" onClick={load} className="btn-outline" aria-label="Refresh"><RefreshCw size={16} /></button>
        </div>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : loading && orders.length === 0 ? (
        <div className="flex justify-center py-16 text-brand-700"><Spinner className="h-7 w-7" /></div>
      ) : orders.length === 0 ? (
        <EmptyState title="No orders" hint={status ? `No ${status} orders.` : 'Orders will appear here as customers place them.'} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {orders.map((o) => (
            <article key={o._id} className="card flex flex-col p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-mono font-bold text-stone-900">{o.orderNumber}</p>
                  <p className="text-xs text-stone-500">{formatDateTime(o.createdAt)}{o.tableNumber ? ` · Table ${o.tableNumber}` : ''}</p>
                </div>
                <StatusBadge status={o.status} />
              </div>
              <p className="mt-2 text-sm text-stone-700">{o.customer.name} · +91 {o.customer.phone}</p>
              <ul className="mt-3 flex-1 space-y-1 text-sm text-stone-600">
                {o.items.map((i) => (
                  <li key={i.menuItem} className="flex justify-between gap-2"><span>{i.quantity} × {i.name}</span><span className="tabular-nums">{formatPrice(i.subtotal)}</span></li>
                ))}
              </ul>
              {o.customer.notes && <p className="mt-2 rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs text-amber-800">📝 {o.customer.notes}</p>}
              <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-3">
                <span className="font-bold tabular-nums">{formatPrice(o.totalAmount)}</span>
                <div className="flex items-center gap-2">
                  {updating === o._id && <Spinner className="text-brand-700" />}
                  <select
                    className="input h-9 w-36 py-1 capitalize"
                    value={o.status}
                    disabled={updating === o._id}
                    onChange={(e) => changeStatus(o, e.target.value as OrderStatus)}
                    aria-label={`Status of ${o.orderNumber}`}
                  >
                    {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
