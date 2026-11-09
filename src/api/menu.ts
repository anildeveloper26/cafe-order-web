import { api } from './client';
import type { ApiResponse, Category, MenuItem, MenuItemInput, SortOption } from '../types';

export interface MenuQuery {
  search?: string;
  category?: Category | '';
  sort?: SortOption;
  available?: 'true' | 'false' | 'all';
}

export async function fetchMenu(query: MenuQuery, signal?: AbortSignal) {
  const params = Object.fromEntries(Object.entries({ ...query, limit: 100 }).filter(([, v]) => v !== '' && v !== undefined));
  const { data } = await api.get<ApiResponse<MenuItem[]>>('/menu', { params, signal });
  return data;
}

export const createMenuItem = (body: MenuItemInput) => api.post<ApiResponse<MenuItem>>('/menu', body).then((r) => r.data);
export const updateMenuItem = (id: string, body: Partial<MenuItemInput>) =>
  api.put<ApiResponse<MenuItem>>(`/menu/${id}`, body).then((r) => r.data);
export const deleteMenuItem = (id: string) => api.delete<ApiResponse<{ _id: string }>>(`/menu/${id}`).then((r) => r.data);
