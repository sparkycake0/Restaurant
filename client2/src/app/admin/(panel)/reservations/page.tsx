"use client";
import { CalendarDays, ChevronLeft, ChevronRight, Mail, Phone, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ResStatusPill } from "@/components/admin-shared";
import { Button, ButtonLink, Card, Pill, Toggle } from "@/components/ui";
import { reservations as sampleReservations } from "@/data/reservations";
import type { Reservation, ReservationStatus } from "@/data/types";
import { useToast } from "@/lib/toast";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { addDays, cn, fmtDate, fmtDay, fmtDayNum, isoDate } from "@/lib/utils";

const tl = (id: string) => id.replace(/^t/, "T"); // "t4" -> "T4"

function Detail({ r, onStatus, onDeposit }: { r: Reservation; onStatus: (s: ReservationStatus) => void; onDeposit: (v: boolean) => void }) {
  const seated = r.seatedCount;
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-3"><div><h2 className="font-display text-2xl text-cream">{r.customerName}</h2><p className="mt-1 text-[13px] text-muted">Reservation {r.code} - {r.eventType}</p></div><ResStatusPill status={r.status} /></div>
      <ul className="mt-5 space-y-3 border-t border-line pt-5 text-sm">
        <li className="flex items-center gap-3"><CalendarDays size={17} className="text-gold-text" />{fmtDate(r.date)} - {r.time}</li>
        <li className="flex items-center gap-3"><Users size={17} className="text-gold-text" />{r.guests} guests</li>
        <li className="flex items-center gap-3"><Phone size={17} className="text-gold-text" /><a href={`tel:${r.phone}`}>{r.phone}</a></li>
        {r.email && <li className="flex items-center gap-3"><Mail size={17} className="text-gold-text" />{r.email}</li>}
      </ul>
      <div className="mt-5"><p className="mb-2 text-[11.5px] font-bold uppercase tracking-wider text-muted">Tables</p><div className="flex flex-wrap gap-2">{r.tableIds.map((id) => <Pill key={id} kind="gold" className="px-3 py-2">{tl(id)}</Pill>)}</div></div>
      <div className="mt-5">
        <div className="mb-2 flex justify-between text-[11.5px] font-bold uppercase tracking-wider text-muted"><span>Seating</span><span className="text-gold-text normal-case tracking-normal">{seated} of {r.guests} seated</span></div>
        <div className="h-2.5 overflow-hidden rounded-full bg-[#2a3a33]"><div className="h-full rounded-full bg-gold" style={{ width: `${Math.min(100, (seated / r.guests) * 100)}%` }} /></div>
      </div>
      {r.notes && <div className="mt-5"><p className="mb-1.5 text-[11.5px] font-bold uppercase tracking-wider text-muted">Notes</p><p className="text-sm leading-relaxed">{r.notes}</p></div>}
      <div className="mt-5 flex items-center justify-between rounded-xl bg-raised px-4 py-3.5"><span className="text-sm font-semibold">Deposit paid</span><Toggle on={r.depositPaid} onChange={onDeposit} label="Deposit paid" /></div>
      <div className="mt-6 space-y-3">
        {r.status === "pending" && <Button variant="gold" size="lg" className="w-full" onClick={() => onStatus("confirmed")}>Confirm reservation</Button>}
        {r.status === "confirmed" && <Button variant="gold" size="lg" className="w-full" onClick={() => onStatus("seated")}>Mark as seated</Button>}
        <div className="grid grid-cols-2 gap-3"><Button variant="light" onClick={() => location.assign(`tel:${r.phone}`)}><Phone size={15} />Call customer</Button>
          {r.status !== "cancelled" && r.status !== "seated" ? <Button variant="danger" onClick={() => confirm("Cancel this reservation?") && onStatus("cancelled")}>Cancel</Button> : <span />}</div>
      </div>
    </Card>
  );
}

export default function ReservationsPage() {
  const toast = useToast();
  const [data, setData] = useLocalStorage<Reservation[]>("reservations", sampleReservations);
  const [weekStart, setWeekStart] = useState(() => isoDate());
  const [day, setDay] = useState(() => isoDate());
  const [sel, setSel] = useState<string | null>(null);
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const list = useMemo(() => data.filter((r) => r.date === day).sort((a, b) => a.time.localeCompare(b.time)), [data, day]);
  useEffect(() => { if (!sel || !list.some((r) => r.id === sel)) setSel(list[0]?.id ?? null); }, [list, sel]);

  // TODO: call your backend for these two changes.
  const change = (id: string, patch: Partial<Reservation>) => setData((all) => all.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const setStatus = (id: string, status: ReservationStatus) => { change(id, { status }); toast("Reservation updated"); };
  const selected = list.find((r) => r.id === sel);

  return (
    <div>
      <div className="mb-6 flex items-center gap-2">
        <button aria-label="Previous week" onClick={() => setWeekStart(addDays(weekStart, -7))} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border hover:border-gold/60"><ChevronLeft size={18} /></button>
        <div className="no-scrollbar grid flex-1 auto-cols-[minmax(84px,1fr)] grid-flow-col gap-2 overflow-x-auto">
          {days.map((d) => {
            const n = data.filter((r) => r.date === d && r.status !== "cancelled").length, a = d === day;
            return (
              <button key={d} onClick={() => setDay(d)} className={cn("rounded-2xl border p-3 text-left transition-colors", a ? "border-primary bg-primary text-cream" : "border-line bg-card hover:border-gold/50")}>
                <span className={cn("block text-xs font-semibold", a ? "text-cream" : "text-muted")}>{fmtDay(d)}</span><span className="font-display block text-2xl">{fmtDayNum(d)}</span>
                <span className={cn("mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-bold", a ? "bg-ink text-cream" : "bg-gold-soft text-gold-text")}>{n} res</span>
              </button>
            );
          })}
        </div>
        <button aria-label="Next week" onClick={() => setWeekStart(addDays(weekStart, 7))} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border hover:border-gold/60"><ChevronRight size={18} /></button>
      </div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 className="font-display text-2xl text-cream">{fmtDate(day)}</h2><ButtonLink href="/admin/reservations/new" variant="gold" size="sm">+ New reservation</ButtonLink></div>
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-3">
          {list.length === 0 && <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted">No reservations on this day. <Link href="/admin/reservations/new" className="font-semibold text-gold-text">Create one</Link></div>}
          {list.map((r) => (
            <button key={r.id} onClick={() => setSel(r.id)} className={cn("flex w-full items-center gap-5 rounded-2xl border p-5 text-left transition-colors", r.id === sel ? "border-gold bg-gold-soft/60" : "border-line bg-card hover:border-border")}>
              <span className="font-display w-16 shrink-0 text-2xl text-cream">{r.time}</span>
              <div className="min-w-0 flex-1"><p className="truncate text-[17px] font-bold">{r.customerName}</p><p className="text-[13.5px] text-muted">{r.guests} guests - {r.eventType}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">{r.tableIds.map((id) => <Pill key={id} kind="gold" className="px-2.5 py-1 text-[11.5px]">{tl(id)}</Pill>)}</div></div>
              <ResStatusPill status={r.status} />
            </button>
          ))}
        </div>
        {selected && <Detail r={selected} onStatus={(s) => setStatus(selected.id, s)} onDeposit={(v) => change(selected.id, { depositPaid: v })} />}
      </div>
    </div>
  );
}
