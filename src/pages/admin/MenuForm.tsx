import { useState, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import { createMenuItem, updateMenuItem } from '../../api/menu';
import { getErrorMessage, getFieldErrors } from '../../api/client';
import { Modal } from '../../components/Modal';
import { Spinner } from '../../components/States';
import { CATEGORIES, type MenuItem, type MenuItemInput } from '../../types';

interface Props {
  item: MenuItem | null; // null = create
  open: boolean;
  onClose: () => void;
  onSaved: (item: MenuItem) => void;
}

const EMPTY: MenuItemInput = { name: '', description: '', category: 'coffee', price: 0, imageUrl: '', isAvailable: true, isVeg: true };

export function MenuForm({ item, open, onClose, onSaved }: Props) {
  const [form, setForm] = useState<MenuItemInput>(item ? { ...EMPTY, ...item } : EMPTY);
  const [price, setPrice] = useState(item ? String(item.price) : '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof MenuItemInput>(k: K, v: MenuItemInput[K]) => setForm((f) => ({ ...f, [k]: v }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!(Number(price) > 0)) errs.price = 'Price must be greater than 0';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const body: MenuItemInput = {
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category,
      price: Number(price),
      imageUrl: form.imageUrl.trim(),
      isAvailable: form.isAvailable,
      isVeg: form.isVeg,
    };
    setSaving(true);
    try {
      const res = item ? await updateMenuItem(item._id, body) : await createMenuItem(body);
      toast.success(item ? 'Item updated' : 'Item created');
      onSaved(res.data);
    } catch (err) {
      setErrors(getFieldErrors(err));
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  const err = (k: string) => errors[k] && <p className="mt-1 text-xs text-red-600">{errors[k]}</p>;

  return (
    <Modal open={open} onClose={onClose} title={item ? 'Edit menu item' : 'New menu item'} maxWidth="max-w-lg">
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="m-name" className="label">Name</label>
          <input id="m-name" className="input" value={form.name} onChange={(e) => set('name', e.target.value)} />
          {err('name')}
        </div>
        <div>
          <label htmlFor="m-desc" className="label">Description</label>
          <textarea id="m-desc" className="input min-h-20 resize-none" maxLength={500} value={form.description} onChange={(e) => set('description', e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="m-cat" className="label">Category</label>
            <select id="m-cat" className="input capitalize" value={form.category} onChange={(e) => set('category', e.target.value as MenuItemInput['category'])}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="m-price" className="label">Price (₹)</label>
            <input id="m-price" className="input" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value.replace(/[^\d.]/g, ''))} />
            {err('price')}
          </div>
        </div>
        <div>
          <label htmlFor="m-img" className="label">Image URL</label>
          <input id="m-img" className="input" placeholder="https://…" value={form.imageUrl} onChange={(e) => set('imageUrl', e.target.value)} />
          {err('imageUrl')}
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4 accent-brand-700" checked={form.isAvailable} onChange={(e) => set('isAvailable', e.target.checked)} /> Available</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4 accent-brand-700" checked={form.isVeg} onChange={(e) => set('isVeg', e.target.checked)} /> Vegetarian</label>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary">{saving ? <><Spinner /> Saving…</> : item ? 'Save changes' : 'Create item'}</button>
        </div>
      </form>
    </Modal>
  );
}
