"use client";
import { Check, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { FloorPlan, Legend, TableShape, tableWidth } from "@/components/floor";
import { Button, Card, Chip, Field, Input, Pill, Select, Textarea } from "@/components/ui";
import { settings } from "@/data/settings";
import { reservations as sampleReservations } from "@/data/reservations";
import { reservedTableIds as reserved, tables } from "@/data/tables";
import type { DiningTable, Reservation } from "@/data/types";
import { useToast } from "@/lib/toast";
import { readStorage, writeStorage } from "@/lib/useLocalStorage";
import { addDays, cn, fmtDate, initials, isoDate, uid } from "@/lib/utils";

const TIMES = Array.from({ length: 27 }, (_, i) => `${String(11 + Math.floor(i / 2)).padStart(2, "0")}:${i % 2 ? "30" : "00"}`);
const EVENTS = ["Birthday", "Wedding", "Corporate", "Anniversary", "Family gathering", "Other"];

function Steps({ step }: { step: number }) {

  const items = ["Event details", "Choose tables", "Assign guests", "Confirm"];
  return (
    <ol className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-3">
      {items.map((t, i) => {
        const n = i + 1, done = n < step, act = n === step;
        return (
          <li key={t} className="flex items-center gap-3">
            <span className={cn("grid h-[34px] w-[34px] place-items-center rounded-full text-sm font-bold", done ? "bg-ok text-white" : act ? "bg-gold text-ink" : "border border-border text-muted")}>{done ? <Check size={16} strokeWidth={3} /> : n}</span>
            <span className={cn("text-[15px]", act ? "font-bold" : done ? "font-semibold" : "text-muted")}>{t}</span>
            {i < items.length - 1 && <span className="mx-1 hidden h-px w-8 bg-border sm:block lg:w-16" />}
          </li>
        );
      })}
    </ol>
  );
}

// The whole "Plan your event" page: pick tables, seat guests, send the reservation.
export function CateringPlanner() {
  const c = settings.catering;
  const toast = useToast();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("19:00");
  const [guests, setGuests] = useState(Math.max(12, c.minGuests));
  const [eventType, setEventType] = useState("Birthday");
  const [selected, setSelected] = useState<string[]>([]);
  const [names, setNames] = useState<string[]>([]);
  const [assign, setAssign] = useState<Record<string, (string | null)[]>>({});
  const [active, setActive] = useState<string | null>(null);
  const [holding, setHolding] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [contact, setContact] = useState({ name: "", phone: "", email: "", notes: "" });
  const [status, setStatus] = useState<"idle" | "busy" | "error" | "done">("idle");
  const [message, setMessage] = useState("");
  const minDate = useMemo(() => (date ? addDays(isoDate(), c.noticeDays) : ""), [date, c.noticeDays]);

  useEffect(() => setDate(addDays(isoDate(), c.noticeDays + 4)), [c.noticeDays]);

  // PLACEHOLDER: the tables and the already-booked tables come from src/data/tables.ts.
  // TODO: ask your backend which tables are free for `date` and `time`.
  const byId = new Map(tables.map((t) => [t.id, t]));
  useEffect(() => { if (!active || !selected.includes(active)) setActive(selected[0] ?? null); }, [selected, active]);

  const selTables = selected.map((id) => byId.get(id)).filter(Boolean) as DiningTable[];
  const seatsTotal = selTables.reduce((n, t) => n + t.seats, 0);
  const seatedNames = new Set(Object.entries(assign).filter(([id]) => selected.includes(id)).flatMap(([, v]) => v).filter(Boolean) as string[]);
  const unassigned = names.filter((n) => !seatedNames.has(n));
  const enough = seatsTotal >= guests;
  const step = selected.length === 0 ? 2 : names.length > 0 && seatedNames.size > 0 ? 4 : 3;

  const toggle = (id: string) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
    setAssign((a) => { const { [id]: _drop, ...rest } = a; return selected.includes(id) ? rest : a; });
  };
  const seatsOf = (t: DiningTable) => assign[t.id] ?? Array<string | null>(t.seats).fill(null);
  const clickSeat = (t: DiningTable, i: number) => {
    const cur = seatsOf(t);
    const next = [...cur];
    if (cur[i]) next[i] = null;
    else if (holding) { next[i] = holding; setHolding(null); }
    else return;
    setAssign((a) => ({ ...a, [t.id]: next }));
  };
  const addName = () => {
    const n = newName.trim();
    if (!n || names.includes(n)) return;
    setNames((l) => [...l, n]); setNewName("");
  };
  const removeName = (n: string) => {
    setNames((l) => l.filter((x) => x !== n));
    setAssign((a) => Object.fromEntries(Object.entries(a).map(([k, v]) => [k, v.map((x) => (x === n ? null : x))])));
    if (holding === n) setHolding(null);
  };
  const autoSeat = () => {
    const queue = [...unassigned];
    const next = { ...assign };
    selTables.forEach((t) => { next[t.id] = seatsOf(t).map((s) => s ?? queue.shift() ?? null); });
    setAssign(next);
  };
  const addAnonymousGuests = () => {
    const have = new Set(names);
    const extra: string[] = [];
    for (let i = 1; names.length + extra.length < guests; i++) if (!have.has(`Guest ${i}`)) extra.push(`Guest ${i}`);
    setNames((l) => [...l, ...extra]);
  };

  const valid = Boolean(date) && selected.length > 0 && contact.name.trim().length > 1 && contact.phone.trim().length > 5;

  function submit() {
    // TODO: send this reservation to your backend.
    // For now it is saved in the browser so the staff panel (/admin/reservations) can show it.
    const all = readStorage<Reservation[]>("reservations", sampleReservations);
    const code = `R-${300 + all.length}`;
    writeStorage("reservations", [
      ...all,
      { id: uid(), code, date, time, eventType, guests, tableIds: selected, customerName: contact.name, phone: contact.phone, email: contact.email || undefined, notes: contact.notes || undefined, status: "pending", depositPaid: false, seatedCount: seatedNames.size },
    ]);
    setMessage(code);
    setStatus("done");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (status === "done") {
    return (
      <div className="mx-auto max-w-xl py-10 text-center">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#163828] text-ok"><Check size={40} /></span>
        <h2 className="font-display mt-6 text-4xl text-cream">Request received!</h2>
        <p className="mt-3 text-lg text-muted">Reservation <b className="text-cream">{message}</b> for {fmtDate(date)} at {time}. We will call you within 24 hours to confirm.</p>
        <Button className="mt-8" onClick={() => location.reload()}>Plan another event</Button>
      </div>
    );
  }

  const activeTable = active ? byId.get(active) : undefined;
  const big: DiningTable | undefined = activeTable && { ...activeTable, x: 210, y: 170, w: activeTable.shape === "rect" ? Math.min(330, tableWidth(activeTable) * 1.7) : activeTable.w };
  const bigSr = activeTable?.shape === "rect" ? 18 : activeTable && activeTable.seats > 8 ? 18 : 26;

  return (
    <div>
      <Steps step={step} />

      {/* 1. Details */}
      <Card className="mt-8 p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_0.8fr_1.2fr_auto] lg:items-end">
          <Field label="Event date"><Input type="date" value={date} min={minDate} onChange={(e) => setDate(e.target.value)} /></Field>
          <Field label="Start time"><Select value={time} onChange={(e) => setTime(e.target.value)}>{TIMES.map((t) => <option key={t}>{t}</option>)}</Select></Field>
          <Field label="Guests"><Input type="number" min={1} max={500} value={guests} onChange={(e) => setGuests(Math.max(1, Number(e.target.value) || 1))} /></Field>
          <Field label="Event type"><Select value={eventType} onChange={(e) => setEventType(e.target.value)}>{EVENTS.map((t) => <option key={t}>{t}</option>)}</Select></Field>
          <Button variant="primary" onClick={() => toast("Showing the tables that are free for this date")} disabled={!date} className="sm:col-span-2 lg:col-span-1">Check availability</Button>
        </div>
        {guests < c.minGuests && <p className="mt-4 text-sm text-gold-text">Catering is designed for {c.minGuests}+ guests. For smaller parties you can still reserve tables below.</p>}
      </Card>

      {/* 2. Floor plan */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <Card className="p-5 sm:p-7">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="font-display text-2xl text-cream">Choose your tables</h2><Legend /></div>
          <div className="overflow-x-auto rounded-2xl"><div className="min-w-[620px]">
            <FloorPlan tables={tables} reservedIds={reserved} selectedIds={selected} onToggle={toggle} className="h-auto w-full" />
          </div></div>
          <p className="mt-3 text-xs text-muted sm:hidden">Swipe sideways to see the whole room. Tap a table to select it.</p>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="font-display text-2xl text-cream">Your selection</h2>
            {selTables.length === 0 ? <p className="mt-4 text-sm text-muted">Tap a free table on the plan to add it.</p> : (
              <ul className="mt-4 space-y-2.5">
                {selTables.map((t) => (
                  <li key={t.id} className="flex items-center justify-between rounded-xl bg-raised px-4 py-3">
                    <div><p className="font-bold">Table {t.label.replace(/^T/, "")}</p><p className="text-[12.5px] text-muted">{t.seats} seats - {t.shape === "round" ? "round" : "rectangular"}</p></div>
                    <button onClick={() => toggle(t.id)} aria-label={`Remove ${t.label}`} className="text-muted hover:text-fg"><X size={18} /></button>
                  </li>
                ))}
              </ul>
            )}
            <dl className="mt-5 space-y-2 border-t border-line pt-4 text-[15px]">
              {[["Tables", selTables.length], ["Total seats", seatsTotal], ["Your guests", guests]].map(([l, v]) => <div key={l as string} className="flex justify-between"><dt className="text-muted">{l}</dt><dd className="font-bold">{v}</dd></div>)}
            </dl>
            {selTables.length > 0 && (enough
              ? <p className="mt-4 flex items-center gap-2 rounded-[10px] bg-[#163828] px-3.5 py-3 text-sm font-semibold text-[#7fd0a0]"><Check size={16} />Enough seats for your group</p>
              : <p className="mt-4 rounded-[10px] bg-gold-soft px-3.5 py-3 text-sm font-semibold text-gold-text">You need {guests - seatsTotal} more seats for {guests} guests.</p>)}
            <Button className="mt-4 w-full" disabled={selTables.length === 0} onClick={() => document.getElementById("seating")?.scrollIntoView({ behavior: "smooth" })}>Continue to seating</Button>
          </Card>
          <Card className="border-transparent bg-deep p-6">
            <p className="font-display text-xl text-cream">Prefer to talk?</p>
            <p className="mt-1 text-sm text-cream/75">Call us and we will plan it together.</p>
            <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="mt-3 block text-[17px] font-bold text-gold">{settings.phone}</a>
          </Card>
        </div>
      </div>

      {/* 3. Seating */}
      <section id="seating" className="mt-14 scroll-mt-28">
        <h2 className="font-display text-3xl text-cream sm:text-4xl">Assign guests to seats</h2>
        <p className="mt-2 text-muted">Pick a guest, then tap a seat. Tap a taken seat to free it. This step is optional - you can also do it later.</p>
        {selTables.length === 0 ? (
          <Card className="mt-6 p-10 text-center text-muted">Select at least one table above to start seating your guests.</Card>
        ) : (
          <Card className="mt-6 grid gap-8 p-5 sm:p-8 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <div className="mb-3 flex flex-wrap gap-2">{selTables.map((t) => <Chip key={t.id} active={t.id === active} onClick={() => setActive(t.id)}>Table {t.label.replace(/^T/, "")}</Chip>)}</div>
              {big && activeTable && (
                <>
                  <svg viewBox="0 0 420 340" className="mx-auto h-auto w-full max-w-[460px]" role="group" aria-label={`Seating for table ${activeTable.label}`}>
                    <TableShape table={big} state="sel" radius={74} sr={bigSr} gap={activeTable.shape === "rect" ? 12 : 16}
                      guests={seatsOf(activeTable).map((g) => (g ? initials(g) : null))} label={`Table ${activeTable.label.replace(/^T/, "")}`}
                      onSeatClick={(i) => clickSeat(activeTable, i)} />
                  </svg>
                  <p className="text-center text-sm text-muted">Gold seats are taken. Dashed seats are still free.</p>
                </>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between"><h3 className="font-display text-xl text-cream">Guests ({names.length}/{guests})</h3>
                <div className="flex gap-2"><Button size="sm" variant="subtle" onClick={addAnonymousGuests}>Fill with placeholders</Button><Button size="sm" variant="ghost" onClick={autoSeat} disabled={unassigned.length === 0}>Auto-seat</Button></div></div>
              <form className="mt-4 flex gap-2" onSubmit={(e) => { e.preventDefault(); addName(); }}>
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Add a guest name..." aria-label="Guest name" maxLength={60} />
                <Button type="submit" variant="subtle" className="shrink-0">Add guest</Button>
              </form>
              <p className="mb-2 mt-6 text-[12px] font-bold uppercase tracking-wider text-muted">Seated ({seatedNames.size})</p>
              <ul className="space-y-2">
                {[...seatedNames].map((n) => {
                  const where = selTables.flatMap((t) => seatsOf(t).map((g, i) => (g === n ? `${t.label} - seat ${i + 1}` : null))).find(Boolean);
                  return (
                    <li key={n} className="flex items-center gap-3 rounded-xl bg-raised px-3.5 py-2.5">
                      <span className="grid h-[30px] w-[30px] place-items-center rounded-full bg-gold text-[11px] font-bold text-ink">{initials(n)}</span>
                      <span className="flex-1 truncate font-semibold">{n}</span><Pill kind="gold">{where}</Pill>
                      <button onClick={() => removeName(n)} aria-label={`Remove ${n}`} className="text-muted hover:text-fg"><X size={16} /></button>
                    </li>
                  );
                })}
                {seatedNames.size === 0 && <li className="text-sm text-muted">Nobody seated yet.</li>}
              </ul>
              <p className="mb-2 mt-6 text-[12px] font-bold uppercase tracking-wider text-muted">Unassigned ({unassigned.length})</p>
              <div className="flex flex-wrap gap-2">
                {unassigned.map((n) => (
                  <span key={n} className="inline-flex items-center">
                    <Chip active={holding === n} onClick={() => setHolding(holding === n ? null : n)} className="h-9 rounded-r-none border-r-0 text-[13.5px]">{n}</Chip>
                    <button onClick={() => removeName(n)} aria-label={`Remove ${n}`} className="grid h-9 w-8 place-items-center rounded-r-full border border-l-0 border-border bg-card text-muted hover:text-fg"><X size={13} /></button>
                  </span>
                ))}
                {unassigned.length === 0 && <span className="text-sm text-muted">{names.length ? "Everyone has a seat." : "Add guests above."}</span>}
              </div>
              {holding && <p className="mt-4 text-sm text-gold-text">Now tap a free seat for {holding}.</p>}
            </div>
          </Card>
        )}
      </section>

      {/* 4. Details */}
      <section className="mt-14">
        <h2 className="font-display text-3xl text-cream sm:text-4xl">Your details</h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.9fr_1fr]">
          <Card className="grid gap-4 p-5 sm:grid-cols-2 sm:p-8">
            <Field label="Full name"><Input value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} autoComplete="name" /></Field>
            <Field label="Phone"><Input type="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} autoComplete="tel" /></Field>
            <Field label="Email (optional)"><Input type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} autoComplete="email" /></Field>
            <Field label="Event type"><Select value={eventType} onChange={(e) => setEventType(e.target.value)}>{EVENTS.map((t) => <option key={t}>{t}</option>)}</Select></Field>
            <Field label="Notes for the kitchen" className="sm:col-span-2"><Textarea value={contact.notes} onChange={(e) => setContact({ ...contact, notes: e.target.value })} placeholder="Allergies, timing of the cake, decorations..." className="min-h-[140px]" maxLength={500} /></Field>
          </Card>
          <Card className="border-transparent bg-deep p-6 sm:p-8">
            <h3 className="font-display text-[22px] text-cream">Reservation summary</h3>
            <dl className="mt-5 space-y-3 text-[14.5px]">
              {[["Date", date ? fmtDate(date) : "-"], ["Time", time], ["Guests", String(guests)], ["Tables", selTables.map((t) => t.label).join(", ") || "-"], ["Seats", String(seatsTotal)]].map(([l, v]) => (
                <div key={l} className="flex justify-between gap-4"><dt className="text-cream/70">{l}</dt><dd className="text-right font-semibold text-cream">{v}</dd></div>
              ))}
            </dl>
            {c.requireDeposit && <p className="mt-4 rounded-lg bg-black/20 p-3 text-[13px] text-cream/80">A {c.depositPercent}% deposit is required to confirm your booking. We will explain how when we call.</p>}
            {status === "error" && <p className="mt-4 text-sm text-danger">{message}</p>}
            <Button variant="gold" size="lg" className="mt-6 w-full" disabled={!valid || status === "busy"} onClick={submit}>{status === "busy" ? "Sending..." : "Confirm reservation"}</Button>
            {!valid && <p className="mt-3 text-center text-[12.5px] text-cream/60">Choose a date, at least one table, and add your name and phone.</p>}
            <p className="mt-3 text-center text-[12.5px] text-cream/60">We call you within 24 hours to confirm.</p>
          </Card>
        </div>
      </section>
    </div>
  );
}
