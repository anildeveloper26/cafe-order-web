import { Coffee } from 'lucide-react';
import { cn } from '@/lib/cn';

export function BrandLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const box = { sm: 'h-8 w-8 rounded-lg', md: 'h-9 w-9 rounded-xl', lg: 'h-12 w-12 rounded-2xl' }[size];
  const icon = { sm: 16, md: 20, lg: 24 }[size];
  return (
    <span className={cn('flex items-center justify-center bg-brand-700 text-white', box)}>
      <Coffee size={icon} />
    </span>
  );
}
