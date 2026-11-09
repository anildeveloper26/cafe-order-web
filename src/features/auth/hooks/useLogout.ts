import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { orderKeys } from '@/constants/queryKeys';
import { useAuthStore } from '../store/auth.store';

/** Clears the session and any admin-only cached data. */
export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();
  return useCallback(() => {
    logout();
    queryClient.removeQueries({ queryKey: orderKeys.all });
  }, [logout, queryClient]);
}
