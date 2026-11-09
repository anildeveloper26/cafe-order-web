import { Plus } from 'lucide-react';
import { Button, Card, QuantityStepper } from '@/components/ui';
import { ItemImage } from '@/components/common/ItemImage';
import { VegBadge } from '@/components/common/VegBadge';
import { formatPrice } from '@/lib/format';
import type { MenuItem } from '@/types/menu';

interface Props {
  item: MenuItem;
  quantity: number;
  onAdd: (item: MenuItem) => void;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
}

export function MenuCard({ item, quantity, onAdd, onIncrement, onDecrement }: Props) {
  return (
    <Card className="group flex flex-col overflow-hidden transition hover:shadow-md">
      <article className="flex flex-1 flex-col">
        <div className="relative">
          <ItemImage src={item.imageUrl} alt={item.name} category={item.category} className="h-40 w-full sm:h-44" />
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-medium capitalize text-stone-700 backdrop-blur">
            {item.category}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-start gap-2">
            <VegBadge isVeg={item.isVeg} />
            <h3 className="font-semibold leading-tight text-stone-900">{item.name}</h3>
          </div>
          <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-stone-500">{item.description}</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-lg font-bold text-stone-900">{formatPrice(item.price)}</span>
            {quantity > 0 ? (
              <QuantityStepper value={quantity} onIncrement={() => onIncrement(item._id)} onDecrement={() => onDecrement(item._id)} label={item.name} />
            ) : (
              <Button onClick={() => onAdd(item)} aria-label={`Add ${item.name} to cart`} icon={<Plus size={16} />}>
                Add
              </Button>
            )}
          </div>
        </div>
      </article>
    </Card>
  );
}
