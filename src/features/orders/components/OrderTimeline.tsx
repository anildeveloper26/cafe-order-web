import { CheckCircle2, ChefHat, Clock, PackageCheck, XCircle } from 'lucide-react';
import { ORDER_PROGRESS } from '@/constants/orders';
import { cn } from '@/lib/cn';
import type { OrderStatus } from '@/types/order';

const ICONS = { pending: Clock, preparing: ChefHat, ready: PackageCheck, completed: CheckCircle2 } as const;

export function OrderTimeline({ status }: { status: OrderStatus }) {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700" role="status">
        <XCircle size={18} /> This order was cancelled. Please ask the staff for help.
      </div>
    );
  }
  const current = ORDER_PROGRESS.findIndex((s) => s.status === status);
  return (
    <ol className="grid grid-cols-4 gap-2" aria-label="Order progress">
      {ORDER_PROGRESS.map((step, i) => {
        const done = i <= current;
        const Icon = ICONS[step.status as keyof typeof ICONS];
        return (
          <li key={step.status} className="flex flex-col items-center text-center" aria-current={i === current ? 'step' : undefined}>
            <span className={cn('flex h-10 w-10 items-center justify-center rounded-full transition', done ? 'bg-brand-700 text-white' : 'bg-stone-100 text-stone-400')}>
              <Icon size={18} />
            </span>
            <span className={cn('mt-1.5 text-xs font-medium', done ? 'text-stone-900' : 'text-stone-400')}>{step.label}</span>
          </li>
        );
      })}
    </ol>
  );
}
