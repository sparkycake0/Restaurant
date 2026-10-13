import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/page-header";
import { ContactForm } from "@/components/contact-form";
import { Card, Photo } from "@/components/ui";
import { settings as s } from "@/data/settings";

export const metadata: Metadata = { title: "Contact" };
export default function ContactPage() {
  const rows = [
    { icon: MapPin, label: "Address", value: s.address }, { icon: Phone, label: "Phone", value: s.phone, href: `tel:${s.phone.replace(/\s/g, "")}` },
    { icon: Mail, label: "Email", value: s.email, href: `mailto:${s.email}` }, { icon: Clock, label: "Open", value: `Daily ${s.hours[0]?.from} - ${s.hours[0]?.to}` },
  ];
  return (
    <>
      <PageHeader title="Contact us" sub="Questions, feedback or special requests - we would love to hear from you." />
      <Container className="grid gap-6 py-10 sm:py-14 lg:grid-cols-[1.35fr_1fr] lg:gap-8">
        <Card className="p-6 sm:p-8"><h2 className="font-display mb-6 text-2xl text-cream">Send us a message</h2><ContactForm /></Card>
        <div className="space-y-6">
          <Card className="p-6 sm:p-8">
            <h2 className="font-display mb-6 text-2xl text-cream">Reach us directly</h2>
            <ul className="space-y-5">
              {rows.map(({ icon: I, label, value, href }) => (
                <li key={label} className="flex items-center gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold-soft text-gold-text"><I size={20} /></span>
                  <div className="min-w-0"><p className="text-[12.5px] text-muted">{label}</p>{href ? <a href={href} className="break-words font-semibold hover:text-gold-text">{value}</a> : <p className="font-semibold">{value}</p>}</div>
                </li>
              ))}
            </ul>
          </Card>
          <div className="relative aspect-[16/7] overflow-hidden rounded-[18px]"><Photo tone={3} label="Map" /><span className="absolute inset-0 m-auto grid h-10 w-10 place-items-center rounded-full bg-[#1f3d36] text-cream"><MapPin size={20} /></span></div>
        </div>
      </Container>
    </>
  );
}
