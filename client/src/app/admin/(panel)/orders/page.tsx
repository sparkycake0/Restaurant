"use client";

import { MapPin, Phone, Printer, User } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  OrderStatusPill,
  TableWrap,
  Td,
  Th,
  TypePill,
} from "@/components/admin-shared";
import { Button, Card, Chip, Select } from "@/components/ui";
import { ordersService } from "@/api/orders";
import { queryKeys } from "@/lib/queryKeys";
import { useToast } from "@/lib/toast";
import {
  ORDER_STATUS_LABEL,
  TYPE_LABEL,
  cn,
  money,
  nextStatus,
} from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";
import { refresh } from "@/lib/api";

const STEPS: OrderStatus[] = [
  "new",
  "preparing",
  "ready",
  "delivering",
  "done",
  "cancelled",
];
const FILTERS = ["all", ...STEPS] as const;

const label = "text-[11.5px] font-bold uppercase tracking-wider text-muted";

function Detail({
  order,
  onStatus,
}: {
  order: Order;
  onStatus: (status: OrderStatus) => void;
}) {
  const next = nextStatus(order);
  const current = STEPS.indexOf(order.status);
  const deleteOrder = useMutation({
    mutationFn: (id: number) => ordersService.delete(id),
    mutationKey: queryKeys.orders,
    onSuccess: () => {
      refresh(queryKeys.orders);
    },
  });
  const changeStatus = useMutation({
    mutationFn: (id: number) => ordersService.nextStatus(id),
    mutationKey: queryKeys.orders,
    onSuccess: () => {
      refresh(queryKeys.orders);
    },
  });
  const setStatusCancelled = useMutation({
    mutationFn: (id: number) => ordersService.setStatusCancelled(id),
    mutationKey: queryKeys.orders,
    onSuccess: () => {
      refresh(queryKeys.orders);
    },
  });
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl text-cream">
            Order #{order.id}{" "}
            {order.tableLabel ? `for ${order.tableLabel}` : ""}
          </h2>
          <p className="mt-1 text-[13px] text-muted">
            {TYPE_LABEL[order.type]}
          </p>
        </div>
        <OrderStatusPill status={order.status} />
      </div>

      <div className="mt-5 space-y-2.5 border-t border-line pt-5 text-sm">
        <p className={label}>Customer</p>
        {order.name && (
          <p className="flex items-center gap-3">
            <User size={16} className="text-gold-text" />
            {order.name}
          </p>
        )}
        {order.phone && (
          <p className="flex items-center gap-3">
            <Phone size={16} className="text-gold-text" />
            <a href={`tel:${order.phone}`}>{order.phone}</a>
          </p>
        )}
        {(order.address || order.tableLabel) && (
          <p className="flex items-start gap-3">
            <MapPin size={16} className="mt-0.5 shrink-0 text-gold-text" />
            {order.address || `Table ${order.tableLabel}`}
          </p>
        )}
        {order.apartment && (
          <p className="text-muted">Apartment: {order.apartment}</p>
        )}
      </div>

      <div className="mt-5 border-t border-line pt-5">
        <p className={cn(label, "mb-3")}>Items</p>
        <ul className="space-y-3 text-sm">
          {order.orders.map((item, i) => (
            <li key={i}>
              <div className="flex justify-between gap-3 font-semibold">
                <span>
                  {item.qty}x {item.name}
                </span>
                <span>{money(item.price * item.qty)}</span>
              </div>
              {item.note && (
                <p className="mt-1.5 rounded-lg bg-gold-soft px-3 py-1.5 text-xs font-medium text-gold-text">
                  Note: {item.note}
                </p>
              )}
            </li>
          ))}
        </ul>

        {order.notes && (
          <p className="mt-3 rounded-lg bg-raised px-3 py-2 text-xs text-muted">
            Order note: {order.notes}
          </p>
        )}
      </div>

      <p className="mt-5 flex justify-between border-t border-line pt-4 text-lg font-bold">
        <span>Total</span>
        <span className="text-cream">{money(order.total)}</span>
      </p>

      {order.status !== "cancelled" && (
        <ol className="mt-6 flex items-start justify-between">
          {STEPS.map((step, i) => (
            <li
              key={step}
              className="relative flex flex-1 flex-col items-center text-center"
            >
              {i > 0 && (
                <span
                  className={cn(
                    "absolute right-1/2 top-[9px] h-0.5 w-full",
                    i <= current ? "bg-gold" : "bg-border",
                  )}
                />
              )}
              <span
                className={cn(
                  "relative z-10 h-[18px] w-[18px] rounded-full border-2",
                  i <= current
                    ? "border-gold bg-gold"
                    : "border-border bg-card",
                )}
              />
              <span
                className={cn(
                  "mt-2 text-[10.5px]",
                  i === current ? "font-bold text-cream" : "text-muted",
                )}
              >
                {step === "delivering"
                  ? "Way"
                  : ORDER_STATUS_LABEL[step].slice(0, 5)}
              </span>
            </li>
          ))}
        </ol>
      )}

      <div className="mt-6 space-y-3">
        {next && (
          <Button
            variant="gold"
            size="lg"
            className="w-full"
            onClick={() => {
              changeStatus.mutate(order.id);
              onStatus(order.status);
            }}
          >
            {next.label}
          </Button>
        )}

        <div className="flex flex-col gap-3">
          {order.status !== "cancelled" && order.status !== "done" ? (
            <Button
              variant="danger"
              onClick={() => {
                setStatusCancelled.mutate(order.id);
              }}
            >
              Cancel order
            </Button>
          ) : (
            <span />
          )}
          <Button
            onClick={() => deleteOrder.mutate(order.id)}
            variant="dangerFill"
          >
            Delete order
          </Button>
          <Button variant="light" onClick={() => window.print()}>
            <Printer size={16} />
            Print ticket
          </Button>
        </div>
      </div>

      {/* What gets printed */}
      <div className="print-area hidden print:block">
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>
          Order #{order.id} - {order.type}
        </h1>
        <p>
          {order.name} {order.phone} {order.address || order.tableLabel}
        </p>
        <hr />
        {order.orders.map((item, i) => (
          <p key={i} style={{ fontSize: 18 }}>
            {item.qty}x {item.name}
            {item.note ? ` (${item.note})` : ""}
          </p>
        ))}
        {order.notes && <p>Note: {order.notes}</p>}
        <hr />
        <p>Total {money(order.total)}</p>
      </div>
    </Card>
  );
}

