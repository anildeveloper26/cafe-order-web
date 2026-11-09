import { RefreshCw } from 'lucide-react';
import { Button, CenteredSpinner, EmptyState, ErrorState, PageHeader } from '@/components/ui';
import { OrderCard, StatusFilter, useOrders, useUpdateOrderStatus } from '@/features/orders';
import { ADMIN_ORDERS_LIMIT } from '@/constants/orders';
import { isOrderStatus } from '@/constants/guards';
import { useUrlState } from '@/hooks/useUrlState';
import { getErrorMessage } from '@/lib/errors';
import type { OrderStatus } from '@/types/order';

const URL_DEFAULTS = { status: '' };
const URL_VALIDATORS = { status: isOrderStatus };

export default function OrdersBoardPage() {
  const [url, setUrl] = useUrlState(URL_DEFAULTS, URL_VALIDATORS);
  const status = url.status as OrderStatus | '';
  const orders = useOrders({ status, limit: ADMIN_ORDERS_LIMIT }, { live: true });
  const updateStatus = useUpdateOrderStatus();
  const list = orders.data ?? [];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Orders"
        actions={
          <>
            <StatusFilter value={status} onChange={(s) => setUrl({ status: s })} />
            <Button variant="outline" size="icon" className="h-[42px] w-[42px]" onClick={() => orders.refetch()} aria-label="Refresh" loading={orders.isFetching}>
              {!orders.isFetching && <RefreshCw size={16} />}
            </Button>
          </>
        }
      />

      {orders.isError && !orders.data ? (
        <ErrorState message={getErrorMessage(orders.error)} onRetry={() => orders.refetch()} />
      ) : orders.isLoading ? (
        <CenteredSpinner />
      ) : list.length === 0 ? (
        <EmptyState title="No orders" hint={status ? `No ${status} orders.` : 'Orders will appear here as customers place them.'} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((o) => (
            <OrderCard
              key={o._id}
              order={o}
              updating={updateStatus.isPending && updateStatus.variables?.order._id === o._id}
              onStatusChange={(next) => updateStatus.mutate({ order: o, status: next })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
