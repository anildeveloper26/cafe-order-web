import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Receipt } from 'lucide-react';
import { Header } from '../components/Header';
import { EmptyState, ErrorState, Spinner } from '../components/States';
import { StatusBadge } from '../components/StatusBadge';
import { fetchOrders } from '../api/orders';
import { getErrorMessage } from '../api/client';
import { formatDateTime, formatPrice, PHONE_REGEX } from '../lib/format';
import type { Order } from '../types';

function savedPhone() {
  try {
    return (JSON.parse(localStorage.getItem('cafe-customer') ?? '{}') as { phone?: string }).phone ?? '';
  } catch {
    return '';
  }
}

export default function MyOrders() {
  const [phone, setPhone] = useState(savedPhone);
  const [submitted, setSubmitted] = useState(() => (PHONE_REGEX.test(savedPhone()) ? savedPhone() : ''));
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputError, setInputError] = useState('');

  useEffect(() => {
    if (!submitted) return;
    setLoading(true);
    setError(null);
    fetchOrders({ phone: submitted, limit: 50 })
      .then((r) => setOrders(r.data))
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [submitted]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!PHONE_REGEX.test(phone)) return setInputError('Enter a valid 10-digit mobile number');
    setInputError('');
    setSubmitted(phone);
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-bold text-stone-900">My orders</h1>
        <p className="mt-1 text-sm text-stone-500">Enter the mobile number you used at checkout.</p>

        <form onSubmit={onSubmit} className="mt-5 flex gap-2" noValidate>
          <div className="flex-1">
            <label htmlFor="lookup-phone" className="sr-only">Mobile number</label>
            <input id="lookup-phone" className="input" inputMode="numeric" placeholder="98765 43210" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} />
            {inputError && <p className="mt-1 text-xs text-red-600">{inputError}</p>}
          </div>
          <button type="submit" className="btn-primary h-[42px]">Find</button>
        </form>

        <div className="mt-6">
          {loading ? (
            <div className="flex justify-center py-12 text-brand-700"><Spinner className="h-6 w-6" /></div>
          ) : error ? (
            <ErrorState message={error} onRetry={() => setSubmitted((s) => s + '')} />
          ) : orders && orders.length === 0 ? (
            <EmptyState title="No orders yet" hint="Orders placed with this number will show up here." action={<Link to="/menu" className="btn-primary">Browse menu</Link>} />
          ) : (
            <ul className="space-y-3">
              {orders?.map((o) => (
                <li key={o._id}>
                  <Link to={`/order/${o._id}`} className="card flex items-center gap-4 p-4 transition hover:shadow-md">
                    <span className="rounded-xl bg-brand-50 p-2.5 text-brand-700"><Receipt size={20} /></span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold">{o.orderNumber}</span>
                        <StatusBadge status={o.status} />
                      </div>
                      <p className="truncate text-sm text-stone-500">{o.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}</p>
                      <p className="text-xs text-stone-400">{formatDateTime(o.createdAt)}</p>
                    </div>
                    <span className="font-semibold tabular-nums">{formatPrice(o.totalAmount)}</span>
                    <ChevronRight size={18} className="text-stone-400" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
