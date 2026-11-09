import { cn } from '@/lib/cn';

export function Spinner({ className }: { className?: string }) {
  return <span className={cn('inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent', className)} aria-hidden />;
}

export function CenteredSpinner({ className }: { className?: string }) {
  return (
    <div className={cn('flex justify-center py-16 text-brand-700', className)} role="status" aria-label="Loading">
      <Spinner className="h-7 w-7" />
    </div>
  );
}
