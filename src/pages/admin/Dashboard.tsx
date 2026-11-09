import { useEffect, useState } from 'react';
import { IndianRupee, ReceiptText, TrendingUp } from 'lucide-react';
import { fetchStats } from '../../api/orders';
import { getErrorMessage } from '../../api/client';
import { ErrorState, Spinner } from '../../components/States';
import { StatusBadge } from '../../components/StatusBadge';
import { formatPrice } from '../../lib/format';
import { getSocket } from '../../lib/socket';
import { useAuthStore } from '../../store/authStore';
import type { OrderStats } from '../../types';

export default function Dashboard() {
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    fetchStats()
      .then((r) => { setStats(r.data); setError(null); })
      .catch((e) => setError(getErrorMessage(e)));
  }, [tick]);

  // Refresh stats when orders arrive or change.
  useEffect(() => {
    const socket = getSocket();
    const sub = () => socket.emit('admin:subscribe', token);
    const refresh = () => setTick((t) => t + 1);
    sub();
    socket.on('connect', sub);
    socket.on('order:new', refresh);
    socket.on('order:status', refresh);
    return () => {
      socket.off('connect', sub);
      socket.off('order:new', refresh);
      socket.off('order:status', refresh);
    };
  }, [token]);

  if (error) return <ErrorState message={error} onRetry={() => setTick((t) => t + 1)} />;
  if (!stats) return <div className="flex justify-center py-20 text-brand-700"><Spinner className="h-8 w-8" /></div>;

  const maxRevenue = Math.max(1, ...stats.revenueByDay.map((d) => d.revenue));
  const cards = [
    { label: 'Revenue', value: formatPrice(stats.totals.revenue), icon: IndianRupee },
    { label: 'Orders', value: String(stats.totals.orders), icon: ReceiptText },
    { label: 'Avg. order', value: formatPrice(Math.round(stats.totals.avgOrder ?? 0)), icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-stone-900">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card flex items-center gap-4 p-5">
            <span className="rounded-xl bg-brand-50 p-3 text-brand-700"><Icon size={22} /></span>
            <div>
              <p className="text-sm text-stone-500">{label}</p>
              <p className="text-2xl font-bold tabular-nums text-stone-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="card p-5 lg:col-span-2">
          <h2 className="font-semibold text-stone-900">Revenue, last 7 days</h2>
          {stats.revenueByDay.length === 0 ? (
            <p className="py-10 text-center text-sm text-stone-500">No orders in the last 7 days.</p>
          ) : (
            <div className="mt-6 flex h-48 items-end gap-3">
              {stats.revenueByDay.map((d) => (
                <div key={d.date} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-xs font-medium tabular-nums text-stone-600">{formatPrice(d.revenue)}</span>
                  <div className="w-full max-w-12 rounded-t-lg bg-brand-600" style={{ height: `${(d.revenue / maxRevenue) * 140}px` }} title={`${d.orders} orders`} />
                  <span className="text-xs text-stone-500">{new Date(d.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card p-5">
          <h2 className="font-semibold text-stone-900">Orders by status</h2>
          <ul className="mt-4 space-y-2">
            {stats.byStatus.length === 0 && <li className="text-sm text-stone-500">No orders yet.</li>}
            {stats.byStatus.map((s) => (
              <li key={s.status} className="flex items-center justify-between">
                <StatusBadge status={s.status} />
                <span className="font-semibold tabular-nums">{s.count}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="card p-5">
        <h2 className="font-semibold text-stone-900">Top selling items</h2>
        {stats.topItems.length === 0 ? (
          <p className="py-6 text-sm text-stone-500">No sales yet.</p>
        ) : (
          <table className="mt-3 w-full text-sm">
            <thead className="text-left text-stone-500">
              <tr><th className="py-2 font-medium">Item</th><th className="py-2 text-right font-medium">Qty sold</th><th className="py-2 text-right font-medium">Revenue</th></tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {stats.topItems.map((t) => (
                <tr key={t.menuItem}><td className="py-2.5">{t.name}</td><td className="py-2.5 text-right tabular-nums">{t.quantity}</td><td className="py-2.5 text-right tabular-nums">{formatPrice(t.revenue)}</td></tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
