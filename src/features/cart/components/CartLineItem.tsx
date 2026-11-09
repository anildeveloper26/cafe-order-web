import { Trash2 } from 'lucide-react';
import { IconButton, QuantityStepper } from '@/components/ui';
import { ItemImage } from '@/components/common/ItemImage';
import { formatPrice } from '@/lib/format';
import type { CartLine } from '../store/cart.store';

interface Props {
  line: CartLine;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onRemove: (id: string) => void;
}

export function CartLineItem({ line: { item, quantity }, onIncrement, onDecrement, onRemove }: Props) {
  return (
    <li className="flex gap-3 py-4">
      <ItemImage src={item.imageUrl} alt={item.name} category={item.category} className="h-16 w-16 shrink-0 rounded-xl" />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate font-medium text-stone-900">{item.name}</p>
          <IconButton label={`Remove ${item.name}`} tone="danger" onClick={() => onRemove(item._id)}>
            <Trash2 size={16} />
          </IconButton>
        </div>
        <p className="text-xs text-stone-500">{formatPrice(item.price)} each</p>
        <div className="mt-2 flex items-center justify-between">
          <QuantityStepper size="sm" value={quantity} onIncrement={() => onIncrement(item._id)} onDecrement={() => onDecrement(item._id)} label={item.name} />
          <span className="font-semibold tabular-nums text-stone-900">{formatPrice(item.price * quantity)}</span>
        </div>
      </div>
    </li>
  );
}
