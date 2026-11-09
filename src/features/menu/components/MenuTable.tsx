import { Pencil, Trash2 } from 'lucide-react';
import { Card, IconButton, Switch } from '@/components/ui';
import { ItemImage } from '@/components/common/ItemImage';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/cn';
import type { MenuItem } from '@/types/menu';

interface Props {
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (item: MenuItem) => void;
  onToggleAvailable: (item: MenuItem) => void;
}

export function MenuTable({ items, onEdit, onDelete, onToggleAvailable }: Props) {
  return (
    <Card className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="border-b border-stone-200 bg-stone-50 text-left text-stone-500">
          <tr>
            <th className="px-4 py-3 font-medium">Item</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 text-right font-medium">Price</th>
            <th className="px-4 py-3 text-center font-medium">Available</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {items.map((item) => (
            <tr key={item._id} className={cn(!item.isAvailable && 'bg-stone-50/60 text-stone-400')}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <ItemImage src={item.imageUrl} alt={item.name} category={item.category} className="h-11 w-11 shrink-0 rounded-lg" />
                  <div className="min-w-0">
                    <p className="font-medium text-stone-900">{item.name}</p>
                    <p className="max-w-xs truncate text-xs text-stone-500">{item.description}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 capitalize">{item.category}</td>
              <td className="px-4 py-3 text-right tabular-nums">{formatPrice(item.price)}</td>
              <td className="px-4 py-3 text-center">
                <Switch checked={item.isAvailable} onChange={() => onToggleAvailable(item)} label={`Toggle availability of ${item.name}`} />
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <IconButton label={`Edit ${item.name}`} onClick={() => onEdit(item)}>
                    <Pencil size={16} />
                  </IconButton>
                  <IconButton label={`Delete ${item.name}`} tone="danger" onClick={() => onDelete(item)}>
                    <Trash2 size={16} />
                  </IconButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
