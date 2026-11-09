import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { menuKeys } from '@/constants/queryKeys';
import type { ApiResponse } from '@/types/api';
import type { MenuItem, MenuItemInput } from '@/types/menu';
import { menuApi } from '../api/menu.api';

const useInvalidateMenu = () => {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: menuKeys.all });
};

export function useCreateMenuItem() {
  const invalidate = useInvalidateMenu();
  return useMutation({
    mutationFn: (body: MenuItemInput) => menuApi.create(body),
    onSuccess: (item) => {
      toast.success(`${item.name} created`);
      return invalidate();
    },
    meta: { skipGlobalError: true },
  });
}

export function useUpdateMenuItem() {
  const invalidate = useInvalidateMenu();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<MenuItemInput> }) => menuApi.update(id, body),
    onSuccess: (item) => {
      toast.success(`${item.name} updated`);
      return invalidate();
    },
    meta: { skipGlobalError: true },
  });
}

export function useDeleteMenuItem() {
  const invalidate = useInvalidateMenu();
  return useMutation({
    mutationFn: (item: MenuItem) => menuApi.remove(item._id),
    onSuccess: (_res, item) => {
      toast.success(`${item.name} deleted`);
      return invalidate();
    },
  });
}

type MenuListCache = ApiResponse<MenuItem[]> | undefined;

/** Optimistically flips availability in every cached list; rolls back on failure. */
export function useToggleAvailability() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (item: MenuItem) => menuApi.update(item._id, { isAvailable: !item.isAvailable }),
    onMutate: async (item) => {
      await qc.cancelQueries({ queryKey: menuKeys.lists() });
      const snapshot = qc.getQueriesData<MenuListCache>({ queryKey: menuKeys.lists() });
      qc.setQueriesData<MenuListCache>({ queryKey: menuKeys.lists() }, (old) =>
        old ? { ...old, data: old.data.map((i) => (i._id === item._id ? { ...i, isAvailable: !i.isAvailable } : i)) } : old,
      );
      return { snapshot };
    },
    onError: (_err, _item, ctx) => ctx?.snapshot.forEach(([key, data]) => qc.setQueryData(key, data)),
    onSettled: () => qc.invalidateQueries({ queryKey: menuKeys.all }),
  });
}
