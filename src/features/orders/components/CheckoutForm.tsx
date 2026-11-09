import { useState, type FormEvent } from 'react';
import { Button, FormField, Input, Textarea } from '@/components/ui';
import { NAME_MIN, NOTES_MAX, PHONE_LENGTH, PHONE_REGEX } from '@/constants/validation';
import { digitsOnly, formatPrice, normalizeMobile } from '@/lib/format';
import { getFieldErrors } from '@/lib/errors';
import type { PlaceOrderInput } from '@/types/order';
import { OrderSummary } from './OrderSummary';
import type { SummaryLine } from '../utils/summary';
import { loadSavedCustomer } from '../utils/customerStorage';

interface Props {
  lines: SummaryLine[];
  items: PlaceOrderInput['items'];
  total: number;
  tableNumber: number | null;
  submitting: boolean;
  serverError: unknown;
  onSubmit: (input: PlaceOrderInput) => void;
}

export function CheckoutForm({ lines, items, total, tableNumber, submitting, serverError, onSubmit }: Props) {
  const [saved] = useState(loadSavedCustomer);
  const [name, setName] = useState(saved.name ?? '');
  const [phone, setPhone] = useState(saved.phone ?? '');
  const [notes, setNotes] = useState('');
  const [table, setTable] = useState(tableNumber ? String(tableNumber) : '');
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const errors = { ...getFieldErrors(serverError), ...clientErrors };

  function validate() {
    const e: Record<string, string> = {};
    if (name.trim().length < NAME_MIN) e['customer.name'] = 'Please enter your name';
    if (!PHONE_REGEX.test(phone)) e['customer.phone'] = 'Enter a valid 10-digit mobile number';
    if (table && Number(table) < 1) e.tableNumber = 'Enter a valid table number';
    if (items.length === 0) e.items = 'Your cart is empty';
    setClientErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    onSubmit({
      customer: { name: name.trim(), phone, notes: notes.trim() || undefined },
      tableNumber: table ? Number(table) : undefined,
      items,
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <FormField label="Your name" htmlFor="name" error={errors['customer.name']}>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="e.g. Priya" invalid={Boolean(errors['customer.name'])} />
      </FormField>
      <FormField label="Mobile number" htmlFor="phone" error={errors['customer.phone']} hint="No login needed — we use this to track your order.">
        <div className="flex">
          <span className="inline-flex items-center rounded-l-xl border border-r-0 border-stone-300 bg-stone-50 px-3 text-sm text-stone-500">+91</span>
          <Input
            id="phone"
            className="rounded-l-none"
            value={phone}
            onChange={(e) => setPhone(normalizeMobile(e.target.value, PHONE_LENGTH))}
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="98765 43210"
            invalid={Boolean(errors['customer.phone'])}
          />
        </div>
      </FormField>
      <FormField label="Table number" htmlFor="table" optional error={errors.tableNumber}>
        <Input id="table" value={table} onChange={(e) => setTable(digitsOnly(e.target.value, 3))} inputMode="numeric" placeholder="e.g. 4" />
      </FormField>
      <FormField label="Notes for the kitchen" htmlFor="notes" optional>
        <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={NOTES_MAX} placeholder="Less sugar, extra hot…" />
      </FormField>

      <OrderSummary
        lines={lines}
        total={total}
        footer={
          errors.items && (
            <p className="mt-2 text-xs text-red-600" role="alert">
              {errors.items}
            </p>
          )
        }
      />

      {/* Stays visible at the bottom of the sheet while the form scrolls on small screens. */}
      <div className="sticky -bottom-5 -mx-5 border-t border-stone-100 bg-white px-5 py-4">
        <Button type="submit" size="lg" fullWidth disabled={items.length === 0} loading={submitting} loadingText="Placing order…">
          Place order · {formatPrice(total)}
        </Button>
      </div>
    </form>
  );
}
