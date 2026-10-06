"use client";
import { useState } from "react";
import { Button, Field, Input, Textarea } from "@/components/ui";
import { useToast } from "@/lib/toast";

export function CateringForm() {
  const toast = useToast();
  const [form, setForm] = useState({ name: "", phone: "", email: "", date: "", guests: "", notes: "" });
  const set = (key: keyof typeof form, value: string) => setForm({ ...form, [key]: value });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // TODO(api): send `form` to your server (reservation / catering request)
    toast("Request sent (sample only)");
  }

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <Field label="Name"><Input required value={form.name} onChange={(e) => set("name", e.target.value)} /></Field>
      <Field label="Phone"><Input required type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
      <Field label="Email"><Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} /></Field>
      <Field label="Number of guests"><Input required type="number" min={1} value={form.guests} onChange={(e) => set("guests", e.target.value)} /></Field>
      <Field label="Date"><Input required type="date" value={form.date} onChange={(e) => set("date", e.target.value)} /></Field>
      <Field label="Notes" className="sm:col-span-2"><Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} /></Field>
      <div className="sm:col-span-2"><Button type="submit" size="lg">Send request</Button></div>
    </form>
  );
}
