import { Link, useParams } from 'react-router-dom';
import { buttonClasses, CenteredSpinner, ErrorState } from '@/components/ui';
import { OrderDetails, useOrder, useOrderLiveUpdates } from '@/features/orders';
import { useTableStore } from '@/features/table';
import { getErrorMessage } from '@/lib/errors';
import { menuPath, PATHS } from '@/routes/paths';

export default function OrderTrackingPage() {
  const { id = '' } = useParams();
  const order = useOrder(id);
  useOrderLiveUpdates(id);
  const table = useTableStore((s) => s.tableNumber);

  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      {order.isError ? (
        <ErrorState message={getErrorMessage(order.error)} onRetry={() => order.refetch()} />
      ) : !order.data ? (
        <CenteredSpinner />
      ) : (
        <OrderDetails
          order={order.data}
          actions={
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link to={menuPath({ table })} className={buttonClasses('primary', 'md', 'flex-1')}>
                Order more
              </Link>
              <Link to={PATHS.myOrders} className={buttonClasses('outline', 'md', 'flex-1')}>
                My orders
              </Link>
            </div>
          }
        />
      )}
    </main>
  );
}
