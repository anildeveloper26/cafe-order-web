import { Select } from '@/components/ui';
import { ORDER_STATUSES } from '@/constants/orders';
import type { OrderStatus } from '@/types/order';

const OPTIONS = ORDER_STATUSES.map((s) => ({ value: s, label: s }));
const FILTER_OPTIONS = [{ value: '' as const, label: 'All statuses' }, ...OPTIONS];

export function StatusSelect({ value, onChange, label, disabled }: { value: OrderStatus; onChange: (s: OrderStatus) => void; label: string; disabled?: boolean }) {
  return <Select<OrderStatus> value={value} onChange={onChange} options={OPTIONS} aria-label={label} disabled={disabled} className="h-9 w-36 py-1 capitalize" />;
}

export function StatusFilter({ value, onChange }: { value: OrderStatus | ''; onChange: (s: OrderStatus | '') => void }) {
  return <Select<OrderStatus | ''> value={value} onChange={onChange} options={FILTER_OPTIONS} aria-label="Filter by status" className="w-44 capitalize" />;
}
