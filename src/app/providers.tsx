import { lazy, Suspense, type ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { IS_DEV } from '@/lib/env';
import { queryClient } from './queryClient';
import './setupAuth';

const Devtools = IS_DEV
  ? lazy(() => import('@tanstack/react-query-devtools').then((m) => ({ default: m.ReactQueryDevtools })))
  : () => null;

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="top-center" toastOptions={{ duration: 3000, style: { borderRadius: '12px', fontSize: '14px' } }} />
      <Suspense fallback={null}>
        <Devtools buttonPosition="bottom-left" />
      </Suspense>
    </QueryClientProvider>
  );
}
