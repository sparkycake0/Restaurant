"use client";
import { CalendarDays, Clock, ShoppingBag, Truck, Utensils } from "lucide-react";
import Link from "next/link";
import { Panel, ResStatusPill, TypePill } from "@/components/admin-shared";
import { Button, ButtonLink, Card, Pill, Toggle } from "@/components/ui";
import { menuItems } from "@/data/menu";
import { orders as sampleOrders } from "@/data/orders";
import { reservations as sampleReservations } from "@/data/reservations";
import type { Order, OrderStatus, Reservation, Food } from "@/data/types";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { fmtDate, isoDate, money, nextStatus, timeAgo } from "@/lib/utils";

const COLUMNS: { status: OrderStatus; title: string }[] = [
  { status: "new", title: "New" }, { status: "preparing", title: "Preparing" }, { status: "ready", title: "Ready" }, { status: "delivering", title: "On the way" },
];

export default function DashboardPage() {
  // Data comes from src/data/*.ts and is kept in localStorage so changes survive a refresh.
  const [orders, setOrders] = useLocalStorage<Order[]>("orders", sampleOrders);
  const [reservations] = useLocalStorage<Reservation[]>("reservations", sampleReservations);
  const [menu, setMenu] = useLocalStorage<Food[]>("menu", menuItems);

  const today = isoDate();
  const todayReservations = reservations.filter((r) => r.date === today).sort((a, b) => a.time.localeCompare(b.time));
  const count = (s: OrderStatus) => orders.filter((o) => o.status === s).length;

  // TODO: call your backend to change the status.
  const advance = (id: string, to: OrderStatus) => setOrders((list) => list.map((o) => (o.id === id ? { ...o, status: to } : o)));
  const setAvailable = (id: string, available: boolean) => setMenu((list) => list.map((f) => (f.id === id ? { ...f, available } : f)));

  const kpis = [
    { icon: ShoppingBag, n: count("new"), label: "New orders", sub: "Waiting for the kitchen" },
    { icon: Utensils, n: count("preparing"), label: "In the kitchen", sub: "Being prepared" },
    { icon: Truck, n: count("delivering"), label: "Out for delivery", sub: "On the road" },
    { icon: CalendarDays, n: todayReservations.length, label: "Reservations today", sub: `${todayReservations.reduce((n, r) => n + r.guests, 0)} guests` },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl text-cream">Good evening</h2>
        <p className="mt-1 text-[14.5px] text-muted">{fmtDate(today)} - here is what is happening today.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <ButtonLink href="/admin/orders/new"><ShoppingBag size={16} />Dine-in / pickup order</ButtonLink>
          <ButtonLink href="/admin/orders/new?tab=delivery"><Truck size={16} />Delivery order</ButtonLink>
          <ButtonLink href="/admin/reservations/new" variant="outline"><CalendarDays size={16} />Reservation</ButtonLink>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map(({ icon: I, n, label, sub }) => (
          <Card key={label} className="p-5">
            <div className="flex items-center gap-4"><span className="grid h-11 w-11 place-items-center rounded-full bg-gold-soft text-gold-text"><I size={22} /></span><span className="font-display text-4xl text-cream">{n}</span></div>
            <p className="mt-4 font-semibold">{label}</p><p className="text-[12.5px] text-muted">{sub}</p>
          </Card>
        ))}
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between"><h2 className="font-display text-2xl text-cream">Live orders</h2><Link href="/admin/orders" className="text-sm font-bold hover:text-gold-text">Open all orders &rsaquo;</Link></div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {COLUMNS.map(({ status, title }) => {
            const items = orders.filter((o) => o.status === status);
            return (
              <div key={status}>
                <div className="mb-3 flex items-center justify-between rounded-xl bg-raised px-4 py-3"><span className="font-bold">{title}</span><Pill kind={status}>{items.length}</Pill></div>
                <div className="space-y-3">
                  {items.map((o) => {
                    const next = nextStatus(o);
                    return (
                      <Card key={o.id} className="rounded-[14px] p-4">
                        <div className="flex items-center justify-between gap-2"><span className="font-bold">#{o.number}</span><TypePill type={o.type} /></div>
                        <p className="mt-2 font-semibold text-cream">{o.customerName}</p>
                        <p className="mt-0.5 truncate text-[12.5px] text-muted">{o.items.slice(0, 2).map((i) => `${i.quantity}x ${i.name.split(" ")[0]}`).join(", ")}{o.items.length > 2 && "..."}</p>
                        <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-[12.5px]">
                          <span className="flex items-center gap-1.5 text-muted"><Clock size={13} />{timeAgo(o.createdAt)}</span><span className="text-sm font-bold">{money(o.total)}</span>
                        </div>
                        {next && <Button size="sm" variant="subtle" className="mt-3 w-full" onClick={() => advance(o.id, next.to)}>{next.label}</Button>}
                      </Card>
                    );
                  })}
                  {items.length === 0 && <p className="rounded-xl border border-dashed border-border p-5 text-center text-[13px] text-muted">Nothing here</p>}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
        <Panel title="Today's reservations" action={<Link href="/admin/reservations" className="text-sm font-bold hover:text-gold-text">See all</Link>}>
          {todayReservations.length === 0 ? <p className="py-6 text-center text-muted">No reservations today.</p> : (
            <ul className="divide-y divide-line">
              {todayReservations.map((r) => (
                <li key={r.id} className="flex items-center gap-4 py-3.5">
                  <span className="font-display w-14 text-lg text-cream">{r.time}</span>
                  <div className="min-w-0 flex-1"><p className="truncate font-semibold">{r.customerName}</p><p className="text-[12.5px] text-muted">{r.guests} guests - {r.tableIds.join(", ").toUpperCase()}</p></div>
                  <ResStatusPill status={r.status} />
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel title="Quick availability" sub="Switch dishes on or off during service">
          <ul className="divide-y divide-line">
            {menu.slice(0, 5).map((f) => (
              <li key={f.id} className="flex items-center justify-between gap-3 py-3.5"><span className="font-semibold">{f.name}</span>
                <span className="flex items-center gap-3"><span className={`text-[12.5px] font-semibold ${f.available ? "text-ok" : "text-danger"}`}>{f.available ? "Available" : "Sold out"}</span><Toggle on={f.available} label={`${f.name} available`} onChange={(v) => setAvailable(f.id, v)} /></span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
