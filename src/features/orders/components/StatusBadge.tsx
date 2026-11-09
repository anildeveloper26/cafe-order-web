import { Badge } from '@/components/ui';
import { STATUS_STYLES } from '@/constants/orders';
import type { OrderStatus } from '@/types/order';

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <Badge className={STATUS_STYLES[status]}>{status}</Badge>;
}
