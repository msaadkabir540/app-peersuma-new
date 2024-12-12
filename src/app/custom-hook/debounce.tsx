"use client";
import { useState, useEffect } from "react";

export const useDebounce = ({
  value,
  milliSeconds,
}: {
  value: string | undefined;
  milliSeconds: number;
}) => {
  const [debouncedValue, setDebouncedValue] = useState<string | undefined>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, milliSeconds);

    return () => {
      clearTimeout(handler);
    };
  }, [value, milliSeconds]);

  return debouncedValue;
};
