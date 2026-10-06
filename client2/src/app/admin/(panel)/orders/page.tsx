"use client";

import { MapPin, Phone, Printer, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  OrderStatusPill,
  TableWrap,
  Td,
  Th,
  TypePill,
} from "@/components/admin-shared";
import { Button, Card, Chip, Select } from "@/components/ui";
import type { Order, OrderStatus, OrderType } from "@/data/types";
import { useToast } from "@/lib/toast";
import {
  ORDER_STATUS_LABEL,
  cn,
  money,
  nextStatus,
  timeAgo,
} from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ordersService } from "@/api/orders";
import { queryKeys } from "@/lib/queryKeys";

const STEPS: OrderStatus[] = [
  "new",
  "preparing",
  "ready",
  "delivering",
  "done",
];

const FILTERS: ("all" | OrderStatus)[] = [
  "all",
  "new",
  "preparing",
  "ready",
  "delivering",
  "done",
];

function Detail({
  order,
  onStatus,
}: {
  order: Order;
  onStatus: (status: OrderStatus) => void;
}) {
  const next = nextStatus(order);
  const idx = STEPS.indexOf(order.status as OrderStatus);

  const subtotal = order.orders.reduce(
    (total, item) => total + item.price * item.qty,
    0,
  );

  const total = order.total ?? subtotal;

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl text-cream">
            Order #{order.number ?? order.id}{" "}
            {order.tableLabel ? `for ${order.tableLabel}` : ""}
          </h2>

          <p className="mt-1 text-[13px] text-muted">
            {order.type === "delivery"
              ? "Delivery"
              : order.type === "pickup"
                ? "Pickup"
                : "Dine-in"}{" "}
            {order.createdAt ? `- placed ${timeAgo(order.createdAt)}` : ""}
          </p>
        </div>

        <OrderStatusPill status={order.status as OrderStatus} />
      </div>

      <div className="mt-5 space-y-2.5 border-t border-line pt-5 text-sm">
        <p className="text-[11.5px] font-bold uppercase tracking-wider text-muted">
          Customer
        </p>

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

            {order.address ?? `Table ${order.tableLabel}`}
          </p>
        )}

        {order.apartment && (
          <p className="text-muted">Apartment: {order.apartment}</p>
        )}
      </div>

      <div className="mt-5 border-t border-line pt-5">
        <p className="mb-3 text-[11.5px] font-bold uppercase tracking-wider text-muted">
          Items
        </p>

        <ul className="space-y-3 text-sm">
          {order.orders.map((item, index) => (
            <li key={`${item.id}-${index}`}>
              <div className="flex justify-between gap-3">
                <span className="font-semibold">
                  {item.qty}x {item.name}
                </span>

                <span className="font-semibold">
                  {money(item.price * item.qty)}
                </span>
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

      <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
        <div className="flex justify-between text-muted">
          <dt>Subtotal</dt>
          <dd>{money(subtotal)}</dd>
        </div>

        <div className="flex justify-between text-lg font-bold">
          <dt>Total</dt>
          <dd className="text-cream">{money(total)}</dd>
        </div>
      </dl>

      {order.status !== "cancelled" && (
        <ol className="mt-6 flex items-start justify-between">
          {STEPS.map((step, index) => (
            <li
              key={step}
              className="relative flex flex-1 flex-col items-center text-center"
            >
              {index > 0 && (
                <span
                  className={cn(
                    "absolute right-1/2 top-[9px] h-0.5 w-full",
                    index <= idx ? "bg-gold" : "bg-border",
                  )}
                />
              )}

              <span
                className={cn(
                  "relative z-10 h-[18px] w-[18px] rounded-full border-2",
                  index <= idx
                    ? "border-gold bg-gold"
                    : "border-border bg-card",
                )}
              />

              <span
                className={cn(
                  "mt-2 text-[10.5px]",
                  index === idx ? "font-bold text-cream" : "text-muted",
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
            onClick={() => onStatus(next.to)}
          >
            {next.label}
          </Button>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Button variant="light" onClick={() => window.print()}>
            <Printer size={16} />
            Print ticket
          </Button>

          {order.status !== "cancelled" && order.status !== "done" ? (
            <Button
              variant="danger"
              onClick={() => {
                if (window.confirm("Cancel this order?")) {
                  onStatus("cancelled");
                }
              }}
            >
              Cancel order
            </Button>
          ) : (
            <span />
          )}
        </div>
      </div>

      <div className="print-area hidden print:block">
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>
          Order #{order.number ?? order.id} - {order.type}
        </h1>

        <p>
          {order.name ?? ""} {order.phone ?? ""}{" "}
          {order.address ?? order.tableLabel ?? ""}
        </p>

        <hr />

        {order.orders.map((item, index) => (
          <p key={`${item.id}-${index}`} style={{ fontSize: 18 }}>
            {item.qty}x {item.name}
            {item.note ? ` (${item.note})` : ""}
          </p>
        ))}

        {order.notes && <p>Note: {order.notes}</p>}

        <hr />

        <p>Total {money(total)}</p>
      </div>
    </Card>
  );
}

export default function OrdersPage() {
  const toast = useToast();

  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [type, setType] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const {
    data: orders,
    error: ordersError,
    isLoading: ordersLoading,
  } = useQuery({
    queryFn: () => ordersService.getAll(),
    queryKey: queryKeys.orders,
  });
  console.log(ordersError);
  console.log(orders);

  const rows = useMemo(() => {
    return (orders ?? [])
      .filter(
        (order) =>
          (filter === "all" || order.status === filter) &&
          (type === "all" || order.type === type),
      )
      .sort((a, b) => (b.number ?? 0) - (a.number ?? 0));
  }, [orders, filter, type]);

  useEffect(() => {
    if (!selectedId || !rows.some((order) => order.id === selectedId)) {
      setSelectedId(rows[0]?.id ?? null);
    }
  }, [rows, selectedId]);
  const selected = rows.find((order) => order.id === selectedId);

  const setStatus = (id: string, status: OrderStatus) => {
    toast("Order updated");
  };

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
                  : orders?.filter((order) => order.status === status).length
              }
            >
              {status === "all" ? "All" : ORDER_STATUS_LABEL[status]}
            </Chip>
          ))}
        </div>

        <Select
          value={type}
          onChange={(event) => setType(event.target.value)}
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
                <Th>Time</Th>
                <Th>Status</Th>
              </tr>
            </thead>

            <tbody>
              {rows.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => setSelectedId(order.id ?? null)}
                  className={cn(
                    "cursor-pointer transition-colors hover:bg-white/[0.03]",
                    order.id === selectedId && "bg-gold-soft/60",
                  )}
                >
                  <Td className="font-bold">#{order.number ?? order.id}</Td>

                  <Td>
                    <p className="font-bold text-cream">
                      {order.name === "" ? "Name not specified" : order.name}
                    </p>

                    <p className="text-xs text-muted">
                      {order.phone ??
                        (order.tableLabel
                          ? `Table ${order.tableLabel}`
                          : "Dine-in")}
                    </p>
                  </Td>

                  <Td>
                    <TypePill type={order.type.toLowerCase() as OrderType} />
                  </Td>

                  <Td className="font-semibold">
                    {money(
                      order.total ??
                        order.orders.reduce(
                          (sum, item) => (sum += item.food.price * item.qty),
                          0,
                        ),
                    )}
                  </Td>

                  <Td className="text-muted">
                    {order.createdAt ? timeAgo(order.createdAt) : "-"}
                  </Td>

                  <Td>
                    <OrderStatusPill
                      status={order.status.toLowerCase() as OrderStatus}
                    />
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
            Showing {rows.length} of {orders?.length}
          </p>
        </div>

        {selected && (
          <Detail
            order={selected}
            onStatus={(status) => setStatus(selected.id!, status)}
          />
        )}
      </div>
    </div>
  );
}
