const trimSlash = (s: string) => s.replace(/\/+$/, '');

export const API_URL = trimSlash(import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api');
export const SOCKET_URL = trimSlash(import.meta.env.VITE_SOCKET_URL ?? API_URL.replace(/\/api$/, ''));
export const PUBLIC_URL = trimSlash(import.meta.env.VITE_PUBLIC_URL || window.location.origin);
export const IS_DEV = import.meta.env.DEV;
