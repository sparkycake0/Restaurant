"use client";
import { MapPin, Phone, Printer, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { OrderStatusPill, TableWrap, Td, Th, TypePill } from "@/components/admin-shared";
import { Button, Card, Chip, Select } from "@/components/ui";
import { orders as sampleOrders } from "@/data/orders";
import type { Order, OrderStatus } from "@/data/types";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { useToast } from "@/lib/toast";
import { ORDER_STATUS_LABEL, cn, money, nextStatus, timeAgo } from "@/lib/utils";

const STEPS: OrderStatus[] = ["new", "preparing", "ready", "delivering", "done"];
const FILTERS: ("all" | OrderStatus)[] = ["all", "new", "preparing", "ready", "delivering", "done"];

function Detail({ o, onStatus }: { o: Order; onStatus: (s: OrderStatus) => void }) {
  const next = nextStatus(o);
  const idx = STEPS.indexOf(o.status);
  const sub = o.items.reduce((n, i) => n + i.price * i.quantity, 0);
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-3"><div><h2 className="font-display text-2xl text-cream">Order #{o.number}</h2><p className="mt-1 text-[13px] text-muted">{o.type === "delivery" ? "Delivery" : o.type === "pickup" ? "Pickup" : "Dine-in"} - placed {timeAgo(o.createdAt)}</p></div><OrderStatusPill status={o.status} /></div>
      <div className="mt-5 space-y-2.5 border-t border-line pt-5 text-sm">
        <p className="text-[11.5px] font-bold uppercase tracking-wider text-muted">Customer</p>
        <p className="flex items-center gap-3"><User size={16} className="text-gold-text" />{o.customerName}</p>
        {o.phone && <p className="flex items-center gap-3"><Phone size={16} className="text-gold-text" /><a href={`tel:${o.phone}`}>{o.phone}</a></p>}
        {(o.address || o.tableLabel) && <p className="flex items-start gap-3"><MapPin size={16} className="mt-0.5 shrink-0 text-gold-text" />{o.address ?? `Table ${o.tableLabel}`}</p>}
      </div>
      <div className="mt-5 border-t border-line pt-5">
        <p className="mb-3 text-[11.5px] font-bold uppercase tracking-wider text-muted">Items</p>
        <ul className="space-y-3 text-sm">
          {o.items.map((i, k) => (
            <li key={k}><div className="flex justify-between gap-3"><span className="font-semibold">{i.quantity}x {i.name}</span><span className="font-semibold">{money(i.price * i.quantity)}</span></div>
              {i.note && <p className="mt-1.5 rounded-lg bg-gold-soft px-3 py-1.5 text-xs font-medium text-gold-text">Note: {i.note}</p>}</li>
          ))}
        </ul>
        {o.note && <p className="mt-3 rounded-lg bg-raised px-3 py-2 text-xs text-muted">Order note: {o.note}</p>}
      </div>
      <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
        <div className="flex justify-between text-muted"><dt>Subtotal</dt><dd>{money(sub)}</dd></div>
        <div className="flex justify-between text-muted"><dt>Delivery fee</dt><dd>{o.deliveryFee ? money(o.deliveryFee) : "Free"}</dd></div>
        <div className="flex justify-between text-lg font-bold"><dt>Total</dt><dd className="text-cream">{money(o.total)}</dd></div>
      </dl>
      {o.status !== "cancelled" && (
        <ol className="mt-6 flex items-start justify-between">
          {STEPS.map((s, i) => (
            <li key={s} className="relative flex flex-1 flex-col items-center text-center">
              {i > 0 && <span className={cn("absolute right-1/2 top-[9px] h-0.5 w-full", i <= idx ? "bg-gold" : "bg-border")} />}
              <span className={cn("relative z-10 h-[18px] w-[18px] rounded-full border-2", i <= idx ? "border-gold bg-gold" : "border-border bg-card")} />
              <span className={cn("mt-2 text-[10.5px]", i === idx ? "font-bold text-cream" : "text-muted")}>{s === "delivering" ? "Way" : ORDER_STATUS_LABEL[s].slice(0, 5)}</span>
            </li>
          ))}
        </ol>
      )}
      <div className="mt-6 space-y-3">
        {next && <Button variant="gold" size="lg" className="w-full" onClick={() => onStatus(next.to)}>{next.label}</Button>}
        <div className="grid grid-cols-2 gap-3"><Button variant="light" onClick={() => window.print()}><Printer size={16} />Print ticket</Button>
          {o.status !== "cancelled" && o.status !== "done" ? <Button variant="danger" onClick={() => confirm("Cancel this order?") && onStatus("cancelled")}>Cancel order</Button> : <span />}</div>
      </div>

      {/* Kitchen ticket (visible only when printing) */}
      <div className="print-area hidden print:block">
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Order #{o.number} - {o.type}</h1>
        <p>{o.customerName} {o.phone} {o.address ?? o.tableLabel ?? ""}</p><hr />
        {o.items.map((i, k) => <p key={k} style={{ fontSize: 18 }}>{i.quantity}x {i.name}{i.note ? ` (${i.note})` : ""}</p>)}
        {o.note && <p>Note: {o.note}</p>}<hr /><p>Total {money(o.total)}</p>
      </div>
    </Card>
  );
}

