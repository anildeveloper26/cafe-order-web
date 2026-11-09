import { ConfirmDialog } from '@/components/ui';
import type { MenuItem } from '@/types/menu';
import { useDeleteMenuItem } from '../hooks/useMenuMutations';

export function DeleteMenuItemDialog({ item, onClose }: { item: MenuItem | null; onClose: () => void }) {
  const remove = useDeleteMenuItem();
  return (
    <ConfirmDialog
      open={Boolean(item)}
      title="Delete item?"
      confirmLabel="Delete"
      loading={remove.isPending}
      onCancel={onClose}
      onConfirm={() => item && remove.mutate(item, { onSuccess: onClose })}
    >
      <span className="font-semibold text-stone-900">{item?.name}</span> will be removed from the menu. Past orders keep their copy of the item.
    </ConfirmDialog>
  );
}
