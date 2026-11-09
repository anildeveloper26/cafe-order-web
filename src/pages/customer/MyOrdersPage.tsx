import { Link } from 'react-router-dom';
import { buttonClasses, CenteredSpinner, EmptyState, ErrorState, PageHeader } from '@/components/ui';
import { loadSavedCustomer, OrderListItem, PhoneLookupForm, useOrders } from '@/features/orders';
import { MY_ORDERS_LIMIT } from '@/constants/orders';
import { isPhone } from '@/constants/guards';
import { useUrlState } from '@/hooks/useUrlState';
import { getErrorMessage } from '@/lib/errors';
import { orderPath, PATHS } from '@/routes/paths';

const URL_DEFAULTS = { phone: '' };
const URL_VALIDATORS = { phone: isPhone };

export default function MyOrdersPage() {
  // The looked-up phone lives in the URL so refresh/back keeps the results.
  const [url, setUrl] = useUrlState(URL_DEFAULTS, URL_VALIDATORS);
  const orders = useOrders({ phone: url.phone, limit: MY_ORDERS_LIMIT }, { enabled: Boolean(url.phone) });

  return (
    <main className="mx-auto max-w-2xl space-y-6 px-4 py-8">
      <PageHeader title="My orders" description="Enter the mobile number you used at checkout." />
      <PhoneLookupForm initialPhone={url.phone || loadSavedCustomer().phone || ''} onSubmit={(phone) => setUrl({ phone }, { replace: false })} />

      {!url.phone ? null : orders.isLoading ? (
        <CenteredSpinner />
      ) : orders.isError ? (
        <ErrorState message={getErrorMessage(orders.error)} onRetry={() => orders.refetch()} />
      ) : orders.data?.length === 0 ? (
        <EmptyState
          title="No orders yet"
          hint="Orders placed with this number will show up here."
          action={
            <Link to={PATHS.menu} className={buttonClasses()}>
              Browse menu
            </Link>
          }
        />
      ) : (
        <ul className="space-y-3">
          {orders.data?.map((o) => (
            <li key={o._id}>
              <OrderListItem order={o} to={orderPath(o._id)} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
