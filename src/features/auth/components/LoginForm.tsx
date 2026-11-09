import { useState, type FormEvent } from 'react';
import { Button, Card, FormField, Input } from '@/components/ui';
import { BrandLogo } from '@/components/common/BrandLogo';
import { getErrorMessage } from '@/lib/errors';
import { useLogin } from '../hooks/useLogin';

export function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useLogin();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    login.mutate({ email, password }, { onSuccess });
  }

  return (
    <Card className="w-full max-w-sm p-6">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex flex-col items-center text-center">
          <BrandLogo size="lg" />
          <h1 className="mt-3 text-xl font-bold text-stone-900">Cafe admin</h1>
          <p className="text-sm text-stone-500">Manage the menu and incoming orders</p>
        </div>
        <FormField label="Email" htmlFor="email">
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
        </FormField>
        <FormField label="Password" htmlFor="password">
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </FormField>
        {login.isError && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {getErrorMessage(login.error)}
          </p>
        )}
        <Button type="submit" size="lg" fullWidth loading={login.isPending} loadingText="Signing in…">
          Sign in
        </Button>
      </form>
    </Card>
  );
}
