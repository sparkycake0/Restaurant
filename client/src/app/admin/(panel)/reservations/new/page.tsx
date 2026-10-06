"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Panel } from "@/components/admin-shared";
import { Button, Field, Input, Select, Textarea } from "@/components/ui";
import { useToast } from "@/lib/toast";

export default function NewReservationPage() {
  const router = useRouter();
  const toast = useToast();
  const [form, setForm] = useState({ customerName: "", phone: "", email: "", date: "", time: "19:00", guests: "2", eventType: "Dinner", notes: "" });
  const set = (key: keyof typeof form, value: string) => setForm({ ...form, [key]: value });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // TODO(api): send `form` to your server
    toast("Reservation saved (sample only)");
    router.push("/admin/reservations");
  }

  return (
    <Panel title="New reservation">
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <Field label="Name"><Input required value={form.customerName} onChange={(e) => set("customerName", e.target.value)} /></Field>
        <Field label="Phone"><Input required type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
        <Field label="Email"><Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} /></Field>
        <Field label="Event">
          <Select value={form.eventType} onChange={(e) => set("eventType", e.target.value)}>
            {["Lunch", "Dinner", "Birthday", "Corporate", "Anniversary"].map((t) => <option key={t}>{t}</option>)}
          </Select>
        </Field>
        <Field label="Date"><Input required type="date" value={form.date} onChange={(e) => set("date", e.target.value)} /></Field>
        <Field label="Time"><Input required type="time" value={form.time} onChange={(e) => set("time", e.target.value)} /></Field>
        <Field label="Guests"><Input required type="number" min={1} value={form.guests} onChange={(e) => set("guests", e.target.value)} /></Field>
        <Field label="Notes" className="sm:col-span-2"><Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} /></Field>
        <div className="sm:col-span-2"><Button type="submit">Save reservation</Button></div>
      </form>
    </Panel>
  );
}
