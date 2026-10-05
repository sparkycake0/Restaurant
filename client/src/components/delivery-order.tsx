"use client";
import { Plus, Search, ShoppingBag, StickyNote } from "lucide-react";
import { useState } from "react";
import { CheckoutModal, deliveryFee } from "@/components/checkout-modal";
import { Modal } from "@/components/modal";
import { Button, Card, Chip, Empty, Input, Photo, Stepper } from "@/components/ui";
import { categories, menuItems } from "@/data/menu";
import { settings } from "@/data/settings";
import type { Food } from "@/data/types";
import { useCart } from "@/lib/cart";
import { money } from "@/lib/utils";

const delivery = settings.delivery;

// One dish in the list: shows "Add" or a quantity stepper.
function DishRow({ food }: { food: Food }) {
  const cart = useCart();
  const qty = cart.lines.find((l) => l.id === food.id)?.qty ?? 0;
  return (
    <Card className="flex gap-4 p-3.5">
      <div className="h-[108px] w-[108px] shrink-0 overflow-hidden rounded-xl sm:h-[130px] sm:w-[130px]"><Photo src={food.image} alt={food.name} /></div>
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="font-display truncate text-lg text-cream sm:text-xl">{food.name}</h3>
        <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-muted">{food.description}</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="text-[17px] font-bold">{money(food.price)}</span>
          {!food.available ? <span className="text-sm font-semibold text-danger">Sold out</span>
            : qty > 0 ? <Stepper value={qty} onChange={(q) => cart.setQty(food.id, q)} />
            : <Button size="sm" variant="subtle" onClick={() => cart.add(food)}><Plus size={15} />Add</Button>}
        </div>
      </div>
    </Card>
  );
}

// The "Your order" box: lines, totals and the Checkout button.
function CartBox({ onCheckout }: { onCheckout: () => void }) {
  const cart = useCart();
  const [noteOpen, setNoteOpen] = useState<string | null>(null);
  const fee = deliveryFee(cart.subtotal);
  const belowMin = cart.subtotal > 0 && cart.subtotal < delivery.minOrder;

  return (
    <div>
      {cart.lines.length === 0 ? (
        <p className="py-10 text-center text-muted">Your order is empty. Add something tasty!</p>
      ) : (
        <ul className="divide-y divide-line">
          {cart.lines.map((l) => (
            <li key={l.id} className="py-4">
              <div className="flex items-start justify-between gap-3"><span className="font-bold">{l.name}</span><span className="font-semibold">{money(l.price * l.qty)}</span></div>
              <div className="mt-2.5 flex items-center justify-between">
                <Stepper size="sm" value={l.qty} onChange={(q) => cart.setQty(l.id, q)} />
                <button type="button" onClick={() => setNoteOpen(noteOpen === l.id ? null : l.id)} className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-mint hover:text-cream">
                  <StickyNote size={14} />{l.note ? "Edit note" : "Add a note for the chef"}
                </button>
              </div>
              {noteOpen === l.id
                ? <Input autoFocus value={l.note ?? ""} onChange={(e) => cart.setNote(l.id, e.target.value)} onBlur={() => setNoteOpen(null)} placeholder="e.g. no onions" className="mt-3 h-10 text-sm" />
                : l.note && <p className="mt-2 text-[12.5px] text-muted">Note: {l.note}</p>}
            </li>
          ))}
        </ul>
      )}
      <dl className="mt-2 space-y-2 border-t border-line pt-4 text-[14.5px]">
        <div className="flex justify-between text-muted"><dt>Subtotal</dt><dd>{money(cart.subtotal)}</dd></div>
        <div className="flex justify-between text-muted"><dt>Delivery</dt><dd>{fee === 0 ? "Free" : money(fee)}</dd></div>
        <div className="flex justify-between pt-1 text-lg font-bold"><dt>Total</dt><dd className="text-cream">{money(cart.subtotal + fee)}</dd></div>
      </dl>
      {belowMin && <p className="mt-3 text-[13px] text-danger">Minimum order is {money(delivery.minOrder)}.</p>}
      <Button size="lg" className="mt-5 w-full" disabled={cart.lines.length === 0 || belowMin} onClick={onCheckout}>Checkout</Button>
      <p className="mt-3 text-center text-[12.5px] text-muted">Estimated arrival: {delivery.eta} minutes</p>
    </div>
  );
}

// The delivery page: dish list on the left, cart on the right (on phones the cart opens from a bottom bar).
export function DeliveryOrder() {
  const cart = useCart();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [checkout, setCheckout] = useState(false);
  const [sheet, setSheet] = useState(false); // phone cart
  const list = menuItems.filter((f) => (cat === "all" || f.category === cat) && (!q || f.name.toLowerCase().includes(q.toLowerCase())));

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        <div className="relative">
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the menu..." className="h-[52px] pl-11" aria-label="Search the menu" />
        </div>
        <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          <Chip active={cat === "all"} onClick={() => setCat("all")}>All</Chip>
          {categories.map((c) => <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>)}
        </div>
        <div className="mt-6 grid gap-4 pb-24 md:grid-cols-2 lg:pb-0">
          {list.length === 0 ? <div className="md:col-span-2"><Empty>No dishes match your search.</Empty></div> : list.map((f) => <DishRow key={f.id} food={f} />)}
        </div>
      </div>

      <aside className="hidden lg:block">
        <Card className="sticky top-[108px] p-7">
          <h2 className="font-display text-2xl text-cream">Your order</h2>
          <div className="mt-3"><CartBox onCheckout={() => setCheckout(true)} /></div>
        </Card>
      </aside>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-card/95 p-3 backdrop-blur lg:hidden">
        <Button size="lg" className="w-full justify-between" onClick={() => setSheet(true)}>
          <span className="flex items-center gap-2"><ShoppingBag size={18} />View order{cart.count > 0 && ` (${cart.count})`}</span>
          <span>{money(cart.subtotal + deliveryFee(cart.subtotal))}</span>
        </Button>
      </div>
      <Modal open={sheet} onClose={() => setSheet(false)} title="Your order"><CartBox onCheckout={() => { setSheet(false); setCheckout(true); }} /></Modal>
      <CheckoutModal open={checkout} onClose={() => setCheckout(false)} />
    </div>
  );
}
