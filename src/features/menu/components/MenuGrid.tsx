import type { ReactNode } from 'react';
import { Card, Skeleton } from '@/components/ui';
import { cn } from '@/lib/cn';

const GRID = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

export function MenuGrid({ children, dimmed }: { children: ReactNode; dimmed?: boolean }) {
  return <div className={cn(GRID, 'transition-opacity', dimmed && 'opacity-60')}>{children}</div>;
}

export function MenuGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className={GRID} aria-busy="true" aria-label="Loading menu">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="h-40 rounded-none sm:h-44" />
          <div className="space-y-2 p-4">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-full bg-stone-100" />
            <Skeleton className="h-3 w-4/5 bg-stone-100" />
            <div className="flex justify-between pt-3">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-10 w-20 rounded-xl" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
