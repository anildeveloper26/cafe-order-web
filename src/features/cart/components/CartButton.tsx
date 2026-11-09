import { ShoppingBag } from 'lucide-react';
import { Button, CountBadge } from '@/components/ui';
import { selectCount, useCartStore } from '../store/cart.store';

export function CartButton() {
  const count = useCartStore(selectCount);
  const openDrawer = useCartStore((s) => s.openDrawer);
  return (
    <Button onClick={openDrawer} className="relative" aria-label={`Open cart, ${count} items`} icon={<ShoppingBag size={18} />}>
      <span className="hidden sm:inline">Cart</span>
      <CountBadge count={count} />
    </Button>
  );
}
