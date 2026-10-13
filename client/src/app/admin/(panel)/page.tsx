"use client";
import Link from "next/link";
import { OrderStatusPill, Panel, TypePill } from "@/components/admin-shared";
import { Card } from "@/components/ui";
import { orders } from "@/data/orders";
import { reservations } from "@/data/reservations";
import { fmtDate, money } from "@/lib/utils";

// SAMPLE DATA: `orders` and `reservations` come from /data.
// TODO(api): use useQuery with ordersService.getAll() for the orders.
export default function Dashboard() {
  const open = orders.filter((o) => o.status !== "done" && o.status !== "cancelled");
  const revenue = orders.reduce((sum, o) => sum + (o.total ?? 0), 0);

  const stats = [
    { label: "Open orders", value: open.length },
    { label: "Orders today", value: orders.length },
    { label: "Revenue today", value: money(revenue) },
    { label: "Reservations", value: reservations.length },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <p className="text-[13px] text-muted">{s.label}</p>
            <p className="font-display mt-2 text-3xl text-cream">{s.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Latest orders" action={<Link href="/admin/orders" className="text-sm font-bold hover:text-gold-text">View all</Link>}>
          <ul className="divide-y divide-line">
            {orders.map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <span>#{o.id} {o.name ?? o.tableLabel}</span>
                <span className="flex items-center gap-2">
                  <TypePill type={o.type} />
                  <OrderStatusPill status={o.status} />
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Upcoming reservations" action={<Link href="/admin/reservations" className="text-sm font-bold hover:text-gold-text">View all</Link>}>
          <ul className="divide-y divide-line">
            {reservations.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <span>{r.customerName} - {r.guests} guests</span>
                <span className="text-muted">{fmtDate(r.date)}, {r.time}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
