import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, ChefHat, Clock, PackageCheck, XCircle } from 'lucide-react';
import { Header } from '../components/Header';
import { ErrorState, Spinner } from '../components/States';
import { StatusBadge } from '../components/StatusBadge';
import { fetchOrder } from '../api/orders';
import { getErrorMessage } from '../api/client';
import { getSocket } from '../lib/socket';
import { formatDateTime, formatPrice } from '../lib/format';
import type { Order, OrderStatus } from '../types';

const STEPS: { status: OrderStatus; label: string; icon: typeof Clock }[] = [
  { status: 'pending', label: 'Received', icon: Clock },
  { status: 'preparing', label: 'Preparing', icon: ChefHat },
  { status: 'ready', label: 'Ready', icon: PackageCheck },
  { status: 'completed', label: 'Served', icon: CheckCircle2 },
];

export default function OrderSuccess() {
  const { id = '' } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setError(null);
    fetchOrder(id)
      .then((r) => setOrder(r.data))
      .catch((e) => setError(getErrorMessage(e)));
  }, [id, reloadKey]);

  // Live status updates from the kitchen.
  useEffect(() => {
    const socket = getSocket();
    const subscribe = () => socket.emit('order:subscribe', id);
    const onStatus = (p: { _id: string; status: OrderStatus; updatedAt: string }) => {
      if (p._id === id) setOrder((o) => (o ? { ...o, status: p.status, updatedAt: p.updatedAt } : o));
    };
    subscribe();
    socket.on('connect', subscribe);
    socket.on('order:status', onStatus);
    return () => {
      socket.emit('order:unsubscribe', id);
      socket.off('connect', subscribe);
      socket.off('order:status', onStatus);
    };
  }, [id]);

  const stepIndex = order ? STEPS.findIndex((s) => s.status === order.status) : -1;

  return (
    <div className="min-h-screen">
      <Header showCart={false} />
      <main className="mx-auto max-w-xl px-4 py-8">
        {error ? (
          <ErrorState message={error} onRetry={() => setReloadKey((k) => k + 1)} />
        ) : !order ? (
          <div className="flex justify-center py-20 text-brand-700"><Spinner className="h-8 w-8" /></div>
        ) : (
          <div className="card animate-pop-in overflow-hidden">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 px-6 py-8 text-center text-white">
              <CheckCircle2 className="mx-auto" size={48} />
              <h1 className="mt-3 text-2xl font-bold">Order placed!</h1>
              <p className="mt-1 text-emerald-50">Thank you, {order.customer.name}. We're on it.</p>
            </div>

            <div className="space-y-6 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-stone-500">Order number</p>
                  <p className="font-mono text-xl font-bold text-stone-900">{order.orderNumber}</p>
                </div>
                <div className="text-right">
                  <StatusBadge status={order.status} />
                  <p className="mt-1 text-xs text-stone-500">{formatDateTime(order.createdAt)}</p>
                </div>
              </div>

              {order.status === 'cancelled' ? (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                  <XCircle size={18} /> This order was cancelled. Please ask the staff for help.
                </div>
              ) : (
                <ol className="grid grid-cols-4 gap-2" aria-label="Order progress">
                  {STEPS.map((s, i) => {
                    const done = i <= stepIndex;
                    const Icon = s.icon;
                    return (
                      <li key={s.status} className="flex flex-col items-center text-center">
                        <span className={`flex h-10 w-10 items-center justify-center rounded-full transition ${done ? 'bg-brand-700 text-white' : 'bg-stone-100 text-stone-400'}`}>
                          <Icon size={18} />
                        </span>
                        <span className={`mt-1.5 text-xs font-medium ${done ? 'text-stone-900' : 'text-stone-400'}`}>{s.label}</span>
                      </li>
                    );
                  })}
                </ol>
              )}

              <div className="rounded-2xl bg-stone-50 p-4">
                <ul className="space-y-1.5 text-sm">
                  {order.items.map((i) => (
                    <li key={i.menuItem} className="flex justify-between gap-3 text-stone-700">
                      <span>{i.quantity} × {i.name}</span>
                      <span className="tabular-nums">{formatPrice(i.subtotal)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex justify-between border-t border-stone-200 pt-3 font-bold text-stone-900">
                  <span>Total</span>
                  <span className="tabular-nums">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>

              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div><dt className="text-stone-500">Phone</dt><dd className="font-medium">+91 {order.customer.phone}</dd></div>
                {order.tableNumber && <div><dt className="text-stone-500">Table</dt><dd className="font-medium">{order.tableNumber}</dd></div>}
                {order.customer.notes && <div className="col-span-2"><dt className="text-stone-500">Notes</dt><dd className="font-medium">{order.customer.notes}</dd></div>}
              </dl>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Link to="/menu" className="btn-primary flex-1">Order more</Link>
                <Link to="/my-orders" className="btn-outline flex-1">My orders</Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
