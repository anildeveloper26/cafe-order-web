import axios, { AxiosError } from 'axios';
import { API_URL } from '../lib/env';
import { useAuthStore } from '../store/authStore';

export const api = axios.create({ baseURL: API_URL, timeout: 60000 });

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    if (err.response?.status === 401 && useAuthStore.getState().token) useAuthStore.getState().logout();
    return Promise.reject(err);
  },
);

interface ApiErrorBody {
  message?: string;
  errors?: { field: string; message: string }[];
}

/** Turns any axios/network error into a human-readable message. */
export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError<ApiErrorBody>(err)) {
    if (!err.response) {
      return err.code === 'ECONNABORTED'
        ? 'The server took too long to respond. Please try again.'
        : 'Cannot reach the server. Check your connection and try again.';
    }
    const body = err.response.data;
    if (body?.errors?.length) return body.errors.map((e) => e.message).join(', ');
    if (body?.message) return body.message;
  }
  return err instanceof Error ? err.message : 'Something went wrong';
}

export function getFieldErrors(err: unknown): Record<string, string> {
  if (axios.isAxiosError<ApiErrorBody>(err) && err.response?.data?.errors) {
    return Object.fromEntries(err.response.data.errors.map((e) => [e.field, e.message]));
  }
  return {};
}
