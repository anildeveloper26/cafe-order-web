import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export const fieldClasses =
  'w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm outline-none transition placeholder:text-stone-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 disabled:opacity-60';

const invalid = 'border-red-400 focus:border-red-500 focus:ring-red-100';

type WithInvalid = { invalid?: boolean };

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & WithInvalid>(
  ({ className, invalid: isInvalid, ...rest }, ref) => (
    <input ref={ref} aria-invalid={isInvalid || undefined} className={cn(fieldClasses, isInvalid && invalid, className)} {...rest} />
  ),
);
Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & WithInvalid>(
  ({ className, invalid: isInvalid, ...rest }, ref) => (
    <textarea ref={ref} aria-invalid={isInvalid || undefined} className={cn(fieldClasses, 'min-h-20 resize-none', isInvalid && invalid, className)} {...rest} />
  ),
);
Textarea.displayName = 'Textarea';

export interface SelectOption<V extends string = string> {
  value: V;
  label: string;
}

type SelectProps<V extends string> = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value'> & {
  value: V;
  onChange: (value: V) => void;
  options: readonly SelectOption<V>[];
};

export function Select<V extends string>({ value, onChange, options, className, ...rest }: SelectProps<V>) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value as V)} className={cn(fieldClasses, 'cursor-pointer', className)} {...rest}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
