import { Spinner } from '@/components/ui';

export function WakingBanner() {
  return (
    <div className="mb-4 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800" role="status">
      <Spinner />
      Waking up the server — the first load can take up to a minute on the free tier.
    </div>
  );
}
