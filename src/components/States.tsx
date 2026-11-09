import { AlertTriangle, RefreshCw, SearchX } from 'lucide-react';

export function MenuSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-busy="true" aria-label="Loading menu">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card overflow-hidden">
          <div className="h-40 animate-pulse bg-stone-200 sm:h-44" />
          <div className="space-y-2 p-4">
            <div className="h-4 w-2/3 animate-pulse rounded bg-stone-200" />
            <div className="h-3 w-full animate-pulse rounded bg-stone-100" />
            <div className="h-3 w-4/5 animate-pulse rounded bg-stone-100" />
            <div className="flex justify-between pt-3">
              <div className="h-6 w-16 animate-pulse rounded bg-stone-200" />
              <div className="h-10 w-20 animate-pulse rounded-xl bg-stone-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="card mx-auto flex max-w-md flex-col items-center p-8 text-center" role="alert">
      <div className="rounded-full bg-red-50 p-3 text-red-600">
        <AlertTriangle />
      </div>
      <h3 className="mt-3 font-semibold text-stone-900">Couldn't load this</h3>
      <p className="mt-1 text-sm text-stone-500">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-outline mt-4">
          <RefreshCw size={16} /> Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, hint, action }: { title: string; hint?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <div className="rounded-full bg-stone-100 p-3 text-stone-400">
        <SearchX />
      </div>
      <h3 className="mt-3 font-semibold text-stone-900">{title}</h3>
      {hint && <p className="mt-1 text-sm text-stone-500">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Spinner({ className = '' }: { className?: string }) {
  return <span className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent ${className}`} aria-hidden />;
}

export function WakingBanner() {
  return (
    <div className="mb-4 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800" role="status">
      <Spinner />
      Waking up the server — the first load can take up to a minute on the free tier.
    </div>
  );
}
