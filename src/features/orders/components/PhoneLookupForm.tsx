import { useState, type FormEvent } from 'react';
import { Button, Input } from '@/components/ui';
import { PHONE_LENGTH, PHONE_REGEX } from '@/constants/validation';
import { normalizeMobile } from '@/lib/format';

export function PhoneLookupForm({ initialPhone, onSubmit }: { initialPhone: string; onSubmit: (phone: string) => void }) {
  const [phone, setPhone] = useState(initialPhone);
  const [error, setError] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!PHONE_REGEX.test(phone)) return setError('Enter a valid 10-digit mobile number');
    setError('');
    onSubmit(phone);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2" noValidate>
      <div className="flex-1">
        <label htmlFor="lookup-phone" className="sr-only">
          Mobile number
        </label>
        <Input id="lookup-phone" inputMode="numeric" placeholder="98765 43210" value={phone} onChange={(e) => setPhone(normalizeMobile(e.target.value, PHONE_LENGTH))} invalid={Boolean(error)} />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
      <Button type="submit" className="h-[42px]">
        Find
      </Button>
    </form>
  );
}
