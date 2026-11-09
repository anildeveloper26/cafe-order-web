import { useState } from 'react';
import type { Category } from '../types';

const EMOJI: Record<Category, string> = {
  coffee: '☕',
  tea: '🍵',
  beverages: '🥤',
  snacks: '🥪',
  meals: '🍝',
  desserts: '🍰',
};

interface Props {
  src: string;
  alt: string;
  category: Category;
  className?: string;
}

/** Image with a category emoji fallback when the URL is missing or fails to load. */
export function ItemImage({ src, alt, category, className = '' }: Props) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-brand-100 to-amber-50 ${className}`} aria-label={alt}>
        <span className="text-4xl" aria-hidden>
          {EMOJI[category] ?? '🍽️'}
        </span>
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={`object-cover ${className}`} />;
}
