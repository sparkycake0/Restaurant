"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Panel } from "@/components/admin-shared";
import { Button, Field, Input, Select, Textarea } from "@/components/ui";
import { useToast } from "@/lib/toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { tableService } from "@/api/table";
import { queryKeys } from "@/lib/queryKeys";
import { Reservation } from "@/types";
import { reservationService } from "@/api/reservation";

// Change these to match your theme
const ACCENT_BG = "bg-amber-600 text-white";
const ACCENT_BORDER = "border-amber-600";
const ACCENT_SOFT = "bg-amber-50 dark:bg-amber-950/30";

const STEPS = ["Your info", "Date & time", "Table"];
function addDay(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  const next = new Date(y, m - 1, d + 1);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${next.getFullYear()}-${pad(next.getMonth() + 1)}-${pad(next.getDate())}`;
}
export default function NewReservationPage() {
  const router = useRouter();
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [selectedTables, setSelectedTables] = useState<number[]>([]);
  const [form, setForm] = useState<Reservation>({
    customerName: "",
    phone: "",
    email: "",
    startDate: "",
    startTime: "19:00",
    endDate: "",
    endTime: "23:00",
    guests: 2,
    eventType: "Dinner",
    notes: "",
    status: "pending",
  });
  const {
    data: tables,
    error: tablesError,
    isLoading: tablesLoading,
  } = useQuery({
    queryFn: () =>
      tableService.getActive({
        startDate: form.startDate,
        endTime: form.endTime,
        endDate: form.endDate,
        startTime: form.startTime,
      }),
    queryKey: [
      queryKeys.tables,
      form.startDate,
      form.endDate,
      form.startTime,
      form.endTime,
    ],
  });
  const saveReservation = useMutation({
    mutationFn: (input: Reservation) => reservationService.save(input),
    mutationKey: queryKeys.reservations,
  });
  if (tablesError) console.log(tablesError);
  const set = (key: keyof typeof form, value: string) => {
    const next = { ...form, [key]: value };
    const timeChanged =
      key === "startDate" || key === "startTime" || key === "endTime";

    if (
      next.startDate &&
      (timeChanged || !next.endDate || next.endDate < next.startDate)
    ) {
      next.endDate =
        next.endTime > next.startTime ? next.startDate : addDay(next.startDate);
    }

    setForm(next);
  };

  function toggleTable(id: number) {
    setSelectedTables(
      selectedTables.includes(id)
        ? selectedTables.filter((t) => t !== id)
        : [...selectedTables, id],
    );
  }

  function back() {
    if (step === 2) setSelectedTables([]);
    setStep(step - 1);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();

    if (step === 1) {
      const start = new Date(`${form.startDate}T${form.startTime}`);
      const end = new Date(`${form.endDate}T${form.endTime}`);
      if (end <= start) {
        toast("End must be after the start");
        return;
      }
    }

    if (step === 2) {
      if (selectedTables.length === 0) {
        toast("Choose at least one table");
        return;
      }
      const input = {
        ...form,
        guests: Number(form.guests),
        eventType: form.eventType.toUpperCase(),
        status: form.status.toUpperCase(),
        tableIds: selectedTables,
      };
      saveReservation.mutate(input, {
        onError: (err) => console.log(err),
        onSuccess: () => {
          toast("Reservation saved");
          // router.push("/admin/reservations");
        },
      });
      return;
    }

    setStep(step + 1);
  }

  return (
    <Panel title="New reservation">
      {/* Step indicator */}
      <ol className="mb-8 flex items-center">
        {STEPS.map((label, i) => (
          <li key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold ${
                  i <= step
                    ? `${ACCENT_BG} ${ACCENT_BORDER}`
                    : "border-neutral-300 text-neutral-400 dark:border-neutral-700"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </span>
              <span
                className={`hidden text-sm sm:inline ${
                  i === step ? "font-semibold" : "text-neutral-500"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`mx-3 h-0.5 flex-1 rounded ${
                  i < step
                    ? "bg-amber-600"
                    : "bg-neutral-200 dark:bg-neutral-800"
                }`}
              />
            )}
          </li>
        ))}
      </ol>

      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        {step === 0 && (
          <>
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
            <Field label="Email" className="sm:col-span-2">
              <Input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </Field>
          </>
        )}

        {step === 1 && (
          <>
            <div
              className={`grid gap-4 rounded-xl border border-neutral-200 p-4 dark:border-neutral-800 sm:col-span-2 sm:grid-cols-2 ${ACCENT_SOFT}`}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 sm:col-span-2">
                Starts
              </p>
              <Field label="Date">
                <Input
                  required
                  type="date"
                  value={form.startDate}
                  onChange={(e) => {
                    set("startDate", e.target.value);
                    console.log(e.target.value);
                  }}
                />
              </Field>
              <Field label="Time">
                <Input
                  required
                  type="time"
                  value={form.startTime}
                  onChange={(e) => set("startTime", e.target.value)}
                />
              </Field>
            </div>

            <div className="grid gap-4 rounded-xl border border-neutral-200 p-4 dark:border-neutral-800 sm:col-span-2 sm:grid-cols-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 sm:col-span-2">
                Ends
              </p>
              <Field label="Date">
                <Input
                  required
                  type="date"
                  min={form.startDate}
                  value={form.endDate}
                  onChange={(e) => set("endDate", e.target.value)}
                />
              </Field>
              <Field label="Time">
                <Input
                  required
                  type="time"
                  value={form.endTime}
                  onChange={(e) => set("endTime", e.target.value)}
                />
              </Field>
            </div>

            <Field label="Guests">
              <Input
                required
                type="number"
                min={1}
                value={form.guests}
                onChange={(e) => set("guests", e.target.value)}
              />
            </Field>
            <Field label="Event">
              <Select
                value={form.eventType}
                onChange={(e) => set("eventType", e.target.value)}
              >
                {[
                  "Lunch",
                  "Dinner",
                  "Birthday",
                  "Corporate",
                  "Anniversary",
                ].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </Select>
            </Field>
          </>
        )}

        {step === 2 && (
          <>
            <div
              className={`rounded-xl border border-neutral-200 p-4 text-sm dark:border-neutral-800 sm:col-span-2 ${ACCENT_SOFT}`}
            >
              <span className="font-semibold">{form.customerName}</span>
              <span className="text-neutral-500">
                {" "}
                · {form.guests} guests · {form.eventType}
              </span>
              <div className="mt-1 text-neutral-600 dark:text-neutral-400">
                {form.startDate} {form.startTime} → {form.endDate}{" "}
                {form.endTime}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:col-span-2 sm:grid-cols-3 lg:grid-cols-5">
              {tables?.map((t) => {
                const selected = selectedTables.includes(t.id ?? 0);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggleTable(t.id ?? 0)}
                    className={`relative rounded-xl border-2 p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                      selected
                        ? `${ACCENT_BORDER} ${ACCENT_SOFT}`
                        : "border-neutral-200 dark:border-neutral-800"
                    }`}
                  >
                    {selected && (
                      <span
                        className={`absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full text-xs ${ACCENT_BG}`}
                      >
                        ✓
                      </span>
                    )}
                    <div className="font-semibold">{t.label}</div>
                    <div className="text-sm text-neutral-500">
                      {t.seats} seats
                    </div>
                  </button>
                );
              })}
            </div>

            <Field label="Notes" className="sm:col-span-2">
              <Textarea
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
              />
            </Field>
          </>
        )}

        <div className="flex justify-between border-t border-neutral-200 pt-4 dark:border-neutral-800 sm:col-span-2">
          {step > 0 ? (
            <Button type="button" onClick={back}>
              Back
            </Button>
          ) : (
            <span />
          )}
          <Button type="submit">
            {step === 2 ? "Save reservation" : "Next"}
          </Button>
        </div>
      </form>
    </Panel>
  );
}
