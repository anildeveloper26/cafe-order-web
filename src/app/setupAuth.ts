import { configureAuth } from '@/lib/http';
import { useAuthStore } from '@/features/auth';
import { orderKeys } from '@/constants/queryKeys';
import { queryClient } from './queryClient';

/** Connects the HTTP client to the auth store: attach the token, and sign out on 401. */
configureAuth(
  () => useAuthStore.getState().token,
  () => {
    useAuthStore.getState().logout();
    queryClient.removeQueries({ queryKey: orderKeys.all });
  },
);
