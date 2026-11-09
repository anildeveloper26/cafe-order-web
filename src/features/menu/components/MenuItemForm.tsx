import { useState, type FormEvent } from 'react';
import { Button, Checkbox, FormField, Input, Modal, Select, Textarea } from '@/components/ui';
import { CATEGORIES } from '@/constants/menu';
import { DESCRIPTION_MAX, NAME_MIN } from '@/constants/validation';
import { getErrorMessage, getFieldErrors } from '@/lib/errors';
import type { Category, MenuItem, MenuItemInput } from '@/types/menu';
import { useCreateMenuItem, useUpdateMenuItem } from '../hooks/useMenuMutations';

const EMPTY: MenuItemInput = { name: '', description: '', category: 'coffee', price: 0, imageUrl: '', isAvailable: true, isVeg: true };
const CATEGORY_OPTIONS = CATEGORIES.map((c) => ({ value: c, label: c }));

interface Props {
  item: MenuItem | null; // null = create
  onClose: () => void;
}

/** Create/edit dialog. Mount with a `key` per item so state resets between items. */
export function MenuItemForm({ item, onClose }: Props) {
  const [form, setForm] = useState<MenuItemInput>(item ? { ...EMPTY, ...item } : EMPTY);
  const [price, setPrice] = useState(item ? String(item.price) : '');
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const create = useCreateMenuItem();
  const update = useUpdateMenuItem();
  const mutation = item ? update : create;
  const errors = { ...getFieldErrors(mutation.error), ...clientErrors };

  const set = <K extends keyof MenuItemInput>(k: K, v: MenuItemInput[K]) => setForm((f) => ({ ...f, [k]: v }));

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.name.trim().length < NAME_MIN) errs.name = `Name must be at least ${NAME_MIN} characters`;
    if (!(Number(price) > 0)) errs.price = 'Price must be greater than 0';
    setClientErrors(errs);
    if (Object.keys(errs).length) return;

    const body: MenuItemInput = {
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      imageUrl: form.imageUrl.trim(),
      price: Number(price),
    };
    if (item) update.mutate({ id: item._id, body }, { onSuccess: onClose });
    else create.mutate(body, { onSuccess: onClose });
  }

  return (
    <Modal open onClose={onClose} title={item ? 'Edit menu item' : 'New menu item'} size="lg">
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <FormField label="Name" htmlFor="m-name" error={errors.name}>
          <Input id="m-name" value={form.name} onChange={(e) => set('name', e.target.value)} invalid={Boolean(errors.name)} />
        </FormField>
        <FormField label="Description" htmlFor="m-desc">
          <Textarea id="m-desc" maxLength={DESCRIPTION_MAX} value={form.description} onChange={(e) => set('description', e.target.value)} />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Category" htmlFor="m-cat">
            <Select<Category> id="m-cat" className="capitalize" value={form.category} onChange={(v) => set('category', v)} options={CATEGORY_OPTIONS} />
          </FormField>
          <FormField label="Price (₹)" htmlFor="m-price" error={errors.price}>
            <Input id="m-price" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value.replace(/[^\d.]/g, ''))} invalid={Boolean(errors.price)} />
          </FormField>
        </div>
        <FormField label="Image URL" htmlFor="m-img" error={errors.imageUrl}>
          <Input id="m-img" placeholder="https://…" value={form.imageUrl} onChange={(e) => set('imageUrl', e.target.value)} invalid={Boolean(errors.imageUrl)} />
        </FormField>
        <div className="flex gap-6">
          <Checkbox label="Available" checked={form.isAvailable} onChange={(v) => set('isAvailable', v)} />
          <Checkbox label="Vegetarian" checked={form.isVeg} onChange={(v) => set('isVeg', v)} />
        </div>
        {mutation.isError && !Object.keys(getFieldErrors(mutation.error)).length && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {getErrorMessage(mutation.error)}
          </p>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={mutation.isPending} loadingText="Saving…">
            {item ? 'Save changes' : 'Create item'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
