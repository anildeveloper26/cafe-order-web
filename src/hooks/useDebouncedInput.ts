import { useEffect, useRef, useState } from 'react';
import { useDebounce } from './useDebounce';

/**
 * Local text input that commits to an external value (e.g. a URL param) after a pause,
 * and follows external changes (back/forward) without clobbering what the user is typing.
 */
export function useDebouncedInput(value: string, onCommit: (v: string) => void, delay = 350) {
  const [input, setInput] = useState(value);
  const [lastValue, setLastValue] = useState(value);

  // Sync from outside during render (React's recommended "adjust state on prop change" pattern).
  if (value !== lastValue) {
    setLastValue(value);
    if (value !== input.trim()) setInput(value);
  }

  const commitRef = useRef(onCommit);
  useEffect(() => {
    commitRef.current = onCommit;
  });

  const debounced = useDebounce(input, delay);
  useEffect(() => {
    const next = debounced.trim();
    if (next !== value) commitRef.current(next);
    // only react to the debounced text
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  return [input, setInput] as const;
}
