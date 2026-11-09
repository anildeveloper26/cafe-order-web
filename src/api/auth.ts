import { api } from './client';
import type { ApiResponse } from '../types';

export const login = (email: string, password: string) =>
  api.post<ApiResponse<{ token: string; admin: { email: string } }>>('/auth/login', { email, password }).then((r) => r.data);
