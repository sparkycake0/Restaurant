"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Panel, Tabs } from "@/components/admin-shared";
import { FloorPlan, Legend } from "@/components/floor";
import { Button, Card, Field, Input, Select, Textarea, Toggle } from "@/components/ui";
import { reservations as sampleReservations } from "@/data/reservations";
import { reservedTableIds, tables } from "@/data/tables";
import type { Reservation } from "@/data/types";
import { useToast } from "@/lib/toast";
import { readStorage, writeStorage } from "@/lib/useLocalStorage";
import { addDays, fmtDate, isoDate, uid } from "@/lib/utils";

const TIMES = Array.from({ length: 27 }, (_, i) => `${String(11 + Math.floor(i / 2)).padStart(2, "0")}:${i % 2 ? "30" : "00"}`);
const EVENTS = ["Birthday", "Wedding", "Corporate", "Anniversary", "Family gathering", "Lunch", "Dinner", "Other"];

export default function NewReservationPage() {
  const router = useRouter();
  const toast = useToast();
  const [date, setDate] = useState(() => addDays(isoDate(), 1));
  const [time, setTime] = useState("19:00");
  const [guests, setGuests] = useState(12);
  const [eventType, setEventType] = useState("Birthday");
  const [selected, setSelected] = useState<string[]>([]);
  const [c, setC] = useState({ name: "", phone: "", email: "", notes: "" });
  const [deposit, setDeposit] = useState(false);

  // PLACEHOLDER: reservedTableIds (src/data/tables.ts) are the tables that are already booked.
  const chosen = tables.filter((t) => selected.includes(t.id));
  const seats = chosen.reduce((n, t) => n + t.seats, 0);
  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const valid = chosen.length > 0 && c.name.trim().length > 1 && c.phone.trim().length > 5;

  function create() {
    // TODO: send this reservation to your backend. For now it is saved in the browser.
    const all = readStorage<Reservation[]>("reservations", sampleReservations);
    const code = `R-${300 + all.length}`;
    writeStorage("reservations", [...all, { id: uid(), code, date, time, eventType, guests, tableIds: selected, customerName: c.name, phone: c.phone, email: c.email || undefined, notes: c.notes || undefined, status: "pending", depositPaid: deposit, seatedCount: 0 }]);
    toast(`Reservation ${code} created`);
    router.push("/admin/reservations");
  }

  return (
    <div>
      <Tabs tabs={[{ id: "dine", label: "Dine-in / pickup", href: "/admin/orders/new" }, { id: "delivery", label: "Delivery", href: "/admin/orders/new?tab=delivery" }, { id: "res", label: "Reservation (catering)" }]} active="res" />
      <div className="space-y-6">
        <Panel title="1. When and how many">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Date"><Input type="date" value={date} onChange={(e) => { setDate(e.target.value); setSelected([]); }} /></Field>
            <Field label="Time"><Select value={time} onChange={(e) => setTime(e.target.value)}>{TIMES.map((t) => <option key={t}>{t}</option>)}</Select></Field>
            <Field label="Guests"><Input type="number" min={1} value={guests} onChange={(e) => setGuests(Math.max(1, Number(e.target.value) || 1))} /></Field>
            <Field label="Event type"><Select value={eventType} onChange={(e) => setEventType(e.target.value)}>{EVENTS.map((t) => <option key={t}>{t}</option>)}</Select></Field>
          </div>
        </Panel>
        <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <Panel title="2. Choose tables" action={<Legend />}>
            <div className="overflow-x-auto"><div className="min-w-[560px]"><FloorPlan tables={tables} reservedIds={reservedTableIds} selectedIds={selected} onToggle={toggle} className="h-auto w-full" /></div></div>
            <p className="mt-3 text-center text-[13px] text-muted">Guests can be assigned to seats after the reservation is created.</p>
          </Panel>
          <Panel title="3. Customer">
            <div className="space-y-4">
              <Field label="Full name"><Input value={c.name} onChange={(e) => setC({ ...c, name: e.target.value })} /></Field>
              <Field label="Phone"><Input type="tel" value={c.phone} onChange={(e) => setC({ ...c, phone: e.target.value })} /></Field>
              <Field label="Email (optional)"><Input type="email" value={c.email} onChange={(e) => setC({ ...c, email: e.target.value })} /></Field>
              <Field label="Notes for the kitchen"><Textarea value={c.notes} onChange={(e) => setC({ ...c, notes: e.target.value })} className="min-h-[90px]" /></Field>
              <div className="flex items-center justify-between"><div><p className="font-semibold">Deposit received</p><p className="text-xs text-muted">Turn on when the customer has paid.</p></div><Toggle on={deposit} onChange={setDeposit} label="Deposit received" /></div>
            </div>
          </Panel>
        </div>
        <Card className="flex flex-col gap-6 border-transparent bg-deep p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div><h2 className="font-display text-2xl text-cream">Summary</h2>
            <dl className="mt-4 grid gap-x-10 gap-y-2 text-[14.5px] sm:grid-cols-2">
              {[["When", `${fmtDate(date)}, ${time}`], ["Guests", String(guests)], ["Tables", chosen.map((t) => t.label).join(", ") + (chosen.length ? `  (${seats} seats)` : "-")], ["Customer", c.name || "-"]].map(([l, v]) => <div key={l} className="flex gap-3"><dt className="text-cream/70">{l}</dt><dd className="font-semibold text-cream">{v}</dd></div>)}
            </dl></div>
          <Button variant="gold" size="lg" disabled={!valid} onClick={create}>Create reservation</Button>
        </Card>
      </div>
    </div>
  );
}
