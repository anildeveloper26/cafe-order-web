import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getErrorMessage, isClientError } from '@/lib/errors';

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: { skipGlobalError?: boolean };
  }
}

const MAX_RETRIES = 2;

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    // First-load errors render inline (ErrorState); only background refetch failures toast.
    onError: (error, query) => {
      if (query.state.data !== undefined) toast.error(getErrorMessage(error), { id: 'background-refetch' });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _vars, _ctx, mutation) => {
      if (!mutation.options.meta?.skipGlobalError) toast.error(getErrorMessage(error));
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      // Retry network/5xx (e.g. Render cold start) with backoff; 4xx won't change on retry.
      retry: (count, error) => count < MAX_RETRIES && !isClientError(error),
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
    },
    mutations: { retry: 0 },
  },
});
