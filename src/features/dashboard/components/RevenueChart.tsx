import { Card } from '@/components/ui';
import { formatPrice, formatShortDate } from '@/lib/format';
import type { OrderStats } from '@/types/stats';

const BAR_MAX_PX = 140;

export function RevenueChart({ data }: { data: OrderStats['revenueByDay'] }) {
  const max = Math.max(1, ...data.map((d) => d.revenue));
  return (
    <Card className="p-5 lg:col-span-2">
      <h2 className="font-semibold text-stone-900">Revenue, last 7 days</h2>
      {data.length === 0 ? (
        <p className="py-10 text-center text-sm text-stone-500">No orders in the last 7 days.</p>
      ) : (
        <div className="mt-6 flex h-48 items-end gap-3" role="img" aria-label="Revenue per day bar chart">
          {data.map((d) => (
            <div key={d.date} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-xs font-medium tabular-nums text-stone-600">{formatPrice(d.revenue)}</span>
              <div className="w-full max-w-12 rounded-t-lg bg-brand-600" style={{ height: `${(d.revenue / max) * BAR_MAX_PX}px` }} title={`${d.orders} orders`} />
              <span className="text-xs text-stone-500">{formatShortDate(d.date)}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
