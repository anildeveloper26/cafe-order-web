import { cleanParams, http, unwrap } from '@/lib/http';
import { MENU_PAGE_LIMIT } from '@/constants/menu';
import { ENDPOINTS } from '@/constants/endpoints';
import type { ApiResponse } from '@/types/api';
import type { MenuFilters, MenuItem, MenuItemInput } from '@/types/menu';

export const menuApi = {
  list: (filters: MenuFilters, signal?: AbortSignal) =>
    http
      .get<ApiResponse<MenuItem[]>>(ENDPOINTS.menu, { params: cleanParams({ ...filters, limit: MENU_PAGE_LIMIT }), signal })
      .then(unwrap),
  create: (body: MenuItemInput) => http.post<ApiResponse<MenuItem>>(ENDPOINTS.menu, body).then(unwrap).then((r) => r.data),
  update: (id: string, body: Partial<MenuItemInput>) =>
    http.put<ApiResponse<MenuItem>>(ENDPOINTS.menuItem(id), body).then(unwrap).then((r) => r.data),
  remove: (id: string) => http.delete<ApiResponse<{ _id: string }>>(ENDPOINTS.menuItem(id)).then(unwrap).then((r) => r.data),
};
