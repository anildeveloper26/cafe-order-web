import { cn } from '@/lib/cn';

export function VegBadge({ isVeg }: { isVeg: boolean }) {
  return (
    <span
      className={cn('inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border-2 bg-white', isVeg ? 'border-green-600' : 'border-red-600')}
      title={isVeg ? 'Veg' : 'Non-veg'}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', isVeg ? 'bg-green-600' : 'bg-red-600')} />
    </span>
  );
}
