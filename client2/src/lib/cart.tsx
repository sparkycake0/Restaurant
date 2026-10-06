"use client";
import { createContext, useContext, type ReactNode } from "react";
import { useLocalStorage } from "@/lib/useLocalStorage";

export type CartLine = { id: string; name: string; price: number; qty: number; note?: string };

type CartValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (food: { id: string; name: string; price: number }, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  setNote: (id: string, note: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartValue | null>(null);

// The delivery cart. Kept in localStorage so it survives a refresh.
export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useLocalStorage<CartLine[]>("cart", []);

  const value: CartValue = {
    lines,
    count: lines.reduce((n, l) => n + l.qty, 0),
    subtotal: lines.reduce((n, l) => n + l.qty * l.price, 0),
    add: (food, qty = 1) =>
      setLines((ls) =>
        ls.some((l) => l.id === food.id)
          ? ls.map((l) => (l.id === food.id ? { ...l, qty: l.qty + qty } : l))
          : [...ls, { id: food.id, name: food.name, price: food.price, qty }],
      ),
    setQty: (id, qty) => setLines((ls) => (qty <= 0 ? ls.filter((l) => l.id !== id) : ls.map((l) => (l.id === id ? { ...l, qty } : l)))),
    setNote: (id, note) => setLines((ls) => ls.map((l) => (l.id === id ? { ...l, note } : l))),
    clear: () => setLines([]),
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
