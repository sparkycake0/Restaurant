"use client";
import { Plus } from "lucide-react";
import type { Food } from "@/data/types";
import { useCart } from "@/lib/cart";
import { useToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

// The round "+" button: adds the dish to the delivery cart.
export function AddButton({ food, className }: { food: Food; className?: string }) {
  const cart = useCart();
  const toast = useToast();
  return (
    <button type="button" disabled={!food.available} aria-label={`Add ${food.name} to order`}
      onClick={() => { cart.add(food); toast(`${food.name} added to your order`); }}
      className={cn("grid h-10 w-10 place-items-center rounded-full bg-primary text-cream transition-colors hover:bg-primary/80 disabled:bg-[#2f3b35] disabled:text-muted", className)}>
      <Plus size={18} strokeWidth={2.4} />
    </button>
  );
}
