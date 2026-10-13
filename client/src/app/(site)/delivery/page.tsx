"use client";
import { useState } from "react";
import { Container, PageHeader } from "@/components/page-header";
import { Button, Card, Field, Input, Photo, Stepper, Textarea } from "@/components/ui";
import { menuItems } from "@/data/menu";
import { settings } from "@/data/settings";
import { useToast } from "@/lib/toast";
import { money } from "@/lib/utils";

export default function DeliveryPage() {
  const toast = useToast();
  // TODO(api): replace menuItems with the foods from your server (foodService.getAll)
  const foods = menuItems.filter((f) => f.available);

  // quantity per food id, e.g. { 1: 2, 5: 1 }
  const [qty, setQty] = useState<Record<number, number>>({});
  const [form, setForm] = useState({ name: "", phone: "", address: "", apartment: "", notes: "" });

  const chosen = foods.filter((f) => qty[f.id] > 0);
  const total = chosen.reduce((sum, f) => sum + f.price * qty[f.id], 0);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // TODO(api): ordersService.save({ type: "delivery", status: "new", orders: chosen..., ...form })
    toast("Order placed (sample only)");
  }

  return (
    <>
      <PageHeader title="Order delivery" sub={`Usually at your door in ${settings.delivery.eta} minutes.`} />
      <Container className="grid gap-8 py-12 sm:py-16 lg:grid-cols-[1.4fr_1fr]">
        {/* Foods */}
        <div className="space-y-3">
          {foods.map((f) => (
            <Card key={f.id} className="flex items-center gap-4 p-3">
              <div className="h-20 w-24 shrink-0 overflow-hidden rounded-xl">
                <Photo src={f.image} alt={f.name} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-lg text-cream">{f.name}</h3>
                <p className="text-sm text-muted">{money(f.price)}</p>
              </div>
              <Stepper value={qty[f.id] ?? 0} onChange={(n) => setQty({ ...qty, [f.id]: n })} />
            </Card>
          ))}
        </div>

        {/* Order form */}
        <Card className="h-fit p-6">
          <form onSubmit={submit} className="space-y-4">
            <h2 className="font-display text-2xl text-cream">Your order</h2>
            {chosen.length === 0 && <p className="text-sm text-muted">Nothing added yet.</p>}
            {chosen.map((f) => (
              <p key={f.id} className="flex justify-between text-sm">
                <span>{qty[f.id]} x {f.name}</span>
                <span>{money(f.price * qty[f.id])}</span>
              </p>
            ))}
            <p className="flex justify-between border-t border-line pt-4 font-bold"><span>Total</span><span>{money(total)}</span></p>

            <Field label="Name"><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Phone"><Input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
            <Field label="Address"><Input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></Field>
            <Field label="Apartment"><Input value={form.apartment} onChange={(e) => setForm({ ...form, apartment: e.target.value })} /></Field>
            <Field label="Notes"><Textarea className="min-h-[80px]" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></Field>
            <Button type="submit" size="lg" className="w-full" disabled={chosen.length === 0}>Place order</Button>
          </form>
        </Card>
      </Container>
    </>
  );
}
