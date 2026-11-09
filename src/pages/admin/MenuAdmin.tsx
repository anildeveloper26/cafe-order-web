import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useMenu } from '../../hooks/useMenu';
import { useDebounce } from '../../hooks/useDebounce';
import { deleteMenuItem, updateMenuItem } from '../../api/menu';
import { getErrorMessage } from '../../api/client';
import { EmptyState, ErrorState, Spinner } from '../../components/States';
import { ItemImage } from '../../components/ItemImage';
import { Modal } from '../../components/Modal';
import { formatPrice } from '../../lib/format';
import { CATEGORIES, type Category, type MenuItem } from '../../types';
import { MenuForm } from './MenuForm';

export default function MenuAdmin() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const debounced = useDebounce(search.trim());
  const query = useMemo(() => ({ search: debounced, category, available: 'all' as const, sort: 'name' as const }), [debounced, category]);
  const { items, setItems, loading, error, reload } = useMenu(query);

  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [toDelete, setToDelete] = useState<MenuItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openCreate = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (item: MenuItem) => { setEditing(item); setFormOpen(true); };

  async function toggleAvailable(item: MenuItem) {
    const prev = items;
    setItems((list) => list.map((i) => (i._id === item._id ? { ...i, isAvailable: !i.isAvailable } : i)));
    try {
      await updateMenuItem(item._id, { isAvailable: !item.isAvailable });
    } catch (err) {
      setItems(prev);
      toast.error(getErrorMessage(err));
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteMenuItem(toDelete._id);
      setItems((list) => list.filter((i) => i._id !== toDelete._id));
      toast.success(`${toDelete.name} deleted`);
      setToDelete(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-stone-900">Menu items</h1>
        <button type="button" onClick={openCreate} className="btn-primary"><Plus size={16} /> Add item</button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input className="input pl-10" placeholder="Search items…" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search items" />
        </label>
        <select className="input capitalize sm:w-48" value={category} onChange={(e) => setCategory(e.target.value as Category | '')} aria-label="Filter by category">
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : loading && items.length === 0 ? (
        <div className="flex justify-center py-16 text-brand-700"><Spinner className="h-7 w-7" /></div>
      ) : items.length === 0 ? (
        <EmptyState title="No menu items" hint="Add your first item to get started." />
      ) : (
        <div className="card overflow-x-auto">
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
                <tr key={item._id} className={item.isAvailable ? '' : 'bg-stone-50/60 text-stone-400'}>
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
                    <button
                      type="button"
                      role="switch"
                      aria-checked={item.isAvailable}
                      aria-label={`Toggle availability of ${item.name}`}
                      onClick={() => toggleAvailable(item)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${item.isAvailable ? 'bg-emerald-500' : 'bg-stone-300'}`}
                    >
                      <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition ${item.isAvailable ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button type="button" onClick={() => openEdit(item)} className="rounded-lg p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-900" aria-label={`Edit ${item.name}`}><Pencil size={16} /></button>
                      <button type="button" onClick={() => setToDelete(item)} className="rounded-lg p-2 text-stone-500 hover:bg-red-50 hover:text-red-600" aria-label={`Delete ${item.name}`}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formOpen && (
        <MenuForm
          key={editing?._id ?? 'new'}
          item={editing}
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSaved={(saved) => {
            setFormOpen(false);
            setItems((list) => (list.some((i) => i._id === saved._id) ? list.map((i) => (i._id === saved._id ? saved : i)) : [saved, ...list]));
          }}
        />
      )}

      <Modal open={Boolean(toDelete)} onClose={() => setToDelete(null)} title="Delete item?">
        <p className="text-sm text-stone-600">
          <span className="font-semibold text-stone-900">{toDelete?.name}</span> will be removed from the menu. Past orders keep their copy of the item.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={() => setToDelete(null)} className="btn-outline">Cancel</button>
          <button type="button" onClick={confirmDelete} disabled={deleting} className="btn bg-red-600 text-white hover:bg-red-700">{deleting ? <><Spinner /> Deleting…</> : 'Delete'}</button>
        </div>
      </Modal>
    </div>
  );
}
