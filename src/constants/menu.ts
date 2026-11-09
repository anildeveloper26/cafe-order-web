export const CATEGORIES = ['coffee', 'tea', 'beverages', 'snacks', 'meals', 'desserts'] as const;

export const CATEGORY_EMOJI: Record<(typeof CATEGORIES)[number], string> = {
  coffee: '☕',
  tea: '🍵',
  beverages: '🥤',
  snacks: '🥪',
  meals: '🍝',
  desserts: '🍰',
};

export const SORT_OPTIONS = {
  name: 'Name (A–Z)',
  price_asc: 'Price: Low to High',
  price_desc: 'Price: High to Low',
  newest: 'Newest',
} as const;

export const DEFAULT_SORT = 'name';
export const MENU_PAGE_LIMIT = 100;
export const MAX_CART_QTY = 50;
export const SEARCH_DEBOUNCE_MS = 350;
