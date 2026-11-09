import type { ReactNode } from 'react';
import { AlertTriangle, RefreshCw, SearchX } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';

export function ErrorState({ message, onRetry, title = "Couldn't load this" }: { message: string; onRetry?: () => void; title?: string }) {
  return (
    <Card className="mx-auto flex max-w-md flex-col items-center p-8 text-center" role="alert">
      <div className="rounded-full bg-red-50 p-3 text-red-600">
        <AlertTriangle />
      </div>
      <h3 className="mt-3 font-semibold text-stone-900">{title}</h3>
      <p className="mt-1 text-sm text-stone-500">{message}</p>
      {onRetry && (
        <Button variant="outline" className="mt-4" onClick={onRetry} icon={<RefreshCw size={16} />}>
          Try again
        </Button>
      )}
    </Card>
  );
}

export function EmptyState({ title, hint, action, icon }: { title: string; hint?: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <div className="rounded-full bg-stone-100 p-3 text-stone-400">{icon ?? <SearchX />}</div>
      <h3 className="mt-3 font-semibold text-stone-900">{title}</h3>
      {hint && <p className="mt-1 text-sm text-stone-500">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
