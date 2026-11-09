import { http, unwrap } from '@/lib/http';
import { ENDPOINTS } from '@/constants/endpoints';
import type { ApiResponse } from '@/types/api';

export interface LoginResult {
  token: string;
  admin: { email: string };
}

export const authApi = {
  login: (email: string, password: string) =>
    http.post<ApiResponse<LoginResult>>(ENDPOINTS.login, { email, password }).then(unwrap).then((r) => r.data),
};
