import { Spinner } from '@/components/ui';

export function FullPageSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center text-brand-700" role="status" aria-label="Loading">
      <Spinner className="h-8 w-8" />
    </div>
  );
}
