"use client";
import { Check, Lock, MapPin, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Modal } from "@/components/modal";
import { Button, Field, Input, Textarea } from "@/components/ui";
import { orders as sampleOrders } from "@/data/orders";
import { settings } from "@/data/settings";
import type { Order } from "@/data/types";
import { useCart } from "@/lib/cart";
import { readStorage, useLocalStorage, writeStorage } from "@/lib/useLocalStorage";
import { maskAddress, maskName, maskPhone, money, uid } from "@/lib/utils";

type Details = { name: string; phone: string; address: string; apartment: string; city: string };
const EMPTY: Details = { name: "", phone: "", address: "", apartment: "", city: "" };

// Delivery cost rule: free above a certain amount.
export function deliveryFee(subtotal: number) {
  const d = settings.delivery;
  return subtotal === 0 || subtotal >= d.freeOver ? 0 : d.fee;
}

// The popup after "Checkout". If the customer ordered before, we first ask "is this you?" (details are shown masked).
export function CheckoutModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const cart = useCart();
  const [saved, setSaved] = useLocalStorage<Details | null>("customer", null); // remembered on this device only
  const [step, setStep] = useState<"confirm" | "form" | "done">("form");
  const [f, setF] = useState<Details>(EMPTY);
  const [note, setNote] = useState("");
  const [orderNo, setOrderNo] = useState(0);
  const set = (k: keyof Details, v: string) => setF((s) => ({ ...s, [k]: v }));
  const total = cart.subtotal + deliveryFee(cart.subtotal);

  // Each time the popup opens: show "is this you?" if we remember the customer, otherwise the form.
  useEffect(() => {
    if (open) setStep(saved ? "confirm" : "form");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function placeOrder(d: Details) {
    // TODO: send this order to your backend.
    // For now it is saved in the browser so the staff panel (/admin/orders) can show it.
    const all = readStorage<Order[]>("orders", sampleOrders);
    const number = Math.max(1000, ...all.map((o) => o.number)) + 1;
    const order: Order = {
      id: uid(), number, type: "delivery", status: "new", customerName: d.name, phone: d.phone,
      address: [d.address, d.apartment, d.city].filter(Boolean).join(", "), note: note || undefined,
      items: cart.lines.map((l) => ({ name: l.name, price: l.price, quantity: l.qty, note: l.note })),
      deliveryFee: deliveryFee(cart.subtotal), total, createdAt: Date.now(),
    };
    writeStorage("orders", [order, ...all]);
    setSaved(d);
    setOrderNo(number);
    cart.clear();
    setStep("done");
  }

  const valid = f.name.trim().length > 1 && f.phone.trim().length > 5 && f.address.trim().length > 2;

  return (
    <Modal open={open} onClose={onClose} title={step === "confirm" ? "Welcome back!" : step === "form" ? "Delivery details" : undefined}>
      {step === "done" && (
        <div className="py-6 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#163828] text-ok"><Check size={32} /></span>
          <h2 className="font-display mt-5 text-3xl text-cream">Order placed!</h2>
          <p className="mt-2 text-muted">Order #{orderNo} is on its way to the kitchen. Estimated arrival {settings.delivery.eta} minutes.</p>
          <Button className="mt-7" onClick={onClose}>Close</Button>
        </div>
      )}

      {step === "confirm" && saved && (
        <>
          <p className="-mt-2 mb-5 text-muted">Is this you? We found these details from your last order.</p>
          <div className="space-y-4 rounded-2xl bg-raised p-5">
            {[{ icon: User, text: maskName(saved.name) }, { icon: Phone, text: maskPhone(saved.phone) }, { icon: MapPin, text: maskAddress(saved.address) }].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-4"><span className="grid h-10 w-10 place-items-center rounded-full bg-card text-mint"><Icon size={18} /></span><span className="font-semibold">{text}</span></div>
            ))}
          </div>
          <p className="mt-3 flex items-center gap-2 text-[13px] text-muted"><Lock size={14} />We only show part of your details to keep them private.</p>
          <div className="mt-6 space-y-3">
            <Button size="lg" className="w-full" onClick={() => placeOrder(saved)}>Yes, deliver to this address</Button>
            <Button size="lg" variant="outline" className="w-full" onClick={() => { setF(EMPTY); setStep("form"); }}>No, use different details</Button>
          </div>
          <p className="mt-5 text-center text-sm font-semibold text-muted">{cart.count} items - {money(total)}</p>
        </>
      )}

      {step === "form" && (
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (valid) placeOrder(f); }}>
          <p className="-mt-2 text-muted">Tell us where to bring your order.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name"><Input value={f.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" required /></Field>
            <Field label="Phone"><Input value={f.phone} onChange={(e) => set("phone", e.target.value)} type="tel" autoComplete="tel" required /></Field>
          </div>
          <Field label="Street and number"><Input value={f.address} onChange={(e) => set("address", e.target.value)} autoComplete="street-address" required /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Apartment / floor"><Input value={f.apartment} onChange={(e) => set("apartment", e.target.value)} /></Field>
            <Field label="City"><Input value={f.city} onChange={(e) => set("city", e.target.value)} autoComplete="address-level2" /></Field>
          </div>
          <Field label="Note for the courier"><Textarea value={note} onChange={(e) => setNote(e.target.value)} className="min-h-[84px]" /></Field>
          <div className="flex items-center gap-3 rounded-xl bg-raised px-4 py-3.5 text-[15px] font-semibold"><span className="grid h-[18px] w-[18px] place-items-center rounded-full border-2 border-mint"><span className="h-2 w-2 rounded-full bg-mint" /></span>Pay on delivery (cash or card)</div>
          <Button type="submit" variant="gold" size="lg" className="w-full" disabled={!valid}>{`Place order - ${money(total)}`}</Button>
        </form>
      )}
    </Modal>
  );
}
