import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Coffee } from 'lucide-react';
import { login } from '../../api/auth';
import { getErrorMessage } from '../../api/client';
import { useAuthStore } from '../../store/authStore';
import { Spinner } from '../../components/States';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, setAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (token) return <Navigate to="/admin" replace />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password);
      setAuth(res.data.token, res.data.admin.email);
      toast.success('Welcome back!');
      const to = (location.state as { from?: string } | null)?.from ?? '/admin';
      navigate(to, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 to-stone-100 p-4">
      <form onSubmit={onSubmit} className="card w-full max-w-sm space-y-4 p-6">
        <div className="text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-700 text-white"><Coffee /></span>
          <h1 className="mt-3 text-xl font-bold text-stone-900">Cafe admin</h1>
          <p className="text-sm text-stone-500">Manage the menu and incoming orders</p>
        </div>
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input id="email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
        </div>
        <div>
          <label htmlFor="password" className="label">Password</label>
          <input id="password" type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </div>
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary h-11 w-full">{loading ? <><Spinner /> Signing in…</> : 'Sign in'}</button>
      </form>
    </div>
  );
}