export default function OrdersPage() {
  const toast = useToast();
  const [all, setAll] = useLocalStorage<Order[]>("orders", sampleOrders);
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [type, setType] = useState("all");
  const [sel, setSel] = useState<string | null>(null);

  const rows = useMemo(() => all.filter((o) => (filter === "all" || o.status === filter) && (type === "all" || o.type === type)).sort((a, b) => b.number - a.number), [all, filter, type]);
  useEffect(() => { if (!sel || !rows.some((o) => o.id === sel)) setSel(rows[0]?.id ?? null); }, [rows, sel]);
  const selected = rows.find((o) => o.id === sel);

  // TODO: call your backend to change the status.
  const setStatus = (id: string, status: OrderStatus) => {
    setAll((list) => list.map((o) => (o.id === id ? { ...o, status } : o)));
    toast("Order updated");
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {FILTERS.map((f) => <Chip key={f} active={filter === f} onClick={() => setFilter(f)} count={f === "all" ? all.length : all.filter((o) => o.status === f).length}>{f === "all" ? "All" : ORDER_STATUS_LABEL[f]}</Chip>)}
        </div>
        <Select value={type} onChange={(e) => setType(e.target.value)} className="w-full lg:w-[190px]" aria-label="Order type">
          <option value="all">All types</option><option value="dine_in">Dine-in</option><option value="pickup">Pickup</option><option value="delivery">Delivery</option>
        </Select>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div>
          <TableWrap min={700}>
            <thead><tr><Th>Order</Th><Th>Customer</Th><Th>Type</Th><Th>Total</Th><Th>Time</Th><Th>Status</Th></tr></thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.id} onClick={() => setSel(o.id)} className={cn("cursor-pointer transition-colors hover:bg-white/[0.03]", o.id === sel && "bg-gold-soft/60")}>
                  <Td className="font-bold">#{o.number}</Td>
                  <Td><p className="font-bold text-cream">{o.customerName}</p><p className="text-xs text-muted">{o.phone ?? (o.tableLabel ? `Table ${o.tableLabel}` : "Dine-in")}</p></Td>
                  <Td><TypePill type={o.type} /></Td><Td className="font-semibold">{money(o.total)}</Td><Td className="text-muted">{timeAgo(o.createdAt)}</Td><Td><OrderStatusPill status={o.status} /></Td>
                </tr>
              ))}
              {rows.length === 0 && <tr><Td className="py-12 text-center text-muted" >No orders match these filters.</Td></tr>}
            </tbody>
          </TableWrap>
          <p className="mt-4 text-[13px] text-muted">Showing {rows.length} of {all.length}</p>
        </div>
        {selected && <Detail o={selected} onStatus={(s) => setStatus(selected.id, s)} />}
      </div>
    </div>
  );
}
