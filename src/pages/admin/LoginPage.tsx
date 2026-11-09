import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LoginForm } from '@/features/auth';
import { PATHS } from '@/routes/paths';

export default function LoginPage() {
  const navigate = useNavigate();
  const from = (useLocation().state as { from?: string } | null)?.from;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 to-stone-100 p-4">
      <LoginForm
        onSuccess={() => {
          toast.success('Welcome back!');
          navigate(from ?? PATHS.admin, { replace: true });
        }}
      />
    </div>
  );
}
