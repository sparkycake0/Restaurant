"use client";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Button, ButtonLink, Stepper } from "@/components/ui";
import type { Food } from "@/data/types";
import { useCart } from "@/lib/cart";
import { useToast } from "@/lib/toast";

export function ItemActions({ food, freeOver }: { food: Food; freeOver: number }) {
  const [qty, setQty] = useState(1);
  const cart = useCart();
  const toast = useToast();
  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        <Stepper value={qty} min={1} onChange={setQty} />
        <Button size="lg" disabled={!food.available} onClick={() => { cart.add(food, qty); toast(`${qty} x ${food.name} added to your order`); }}>
          <ShoppingBag size={18} />Add to order
        </Button>
        <ButtonLink href="/menu" variant="outline" size="lg">Back to menu</ButtonLink>
      </div>
      <p className="mt-4 text-sm text-muted">Free delivery on orders over {freeOver} &euro;</p>
    </div>
  );
}
