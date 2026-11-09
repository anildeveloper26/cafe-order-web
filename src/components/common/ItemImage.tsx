import { useState } from 'react';
import { CATEGORY_EMOJI } from '@/constants/menu';
import { cn } from '@/lib/cn';
import type { Category } from '@/types/menu';

interface Props {
  src: string;
  alt: string;
  category: Category;
  className?: string;
}

/** Image with a category emoji fallback when the URL is missing or fails to load. */
export function ItemImage({ src, alt, category, className }: Props) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={cn('flex items-center justify-center bg-gradient-to-br from-brand-100 to-amber-50', className)} role="img" aria-label={alt}>
        <span className="text-4xl" aria-hidden>
          {CATEGORY_EMOJI[category] ?? '🍽️'}
        </span>
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={cn('object-cover', className)} />;
}
