import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectIsAuthed, useAuthStore } from '@/features/auth';
import { PATHS } from '../paths';

/** Admin-only routes: sends guests to login and remembers where they were going (incl. query string). */
export default function RequireAdmin() {
  const isAuthed = useAuthStore(selectIsAuthed);
  const location = useLocation();
  if (!isAuthed) {
    return <Navigate to={PATHS.adminLogin} replace state={{ from: `${location.pathname}${location.search}` }} />;
  }
  return <Outlet />;
}
