import axios from 'axios';
import { API_URL } from './env';
import type { ApiResponse } from '@/types/api';

export const http = axios.create({ baseURL: API_URL, timeout: 60_000 });

type TokenGetter = () => string | null;
type UnauthorizedHandler = () => void;

let getToken: TokenGetter = () => null;
let onUnauthorized: UnauthorizedHandler = () => {};

/** Wired once from the auth feature so lib/ stays free of feature imports. */
export function configureAuth(tokenGetter: TokenGetter, unauthorizedHandler: UnauthorizedHandler) {
  getToken = tokenGetter;
  onUnauthorized = unauthorizedHandler;
}

http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (axios.isAxiosError(err) && err.response?.status === 401 && getToken()) onUnauthorized();
    return Promise.reject(err);
  },
);

/** Unwraps the { success, data } envelope. */
export const unwrap = <T>(res: { data: ApiResponse<T> }) => res.data;

/** Drops empty values so they don't end up as `?category=` in the URL. */
export const cleanParams = (params: object) =>
  Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v !== undefined && v !== null));
