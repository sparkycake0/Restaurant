"use client";
import { useEffect, useState } from "react";

/**
 * Works like useState, but the value is also saved in the browser (localStorage) under `key`,
 * so it is still there after a page refresh or when you open another page.
 * `loaded` becomes true after the saved value has been read.
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) setValue(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value, loaded]);

  return [value, setValue, loaded] as const;
}

/** Read a saved value without React (used to add a new order from the public delivery page). */
export function readStorage<T>(key: string, initial: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : initial;
  } catch {
    return initial;
  }
}
export function writeStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}
