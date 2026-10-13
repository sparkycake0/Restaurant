"use client";
import { Check } from "lucide-react";
import { useState } from "react";
import { Button, Field, Input, Select, Textarea } from "@/components/ui";

const SUBJECTS = ["General question", "Reservation", "Catering", "Delivery issue", "Feedback"];

export function ContactForm() {
  const [f, setF] = useState({ name: "", email: "", phone: "", subject: SUBJECTS[0], message: "" });
  const [sent, setSent] = useState(false);
  const set = (k: keyof typeof f, v: string) => setF((s) => ({ ...s, [k]: v }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: send `f` to your backend here.
    console.log("Contact form:", f);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="py-10 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#163828] text-ok"><Check size={32} /></span>
        <h3 className="font-display mt-5 text-2xl text-cream">Message sent</h3>
        <p className="mt-2 text-muted">Thank you! We will get back to you as soon as we can.</p>
      </div>
    );
  }
  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <Field label="Your name"><Input value={f.name} onChange={(e) => set("name", e.target.value)} required autoComplete="name" /></Field>
      <Field label="Email"><Input type="email" value={f.email} onChange={(e) => set("email", e.target.value)} required autoComplete="email" /></Field>
      <Field label="Phone (optional)"><Input type="tel" value={f.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" /></Field>
      <Field label="Subject"><Select value={f.subject} onChange={(e) => set("subject", e.target.value)}>{SUBJECTS.map((s) => <option key={s}>{s}</option>)}</Select></Field>
      <Field label="Message" className="sm:col-span-2"><Textarea value={f.message} onChange={(e) => set("message", e.target.value)} placeholder="Write your message here..." className="min-h-[150px]" required minLength={5} /></Field>
      <div className="sm:col-span-2"><Button type="submit" size="lg">Send message</Button></div>
    </form>
  );
}
