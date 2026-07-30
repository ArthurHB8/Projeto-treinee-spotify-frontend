import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(setDebouncedValue, delay, value);

    return () => {
      clearTimeout(timer);
    };
  }, [delay, value]);

  return debouncedValue;
}
