import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectIsAuthed, useAuthStore } from '@/features/auth';
import { PATHS } from '../paths';

/** Guest-only routes (login): signed-in admins go back to where they came from. */
export default function RedirectIfAuthed() {
  const isAuthed = useAuthStore(selectIsAuthed);
  const from = (useLocation().state as { from?: string } | null)?.from;
  return isAuthed ? <Navigate to={from ?? PATHS.admin} replace /> : <Outlet />;
}
