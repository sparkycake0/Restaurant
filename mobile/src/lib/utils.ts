import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Joins class names; later Tailwind classes win (needed because NativeWind ignores class order).
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const money = (n: number) => `${n.toFixed(2)} €`;
