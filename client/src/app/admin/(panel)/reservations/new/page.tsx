"use client";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { reservationService } from "@/api/reservation";
import { tableService } from "@/api/table";
import { Panel } from "@/components/admin-shared";
import { Button, Field, Input, Select, Textarea } from "@/components/ui";
import { queryKeys } from "@/lib/queryKeys";
import { useToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import type { Reservation } from "@/types";

/* ------------------------------ settings --------------------------------- */
const MONTHS_SHOWN = 3;
const FIRST_HOUR = 8;
const LAST_HOUR = 14;
const STEPS = ["Tables", "Date & time", "Details"];
const EVENT_TYPES = ["Lunch", "Dinner", "Birthday", "Corporate", "Anniversary"];
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const TIMES = Array.from(
  { length: (LAST_HOUR - FIRST_HOUR) * 2 + 1 },
  (_, i) => {
    const hour = String(FIRST_HOUR + Math.floor(i / 2)).padStart(2, "0");
    return `${hour}:${i % 2 ? "30" : "00"}`;
  },
);

/* ------------------------------- helpers --------------------------------- */
const pad = (n: number) => String(n).padStart(2, "0");
const dateString = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const choice = (active: boolean) =>
  cn(
    "rounded-xl border px-4 py-2.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-30",
    active
      ? "border-gold bg-gold font-bold text-ink"
      : "border-border bg-card hover:border-gold/60",
  );

function Month({
  first,
  selected,
  onSelect,
}: {
  first: Date;
  selected: string;
  onSelect: (date: string) => void;
}) {
  const today = dateString(new Date());
  const daysInMonth = new Date(
    first.getFullYear(),
    first.getMonth() + 1,
    0,
  ).getDate();
  const emptyCells = (first.getDay() + 6) % 7; // the week starts on Monday

  return (
    <div>
      <h3 className="mb-3 font-bold text-cream">
        {first.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
      </h3>
      <div className="grid grid-cols-7 gap-1.5 text-center text-sm">
        {WEEKDAYS.map((d) => (
          <span key={d} className="pb-1 text-xs text-muted">
            {d}
          </span>
        ))}
        {Array.from({ length: emptyCells }, (_, i) => (
          <span key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const date = dateString(
            new Date(first.getFullYear(), first.getMonth(), i + 1),
          );
          return (
            <button
              key={date}
              type="button"
              disabled={date < today}
              onClick={() => onSelect(date)}
              className={cn(
                "h-9 rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-25",
                date === selected
                  ? "bg-gold font-bold text-ink"
                  : "hover:bg-raised",
              )}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* --------------------------------- page ---------------------------------- */
export default function NewReservationPage() {
  const router = useRouter();
  const toast = useToast();

  const [step, setStep] = useState(1);
  const [tableIds, setTableIds] = useState<number[]>([]);
  const [form, setForm] = useState<Reservation>({
    customerName: "",
    phone: "",
    email: "",
    date: "",
    start: "",
    end: "",
    table: [],
    guests: 1,
    eventType: "Dinner",
    notes: "",
    status: "pending",
  });
  const set = <K extends keyof Reservation>(key: K, value: Reservation[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  // ---- step 1: all active tables ----
  const { data: allTables, isLoading: tablesLoading } = useQuery({
    queryKey: queryKeys.tables,
    queryFn: tableService.getAll,
  });
  const tables = allTables?.filter((t) => t.active && t.id !== null) ?? [];
  const chosen = tables.filter((t) => t.id !== null && tableIds.includes(t.id));
  const totalSeats = chosen.reduce((sum, t) => sum + t.seats, 0);

  const toggleTable = (id: number) =>
    setTableIds((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id],
    );

  // ---- step 2: is every chosen table free at that time? ----
  const timeChosen = !!form.date && !!form.start && !!form.end;
  const availability = useQuery({
    queryKey: [
      ...queryKeys.tables,
      "available",
      form.date,
      form.start,
      form.end,
    ],
    queryFn: () => tableService.getActive(form.date, form.start, form.end),
    enabled: timeChosen,
  });
  const taken =
    timeChosen && availability.data
      ? chosen.filter(
          (t) => !availability.data.some((free) => free.id === t.id),
        )
      : [];

  const now = new Date();
  const months = Array.from(
    { length: MONTHS_SHOWN },
    (_, i) => new Date(now.getFullYear(), now.getMonth() + i, 1),
  );

  // a new start time clears the end time if it is no longer after it
  function pickStart(time: string) {
    setForm((f) => ({ ...f, start: time, end: f.end > time ? f.end : "" }));
  }

  // ---- save ----
  const save = useMutation({
    mutationFn: () => reservationService.save({ ...form, table: tableIds }),
    onSuccess: () => {
      toast("Reservation saved");
      router.push("/admin/reservations");
    },
    onError: () => toast("Could not save the reservation", "error"),
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (step === 3) save.mutate();
  }

  const canContinue =
    step === 1
      ? tableIds.length > 0
      : timeChosen && !availability.isFetching && taken.length === 0;

  return (
    <Panel title="New reservation">
      <form onSubmit={submit} className="flex flex-col gap-4">
        {/* Personal information */}
        <div className="border border-border p-4 rounded-md flex flex-col gap-4">
          <label className="text-xl font-bold mb-4">Personal information</label>
          <Field label="Name">
            <Input
              required
              value={form.customerName}
              onChange={(e) => set("customerName", e.target.value)}
            />
          </Field>
          <Field label="Phone">
            <Input
              required
              type="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </Field>
        </div>

        {/* Event details, one step at a time */}
        <div className="border border-border p-4 rounded-md w-full">
          <label className="text-xl font-bold">Event details</label>

          {/* progress */}
          <ol className="my-6 flex flex-wrap items-center gap-2 text-sm">
            {STEPS.map((name, i) => {
              const n = i + 1;
              return (
                <li key={name} className="flex items-center gap-2">
                  <span
                    className={cn(
                      "grid h-7 w-7 place-items-center rounded-full text-xs font-bold",
                      n < step
                        ? "bg-primary text-cream"
                        : n === step
                          ? "bg-gold text-ink"
                          : "bg-raised text-muted",
                    )}
                  >
                    {n < step ? <Check size={14} /> : n}
                  </span>
                  <span
                    className={
                      n === step ? "font-bold text-cream" : "text-muted"
                    }
                  >
                    {name}
                  </span>
                  {n < STEPS.length && (
                    <span className="mx-1 h-px w-6 bg-border" />
                  )}
                </li>
              );
            })}
          </ol>

          {/* what was picked so far */}
          {step > 1 && (
            <p className="mb-6 text-sm text-muted">
              Tables: {chosen.map((t) => t.label).join(", ")} ({totalSeats}{" "}
              seats)
              {step === 3 && ` - ${form.date}, ${form.start} - ${form.end}`}
            </p>
          )}

          {/* Step 1: tables */}
          {step === 1 && (
            <div>
              <p className="mb-3 font-semibold">Which tables do you want?</p>
              {tablesLoading && (
                <p className="text-sm text-muted">Loading tables...</p>
              )}
              {!tablesLoading && tables.length === 0 && (
                <p className="text-sm text-muted">
                  There are no active tables. Add some on the Tables page.
                </p>
              )}
              <div className="flex flex-wrap gap-3">
                {tables.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggleTable(t.id!)}
                    className={choice(tableIds.includes(t.id!))}
                  >
                    {t.label}{" "}
                    <span className="opacity-70">- {t.seats} seats</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: date and time */}
          {step === 2 && (
            <div className="flex flex-col gap-8">
              <div>
                <p className="mb-3 font-semibold">Pick a day</p>
                <div className="grid gap-8 md:grid-cols-3">
                  {months.map((first) => (
                    <Month
                      key={first.getTime()}
                      first={first}
                      selected={form.date}
                      onSelect={(date) => set("date", date)}
                    />
                  ))}
                </div>
              </div>

              {form.date && (
                <>
                  <div>
                    <p className="mb-3 font-semibold">Start time</p>
                    <div className="flex flex-wrap gap-2">
                      {TIMES.slice(0, -1).map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => pickStart(time)}
                          className={choice(form.start === time)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 font-semibold">End time</p>
                    <div className="flex flex-wrap gap-2">
                      {TIMES.map((time) => (
                        <button
                          key={time}
                          type="button"
                          disabled={!form.start || time <= form.start}
                          onClick={() => set("end", time)}
                          className={choice(form.end === time)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {taken.length > 0 && (
                <p className="text-sm text-danger">
                  Already booked at this time:{" "}
                  {taken.map((t) => t.label).join(", ")}. Go back and pick other
                  tables, or choose another time.
                </p>
              )}
            </div>
          )}

          {/* Step 3: details */}
          {step === 3 && (
            <div className="grid grid-cols-2 gap-4">
              <Field label="Event">
                <Select
                  value={form.eventType}
                  onChange={(e) => set("eventType", e.target.value)}
                >
                  {EVENT_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </Select>
              </Field>
              <Field label={`Guests (the tables seat ${totalSeats})`}>
                <Input
                  required
                  type="number"
                  min={1}
                  value={form.guests}
                  onChange={(e) => set("guests", Number(e.target.value))}
                />
              </Field>
              <Field label="Notes" className="col-span-2">
                <Textarea
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                />
              </Field>
            </div>
          )}

          {/* buttons */}
          <div className="mt-8 flex items-center justify-between">
            {step > 1 ? (
              <Button variant="light" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            ) : (
              <span />
            )}

            {step < 3 ? (
              <Button disabled={!canContinue} onClick={() => setStep(step + 1)}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={save.isPending}>
                {save.isPending ? "Saving..." : "Save reservation"}
              </Button>
            )}
          </div>
        </div>
      </form>
    </Panel>
  );
}
