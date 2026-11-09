import type { CATEGORIES, SORT_OPTIONS } from '@/constants/menu';

export type Category = (typeof CATEGORIES)[number];
export type SortOption = keyof typeof SORT_OPTIONS;
export type Availability = 'true' | 'false' | 'all';

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  category: Category;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  isVeg: boolean;
  createdAt: string;
  updatedAt: string;
}

export type MenuItemInput = Omit<MenuItem, '_id' | 'createdAt' | 'updatedAt'>;

export interface MenuFilters {
  search?: string;
  category?: Category | '';
  sort?: SortOption;
  available?: Availability;
}
