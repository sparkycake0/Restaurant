"use client";
import { useState } from "react";
import { Panel } from "@/components/admin-shared";
import { Button, Field, Input } from "@/components/ui";
import { settings as sample } from "@/data/settings";
import { useToast } from "@/lib/toast";

export default function SettingsPage() {
  const toast = useToast();
  // SAMPLE DATA as the starting values.
  // TODO(api): load the real settings with useQuery and use them as the starting values.
  const [s, setS] = useState(sample);

  function save() {
    // TODO(api): send `s` to your server
    toast("Settings saved (sample only)");
  }

  return (
    <div className="space-y-6">
      <Panel title="Restaurant">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name"><Input value={s.name} onChange={(e) => setS({ ...s, name: e.target.value })} /></Field>
          <Field label="Address"><Input value={s.address} onChange={(e) => setS({ ...s, address: e.target.value })} /></Field>
          <Field label="Phone"><Input value={s.phone} onChange={(e) => setS({ ...s, phone: e.target.value })} /></Field>
          <Field label="Email"><Input value={s.email} onChange={(e) => setS({ ...s, email: e.target.value })} /></Field>
        </div>
      </Panel>

      <Panel title="Delivery">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Delivery fee"><Input type="number" value={s.delivery.fee} onChange={(e) => setS({ ...s, delivery: { ...s.delivery, fee: Number(e.target.value) } })} /></Field>
          <Field label="Free delivery over"><Input type="number" value={s.delivery.freeOver} onChange={(e) => setS({ ...s, delivery: { ...s.delivery, freeOver: Number(e.target.value) } })} /></Field>
          <Field label="Minimum order"><Input type="number" value={s.delivery.minOrder} onChange={(e) => setS({ ...s, delivery: { ...s.delivery, minOrder: Number(e.target.value) } })} /></Field>
        </div>
      </Panel>

      <Button onClick={save}>Save settings</Button>
    </div>
  );
}
