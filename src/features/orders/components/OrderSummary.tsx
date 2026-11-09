import type { ReactNode } from 'react';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/cn';
import type { SummaryLine } from '../utils/summary';


/** Itemised lines + total. Shared by checkout, order tracking and the admin order card. */
export function OrderSummary({ lines, total, footer, boxed = true }: { lines: SummaryLine[]; total: number; footer?: ReactNode; boxed?: boolean }) {
  return (
    <div className={cn(boxed && 'rounded-2xl bg-stone-50 p-4')}>
      <ul className="space-y-1.5 text-sm text-stone-600">
        {lines.map((l) => (
          <li key={l.key} className="flex justify-between gap-3">
            <span className="truncate">
              {l.quantity} × {l.name}
            </span>
            <span className="tabular-nums">{formatPrice(l.amount)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex justify-between border-t border-stone-200 pt-3 font-bold text-stone-900">
        <span>Total</span>
        <span className="tabular-nums" data-testid="order-total">
          {formatPrice(total)}
        </span>
      </div>
      {footer}
    </div>
  );
}
