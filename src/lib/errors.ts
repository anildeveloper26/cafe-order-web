import axios from 'axios';
import type { ApiErrorBody } from '@/types/api';

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

/** Maps server validation errors to { "customer.phone": "message" }. */
export function getFieldErrors(err: unknown): Record<string, string> {
  if (axios.isAxiosError<ApiErrorBody>(err) && err.response?.data?.errors) {
    return Object.fromEntries(err.response.data.errors.map((e) => [e.field, e.message]));
  }
  return {};
}

export const getStatus = (err: unknown) => (axios.isAxiosError(err) ? err.response?.status : undefined);

/** 4xx errors won't succeed on retry. */
export const isClientError = (err: unknown) => {
  const status = getStatus(err);
  return status !== undefined && status >= 400 && status < 500;
};
