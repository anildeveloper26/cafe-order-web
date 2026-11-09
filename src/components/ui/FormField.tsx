import type { ReactNode } from 'react';

interface Props {
  label: ReactNode;
  htmlFor: string;
  error?: string;
  hint?: ReactNode;
  optional?: boolean;
  children: ReactNode;
}

/** Label + control + error/hint, consistently spaced and wired for screen readers. */
export function FormField({ label, htmlFor, error, hint, optional, children }: Props) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-stone-700">
        {label} {optional && <span className="font-normal text-stone-400">(optional)</span>}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1 text-xs text-stone-400">{hint}</p>
      )}
    </div>
  );
}
