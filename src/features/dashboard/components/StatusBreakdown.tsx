import { Card } from '@/components/ui';
import { StatusBadge } from '@/features/orders';
import type { OrderStats } from '@/types/stats';

export function StatusBreakdown({ data }: { data: OrderStats['byStatus'] }) {
  return (
    <Card className="p-5">
      <h2 className="font-semibold text-stone-900">Orders by status</h2>
      <ul className="mt-4 space-y-2">
        {data.length === 0 && <li className="text-sm text-stone-500">No orders yet.</li>}
        {data.map((s) => (
          <li key={s.status} className="flex items-center justify-between">
            <StatusBadge status={s.status} />
            <span className="font-semibold tabular-nums">{s.count}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
