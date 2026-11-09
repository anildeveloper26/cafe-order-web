import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

type Schema = Record<string, string>;
type Validators<T extends Schema> = Partial<{ [K in keyof T]: (value: string) => boolean }>;

/**
 * Keeps view state (filters, sort, search…) in the URL query string so it survives
 * refresh, back/forward and shared links. Values equal to the default are omitted.
 */
export function useUrlState<T extends Schema>(defaults: T, validators: Validators<T> = {}) {
  const [params, setParams] = useSearchParams();

  const state = useMemo(() => {
    const out = { ...defaults };
    for (const key of Object.keys(defaults) as (keyof T)[]) {
      const raw = params.get(key as string);
      if (raw !== null && (validators[key]?.(raw) ?? true)) out[key] = raw as T[keyof T];
    }
    return out;
    // validators are static per call site
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, defaults]);

  const setState = useCallback(
    (patch: Partial<T>, options: { replace?: boolean } = { replace: true }) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [key, value] of Object.entries(patch)) {
            if (value === undefined || value === '' || value === defaults[key]) next.delete(key);
            else next.set(key, value);
          }
          return next;
        },
        { replace: options.replace },
      );
    },
    [setParams, defaults],
  );

  const reset = useCallback(
    (keep: (keyof T)[] = []) =>
      setParams(
        (prev) => {
          const next = new URLSearchParams();
          for (const k of keep) {
            const v = prev.get(k as string);
            if (v !== null) next.set(k as string, v);
          }
          return next;
        },
        { replace: true },
      ),
    [setParams],
  );

  return [state, setState, reset] as const;
}
