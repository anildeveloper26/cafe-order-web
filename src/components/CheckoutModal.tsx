import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Modal } from './Modal';
import { Spinner } from './States';
import { placeOrder } from '../api/orders';
import { getErrorMessage, getFieldErrors } from '../api/client';
import { selectTotal, useCartStore } from '../store/cartStore';
import { formatPrice, PHONE_REGEX } from '../lib/format';

const CUSTOMER_KEY = 'cafe-customer';

function loadCustomer() {
  try {
    return JSON.parse(localStorage.getItem(CUSTOMER_KEY) ?? '{}') as { name?: string; phone?: string };
  } catch {
    return {};
  }
}

export function CheckoutModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const { lines, tableNumber, clear, close: closeCart } = useCartStore();
  const total = useCartStore(selectTotal);
  const saved = loadCustomer();

  const [name, setName] = useState(saved.name ?? '');
  const [phone, setPhone] = useState(saved.phone ?? '');
  const [notes, setNotes] = useState('');
  const [table, setTable] = useState(tableNumber ? String(tableNumber) : '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e['customer.name'] = 'Please enter your name';
    if (!PHONE_REGEX.test(phone)) e['customer.phone'] = 'Enter a valid 10-digit mobile number';
    if (table && (!/^\d+$/.test(table) || Number(table) < 1)) e.tableNumber = 'Enter a valid table number';
    if (lines.length === 0) e.items = 'Your cart is empty';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await placeOrder({
        customer: { name: name.trim(), phone, notes: notes.trim() || undefined },
        tableNumber: table ? Number(table) : undefined,
        items: lines.map((l) => ({ menuItem: l.item._id, quantity: l.quantity })),
      });
      localStorage.setItem(CUSTOMER_KEY, JSON.stringify({ name: name.trim(), phone }));
      clear();
      closeCart();
      onClose();
      toast.success(`Order ${res.data.orderNumber} placed!`);
      navigate(`/order/${res.data._id}`);
    } catch (err) {
      setErrors(getFieldErrors(err));
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  const fieldError = (key: string) =>
    errors[key] ? (
      <p className="mt-1 text-xs text-red-600" role="alert">
        {errors[key]}
      </p>
    ) : null;

  return (
    <Modal open={open} onClose={onClose} title="Checkout">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="name" className="label">Your name</label>
          <input id="name" className="input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="e.g. Priya" />
          {fieldError('customer.name')}
        </div>
        <div>
          <label htmlFor="phone" className="label">Mobile number</label>
          <div className="flex">
            <span className="inline-flex items-center rounded-l-xl border border-r-0 border-stone-300 bg-stone-50 px-3 text-sm text-stone-500">+91</span>
            <input
              id="phone"
              className="input rounded-l-none"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="98765 43210"
            />
          </div>
          {fieldError('customer.phone')}
          <p className="mt-1 text-xs text-stone-400">No login needed — we use this to track your order.</p>
        </div>
        <div>
          <label htmlFor="table" className="label">Table number <span className="font-normal text-stone-400">(optional)</span></label>
          <input id="table" className="input" value={table} onChange={(e) => setTable(e.target.value.replace(/\D/g, '').slice(0, 3))} inputMode="numeric" placeholder="e.g. 4" />
          {fieldError('tableNumber')}
        </div>
        <div>
          <label htmlFor="notes" className="label">Notes for the kitchen <span className="font-normal text-stone-400">(optional)</span></label>
          <textarea id="notes" className="input min-h-20 resize-none" value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={300} placeholder="Less sugar, extra hot…" />
        </div>

        <div className="rounded-2xl bg-stone-50 p-4">
          <ul className="space-y-1 text-sm text-stone-600">
            {lines.map((l) => (
              <li key={l.item._id} className="flex justify-between gap-3">
                <span className="truncate">{l.quantity} × {l.item.name}</span>
                <span className="tabular-nums">{formatPrice(l.item.price * l.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t border-stone-200 pt-3 font-bold text-stone-900">
            <span>Total</span>
            <span className="tabular-nums">{formatPrice(total)}</span>
          </div>
          {fieldError('items')}
        </div>

        <button type="submit" disabled={submitting || lines.length === 0} className="btn-primary h-12 w-full text-base">
          {submitting ? (<><Spinner /> Placing order…</>) : `Place order · ${formatPrice(total)}`}
        </button>
      </form>
    </Modal>
  );
}
