import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/constants/storage';

interface AuthState {
  token: string | null;
  email: string | null;
  setAuth: (token: string, email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      email: null,
      setAuth: (token, email) => set({ token, email }),
      logout: () => set({ token: null, email: null }),
    }),
    { name: STORAGE_KEYS.auth },
  ),
);

export const selectIsAuthed = (s: AuthState) => Boolean(s.token);
