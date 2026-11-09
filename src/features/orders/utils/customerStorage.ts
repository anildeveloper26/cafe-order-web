import { STORAGE_KEYS } from '@/constants/storage';
import { local } from '@/lib/storage';
import type { Customer } from '@/types/order';

/** Remembers the customer's name/phone on this device to prefill checkout and "My orders". */
export const loadSavedCustomer = () => local.get<Partial<Customer>>(STORAGE_KEYS.customer, {});
export const saveCustomer = (c: Pick<Customer, 'name' | 'phone'>) => local.set(STORAGE_KEYS.customer, c);
