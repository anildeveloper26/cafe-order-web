import { Card } from '@/components/ui';
import { formatPrice } from '@/lib/format';
import type { OrderStats } from '@/types/stats';

export function TopItemsTable({ data }: { data: OrderStats['topItems'] }) {
  return (
    <Card className="p-5">
      <h2 className="font-semibold text-stone-900">Top selling items</h2>
      {data.length === 0 ? (
        <p className="py-6 text-sm text-stone-500">No sales yet.</p>
      ) : (
        <table className="mt-3 w-full text-sm">
          <thead className="text-left text-stone-500">
            <tr>
              <th className="py-2 font-medium">Item</th>
              <th className="py-2 text-right font-medium">Qty sold</th>
              <th className="py-2 text-right font-medium">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {data.map((t) => (
              <tr key={t.menuItem}>
                <td className="py-2.5">{t.name}</td>
                <td className="py-2.5 text-right tabular-nums">{t.quantity}</td>
                <td className="py-2.5 text-right tabular-nums">{formatPrice(t.revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}
