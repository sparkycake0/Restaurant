"use client";
import { Check, Plus, Search, StickyNote, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Panel, Tabs } from "@/components/admin-shared";
import {
  Button,
  Chip,
  Field,
  Input,
  Photo,
  Select,
  Stepper,
  Textarea,
} from "@/components/ui";
import { customers } from "@/data/customers";
import type { Customer, Order, OrderItem } from "@/data/types";
import { useToast } from "@/lib/toast";
import { money } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { categoryService, foodService } from "@/api/menu";
import { queryKeys } from "@/lib/queryKeys";
import { tableService } from "@/api/table";
import { Category } from "@/types/menu";
import { ordersService } from "@/api/orders";

function NewOrder() {
  const toast = useToast();
  const [tab, setTab] = useState<"dine" | "delivery">(
    useSearchParams().get("tab") === "delivery" ? "delivery" : "dine",
  );
  const [kind, setKind] = useState<"dine_in" | "pickup">("dine_in");
  const [table, setTable] = useState<number | null>(0);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [lines, setLines] = useState<OrderItem[]>([]);
  const [c, setC] = useState({
    phone: "",
    name: "",
    address: "",
    apartment: "",
    notes: "",
  });
  const [found, setFound] = useState<Customer | null>(null);
  const [noteFor, setNoteFor] = useState<number | undefined>(undefined);
  const {
    data: tables,
    error: tablesError,
    isLoading: tablesLoading,
  } = useQuery({
    queryFn: () => tableService.getAll(),
    queryKey: queryKeys.tables,
  });
  const {
    data: menuItems,
    error: menuItemsError,
    isLoading: menuItemsLoading,
  } = useQuery({
    queryFn: () => foodService.getAll(),
    queryKey: queryKeys.foods,
  });
  const {
    data: categories,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useQuery({
    queryFn: () => categoryService.getAll(),
    queryKey: queryKeys.categories,
  });
  const [errors] = useState([menuItemsError, categoriesError, tablesError]);
  const [loadings] = useState([
    menuItemsLoading,
    categoriesLoading,
    tablesLoading,
  ]);
  loadings.forEach((e) => {
    if (e) {
      return (
        <div className="w-screen h-screen absolute top-0 left-0 text-center text-4xl font-bold">
          Loading...
        </div>
      );
    }
  });
  errors.forEach((e) => {
    if (e) console.log(e);
  });
  const dishes = menuItems?.filter(
    (f) =>
      f.available &&
      (cat === "all" || f.category === cat) &&
      (!q || f.name.toLowerCase().includes(q.toLowerCase())),
  );
  const qty = (id: number) => lines.find((l) => l.id === id)?.qty ?? 0;
  const setQty = (id: number, name: string, price: number, n: number) =>
    setLines((ls) =>
      n <= 0
        ? ls.filter((l) => l.id !== id)
        : ls.some((l) => l.id === id)
          ? ls.map((l) => (l.id === id ? { ...l, qty: n } : l))
          : [...ls, { id, name, price, qty: n }],
    );
  const subtotal = lines.reduce((n, l) => n + l.price * l.qty, 0);
  const valid =
    lines.length > 0 &&
    (tab === "dine" || (c.name.trim() && c.phone.trim() && c.address.trim()));

  function findCustomer() {
    const digits = c.phone.replace(/\s/g, "");
    const hit =
      customers.find((x) => x.phone.replace(/\s/g, "").includes(digits)) ??
      null;
    setFound(hit);
    if (!hit) toast("No customer with that phone yet", "error");
  }

  const save = useMutation({
    mutationFn: (body: Order) => ordersService.save(body),
    mutationKey: queryKeys.orders,
  });
  function create() {
    const order = {
      orders: lines,
      table,
      ...c,
      type: tab === "dine" ? kind : tab,
      status: "new",
    };
    save.mutate(order);
  }

  return (
    <div>
      <Tabs
        tabs={[
          { id: "dine", label: "Dine-in / pickup" },
          { id: "delivery", label: "Delivery" },
          {
            id: "res",
            label: "Reservation (catering)",
            href: "/admin/reservations/new",
          },
        ]}
        active={tab}
        onChange={(id) => {
          if (id === "dine") {
            setC({
              phone: "",
              name: "",
              address: "",
              apartment: "",
              notes: "",
            });
          }
          setTab(id as "dine" | "delivery");
        }}
      />
      <div className="grid gap-6 xl:grid-cols-[1.15fr_1fr]">
        <Panel title="1. Pick dishes">
          <div className="relative">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search the menu..."
              className="pl-11"
              aria-label="Search menu"
            />
          </div>
          <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
            <Chip active={cat === "all"} onClick={() => setCat("all")}>
              All
            </Chip>
            {categories?.map((k) => (
              <Chip
                key={k.id}
                active={cat === k.name}
                onClick={() => setCat(k.name)}
              >
                {k.name}
              </Chip>
            ))}
          </div>
          <ul className="mt-4 max-h-[720px] divide-y divide-line overflow-y-auto pr-1">
            {dishes?.map((f) => (
              <li key={f.id} className="flex items-center gap-4 py-3">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-[10px]">
                  <Photo src={f.image} alt={f.name} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{f.name}</p>
                  <p className="text-[12.5px] text-muted">
                    {(f.category as Category).name}
                  </p>
                </div>
                <span className="hidden font-semibold sm:block">
                  {money(f.price)}
                </span>
                {qty(f.id) ? (
                  <Stepper
                    value={qty(f.id)}
                    onChange={(n) => setQty(f.id, f.name, f.price, n)}
                  />
                ) : (
                  <Button
                    size="sm"
                    variant="subtle"
                    onClick={() => setQty(f.id, f.name, f.price, 1)}
                  >
                    <Plus size={15} />
                    Add
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </Panel>

        <div className="space-y-6">
          <Panel title="2. Customer">
            {tab === "dine" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Type">
                  <Select
                    value={kind}
                    onChange={(e) =>
                      setKind(e.target.value as "dine_in" | "pickup")
                    }
                  >
                    <option value="dine_in">Dine-in</option>
                    <option value="pickup">Pickup</option>
                  </Select>
                </Field>
                {kind === "dine_in" ? (
                  <Field label="Table">
                    <Select
                      value={Number(table)}
                      onChange={(e) => setTable(Number(e.target.value))}
                    >
                      <option value="">Select a table</option>
                      {tables?.map((t) => (
                        <option key={t.id} value={Number(t.id)}>
                          {t.label} ({t.seats} seats)
                        </option>
                      ))}
                    </Select>
                  </Field>
                ) : (
                  <Field label="Customer name">
                    <Input
                      value={c.name}
                      onChange={(e) => setC({ ...c, name: e.target.value })}
                    />
                  </Field>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-end gap-3">
                  <Field label="Phone" className="flex-1">
                    <Input
                      value={c.phone}
                      onChange={(e) => setC({ ...c, phone: e.target.value })}
                      type="tel"
                      placeholder="+381 60 000 0000"
                    />
                  </Field>
                  <Button
                    variant="subtle"
                    onClick={findCustomer}
                    disabled={c.phone.length < 4}
                  >
                    Find
                  </Button>
                </div>
                {found && (
                  <div className="flex flex-wrap items-center gap-3 rounded-xl bg-[#163828] p-4 text-[#7fd0a0]">
                    <Check size={18} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold">
                        Existing customer: {found.name}
                      </p>
                      <p className="truncate text-xs">
                        {found.address} - {found.ordersCount} past orders
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() =>
                        setC({
                          ...c,
                          name: found.name,
                          address: found.address,
                          phone: found.phone,
                        })
                      }
                    >
                      Use
                    </Button>
                  </div>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full name">
                    <Input
                      value={c.name}
                      onChange={(e) => setC({ ...c, name: e.target.value })}
                    />
                  </Field>
                  <Field label="Apartment / floor">
                    <Input
                      value={c.apartment}
                      onChange={(e) =>
                        setC({ ...c, apartment: e.target.value })
                      }
                    />
                  </Field>
                </div>
                <Field label="Delivery address">
                  <Input
                    value={c.address}
                    onChange={(e) => setC({ ...c, address: e.target.value })}
                  />
                </Field>
              </div>
            )}
            <Field label="Note for the kitchen / courier" className="mt-4">
              <Textarea
                value={c.notes}
                onChange={(e) => setC({ ...c, notes: e.target.value })}
                className="min-h-[80px]"
              />
            </Field>
          </Panel>

          <Panel title="3. Order summary">
            {lines.length === 0 ? (
              <p className="py-4 text-sm text-muted">
                No items yet. Add dishes on the left.
              </p>
            ) : (
              <ul className="divide-y divide-line">
                {lines.map((l) => (
                  <li key={l.id} className="py-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold">
                        {l.qty}x {l.name}
                      </span>
                      <span className="flex items-center gap-3">
                        <span className="font-semibold">
                          {money(l.price * l.qty)}
                        </span>
                        <button
                          onClick={() => setQty(l.id ?? 0, l.name, l.price, 0)}
                          aria-label={`Remove ${l.name}`}
                          className="text-danger"
                        >
                          <Trash2 size={16} />
                        </button>
                      </span>
                    </div>
                    {noteFor === l.id ? (
                      <Input
                        autoFocus
                        className="mt-2 h-10 text-sm"
                        value={l.note ?? ""}
                        onChange={(e) =>
                          setLines((ls) =>
                            ls.map((x) =>
                              x.id === l.id
                                ? { ...x, note: e.target.value }
                                : x,
                            ),
                          )
                        }
                        onBlur={() => setNoteFor(undefined)}
                        placeholder="e.g. no onions"
                      />
                    ) : (
                      <button
                        onClick={() => setNoteFor(l.id)}
                        className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-mint"
                      >
                        <StickyNote size={13} />
                        {l.note
                          ? `Note: ${l.note}`
                          : "+ Add note for the kitchen"}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 flex justify-between border-t border-line pt-4 text-lg font-bold">
              <span>Total</span>
              <span className="text-cream">{money(subtotal)}</span>
            </div>
            <Button
              size="lg"
              className="mt-5 w-full"
              disabled={!valid}
              onClick={create}
            >
              {tab === "delivery" ? "Create delivery order" : "Create order"}
            </Button>
          </Panel>
        </div>
      </div>
    </div>
  );
}

// useSearchParams needs a Suspense wrapper in Next.js
export default function NewOrderPage() {
  return (
    <Suspense>
      <NewOrder />
    </Suspense>
  );
}
