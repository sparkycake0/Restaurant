"use client";
import { useLocalStorage } from "@/lib/useLocalStorage";

// PLACEHOLDER LOGIN: the login page saves whatever was typed here.
// Replace this with your real authentication later.
export type User = { username: string; password: string };

export function useUser() {
  return useLocalStorage<User | null>("user", null);
}
