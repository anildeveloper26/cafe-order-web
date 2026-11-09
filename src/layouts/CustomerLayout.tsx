import { Outlet, ScrollRestoration } from 'react-router-dom';
import { CartDrawer, useCart, useCartStore, useCartSync } from '@/features/cart';
import { CheckoutModal } from '@/features/orders';
import { useMenuItems } from '@/features/menu';
import { useTableStore } from '@/features/table';
import { orderPath } from '@/routes/paths';
import { CustomerHeader } from './components/CustomerHeader';

/** Shell for customer pages: header, cart drawer and checkout are shared across routes. */
export default function CustomerLayout() {
  const tableNumber = useTableStore((s) => s.tableNumber);
  const isCheckoutOpen = useCartStore((s) => s.isCheckoutOpen);
  const { lines, total, clear, closeDrawer, closeCheckout } = useCart();

  // The full available menu (shared cache with the unfiltered menu page) keeps the saved cart valid.
  const { data: availableItems } = useMenuItems();
  useCartSync(availableItems);

  return (
    <div className="min-h-screen">
      <CustomerHeader tableNumber={tableNumber} />
      <Outlet />
      <CartDrawer tableNumber={tableNumber} />
      <CheckoutModal
        open={isCheckoutOpen}
        onClose={closeCheckout}
        lines={lines}
        total={total}
        tableNumber={tableNumber}
        orderPath={orderPath}
        onPlaced={() => {
          clear();
          closeCheckout();
          closeDrawer();
        }}
      />
      <ScrollRestoration />
    </div>
  );
}
