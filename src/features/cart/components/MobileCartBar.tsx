import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui';
import { formatPrice, pluralize } from '@/lib/format';
import { selectCount, selectTotal, useCartStore } from '../store/cart.store';

export function MobileCartBar() {
  const count = useCartStore(selectCount);
  const total = useCartStore(selectTotal);
  const openDrawer = useCartStore((s) => s.openDrawer);
  if (count === 0) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 p-4 sm:hidden">
      <Button size="lg" fullWidth onClick={openDrawer} className="h-14 justify-between rounded-2xl shadow-lg">
        <span className="flex items-center gap-2">
          <ShoppingBag size={18} /> {pluralize(count, 'item')}
        </span>
        <span>View cart · {formatPrice(total)}</span>
      </Button>
    </div>
  );
}
