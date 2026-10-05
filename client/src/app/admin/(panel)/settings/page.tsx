"use client";
import { useEffect, useState } from "react";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "@/components/icons";
import { Panel } from "@/components/admin-shared";
import { Button, Field, Input, Toggle } from "@/components/ui";
import { settings as sampleSettings } from "@/data/settings";
import type { Settings } from "@/data/types";
import { useToast } from "@/lib/toast";
import { useLocalStorage } from "@/lib/useLocalStorage";

const num = (v: string) => (v === "" ? 0 : Number(v));

export default function SettingsPage() {
  const toast = useToast();
  const [saved, setSaved, loaded] = useLocalStorage<Settings>("settings", sampleSettings);
  const [s, setS] = useState<Settings>(sampleSettings); // the form
  useEffect(() => { if (loaded) setS(saved); }, [loaded, saved]);

  // TODO: send the settings to your backend. (The public pages still read src/data/settings.ts.)
  const save = () => { setSaved(s); toast("Settings saved"); };
  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setS({ ...s, [k]: v });

  return (
    <form onSubmit={(e) => { e.preventDefault(); save(); }}>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <Panel title="Restaurant info" sub="Shown on the Info and Contact pages and in the footer">
            <div className="space-y-4">
              <Field label="Restaurant name"><Input value={s.name} onChange={(e) => set("name", e.target.value)} /></Field>
              <Field label="Address"><Input value={s.address} onChange={(e) => set("address", e.target.value)} /></Field>
              <div className="grid gap-4 sm:grid-cols-2"><Field label="Phone"><Input value={s.phone} onChange={(e) => set("phone", e.target.value)} /></Field><Field label="Email"><Input type="email" value={s.email} onChange={(e) => set("email", e.target.value)} /></Field></div>
            </div>
          </Panel>
          <Panel title="Opening hours">
            <ul className="space-y-3">
              {s.hours.map((h, i) => {
                const upd = (p: Partial<typeof h>) => set("hours", s.hours.map((x, j) => (j === i ? { ...x, ...p } : x)));
                return (
                  <li key={h.day} className="flex flex-wrap items-center gap-3">
                    <Toggle on={h.open} onChange={(v) => upd({ open: v })} label={`${h.day} open`} /><span className="w-28 font-semibold">{h.day}</span>
                    {h.open ? <div className="flex flex-1 items-center gap-2"><Input type="time" value={h.from} onChange={(e) => upd({ from: e.target.value })} className="h-10 min-w-[110px]" /><span className="text-muted">-</span><Input type="time" value={h.to} onChange={(e) => upd({ to: e.target.value })} className="h-10 min-w-[110px]" /></div> : <span className="text-muted">Closed</span>}
                  </li>
                );
              })}
            </ul>
          </Panel>
        </div>
        <div className="space-y-6">
          <Panel title="Delivery" sub="Used on the delivery page and checkout">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Delivery fee (EUR)"><Input type="number" step="0.5" min="0" value={s.delivery.fee} onChange={(e) => set("delivery", { ...s.delivery, fee: num(e.target.value) })} /></Field>
              <Field label="Free delivery over (EUR)"><Input type="number" min="0" value={s.delivery.freeOver} onChange={(e) => set("delivery", { ...s.delivery, freeOver: num(e.target.value) })} /></Field>
              <Field label="Minimum order (EUR)"><Input type="number" min="0" value={s.delivery.minOrder} onChange={(e) => set("delivery", { ...s.delivery, minOrder: num(e.target.value) })} /></Field>
              <Field label="Delivery radius (km)"><Input type="number" min="0" value={s.delivery.radiusKm} onChange={(e) => set("delivery", { ...s.delivery, radiusKm: num(e.target.value) })} /></Field>
              <Field label="Average time (min)"><Input value={s.delivery.eta} onChange={(e) => set("delivery", { ...s.delivery, eta: e.target.value })} /></Field>
              <div className="flex items-center justify-between gap-3 pt-6"><span className="font-semibold">Accept delivery orders</span><Toggle on={s.delivery.enabled} onChange={(v) => set("delivery", { ...s.delivery, enabled: v })} label="Accept delivery orders" /></div>
            </div>
          </Panel>
          <Panel title="Catering & reservations">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Minimum guests for catering"><Input type="number" min="1" value={s.catering.minGuests} onChange={(e) => set("catering", { ...s.catering, minGuests: num(e.target.value) })} /></Field>
              <Field label="Advance notice (days)"><Input type="number" min="0" value={s.catering.noticeDays} onChange={(e) => set("catering", { ...s.catering, noticeDays: num(e.target.value) })} /></Field>
              <Field label="Deposit (% of estimate)"><Input type="number" min="0" max="100" value={s.catering.depositPercent} onChange={(e) => set("catering", { ...s.catering, depositPercent: num(e.target.value) })} /></Field>
              <div className="flex items-center justify-between gap-3 pt-6"><span className="font-semibold">Require deposit</span><Toggle on={s.catering.requireDeposit} onChange={(v) => set("catering", { ...s.catering, requireDeposit: v })} label="Require deposit" /></div>
            </div>
          </Panel>
          <Panel title="Social links">
            <div className="space-y-4">
              {([["instagram", "Instagram", InstagramIcon], ["facebook", "Facebook", FacebookIcon], ["tiktok", "TikTok", TikTokIcon]] as const).map(([k, l, I]) => (
                <div key={k} className="flex items-end gap-3"><span className="mb-1 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold-soft text-gold-text"><I width={20} height={20} /></span>
                  <Field label={l} className="flex-1"><Input value={s.socials[k]} onChange={(e) => set("socials", { ...s.socials, [k]: e.target.value })} /></Field></div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
      <div className="sticky bottom-0 -mx-4 mt-6 border-t border-line bg-bg/95 p-4 backdrop-blur sm:-mx-8 sm:px-8"><Button type="submit" variant="gold" size="lg">Save changes</Button></div>
    </form>
  );
}
