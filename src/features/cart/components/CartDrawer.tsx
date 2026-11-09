import { ShoppingBag } from 'lucide-react';
import { Button, Drawer, EmptyState } from '@/components/ui';
import { formatPrice, pluralize } from '@/lib/format';
import { useCartStore } from '../store/cart.store';
import { useCart } from '../hooks/useCart';
import { CartLineItem } from './CartLineItem';

export function CartDrawer({ tableNumber }: { tableNumber: number | null }) {
  const isOpen = useCartStore((s) => s.isDrawerOpen);
  const { lines, count, total, increment, decrement, remove, clear, closeDrawer, openCheckout } = useCart();

  const footer =
    lines.length > 0 ? (
      <>
        <div className="flex items-center justify-between text-sm text-stone-600">
          <span>Subtotal</span>
          <span className="tabular-nums">{formatPrice(total)}</span>
        </div>
        <div className="flex items-center justify-between text-lg font-bold text-stone-900">
          <span>Total</span>
          <span className="tabular-nums" data-testid="cart-total">
            {formatPrice(total)}
          </span>
        </div>
        <Button size="lg" fullWidth onClick={openCheckout}>
          Checkout · {formatPrice(total)}
        </Button>
        <Button variant="ghost" fullWidth className="text-stone-500" onClick={clear}>
          Clear cart
        </Button>
      </>
    ) : undefined;

  return (
    <Drawer
      open={isOpen}
      onClose={closeDrawer}
      title="Your cart"
      subtitle={`${pluralize(count, 'item')}${tableNumber ? ` · Table ${tableNumber}` : ''}`}
      footer={footer}
    >
      {lines.length === 0 ? (
        <div className="flex flex-1 items-center justify-center p-8">
          <EmptyState
            icon={<ShoppingBag size={24} />}
            title="Your cart is empty"
            hint="Add something tasty from the menu."
            action={<Button onClick={closeDrawer}>Browse menu</Button>}
          />
        </div>
      ) : (
        <ul className="divide-y divide-stone-100 px-5">
          {lines.map((line) => (
            <CartLineItem key={line.item._id} line={line} onIncrement={increment} onDecrement={decrement} onRemove={remove} />
          ))}
        </ul>
      )}
    </Drawer>
  );
}