export default function OrdersPage() {
  const toast = useToast();

  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [type, setType] = useState("all");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data: orders } = useQuery({
    queryKey: queryKeys.orders,
    queryFn: ordersService.getAll,
  });

  // newest first
  const rows = (orders ?? [])
    .filter(
      (o) =>
        (filter === "all" || o.status === filter) &&
        (type === "all" || o.type === type),
    )
    .sort((a, b) => Number(b.id) - Number(a.id));

  const selected = rows.find((o) => o.id === selectedId) ?? rows[0];

  // TODO(api): the server has no endpoint for changing an order's status yet
  const setStatus = () => toast("Order updated");

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {FILTERS.map((status) => (
            <Chip
              key={status}
              active={filter === status}
              onClick={() => setFilter(status)}
              count={
                status === "all"
                  ? orders?.length
                  : orders?.filter((o) => o.status === status).length
              }
            >
              {status === "all" ? "All" : ORDER_STATUS_LABEL[status]}
            </Chip>
          ))}
        </div>

        <Select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full lg:w-[190px]"
          aria-label="Order type"
        >
          <option value="all">All types</option>
          <option value="dine_in">Dine-in</option>
          <option value="pickup">Pickup</option>
          <option value="delivery">Delivery</option>
        </Select>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div>
          <TableWrap min={700}>
            <thead>
              <tr>
                <Th>Order</Th>
                <Th>Customer</Th>
                <Th>Type</Th>
                <Th>Total</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr
                  key={o.id}
                  onClick={() => setSelectedId(o.id)}
                  className={cn(
                    "cursor-pointer transition-colors hover:bg-white/[0.03]",
                    o.id === selected?.id && "bg-gold-soft/60",
                  )}
                >
                  <Td className="font-bold">#{o.id}</Td>
                  <Td>
                    <p className="font-bold text-cream">
                      {o.name || "Name not specified"}
                    </p>
                    <p className="text-xs text-muted">
                      {o.phone ||
                        (o.tableLabel ? `Table ${o.tableLabel}` : "Dine-in")}
                    </p>
                  </Td>
                  <Td>
                    <TypePill type={o.type} />
                  </Td>
                  <Td className="font-semibold">{money(o.total)}</Td>
                  <Td>
                    <OrderStatusPill status={o.status} />
                  </Td>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr>
                  <Td className="py-12 text-center text-muted">
                    No orders found.
                  </Td>
                </tr>
              )}
            </tbody>
          </TableWrap>

          <p className="mt-4 text-[13px] text-muted">
            Showing {rows.length} of {orders?.length ?? 0}
          </p>
        </div>

        {selected && <Detail order={selected} onStatus={setStatus} />}
      </div>
    </div>
  );
}
