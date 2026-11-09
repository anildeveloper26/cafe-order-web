import { CATEGORIES, SORT_OPTIONS } from './menu';
import { ORDER_STATUSES } from './orders';
import { PHONE_REGEX } from './validation';

/** Validators for values read from the URL. */
export const isCategory = (v: string) => (CATEGORIES as readonly string[]).includes(v);
export const isSort = (v: string) => v in SORT_OPTIONS;
export const isOrderStatus = (v: string) => (ORDER_STATUSES as readonly string[]).includes(v);
export const isPhone = (v: string) => PHONE_REGEX.test(v);
export const isPositiveInt = (v: string) => /^[1-9]\d{0,2}$/.test(v);
