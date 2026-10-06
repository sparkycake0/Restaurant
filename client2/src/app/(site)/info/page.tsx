import { Accessibility, Baby, Car, CreditCard, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "@/components/icons";
import { Container, PageHeader } from "@/components/page-header";
import { Card, Photo } from "@/components/ui";
import { settings as s } from "@/data/settings";

export const metadata: Metadata = { title: "Info" };
export default function InfoPage() {
  const contact = [
    { icon: Phone, label: "Phone", value: s.phone }, { icon: Mail, label: "Email", value: s.email },
    { icon: InstagramIcon, label: "Instagram", value: s.socials.instagram }, { icon: FacebookIcon, label: "Facebook", value: s.socials.facebook }, { icon: TikTokIcon, label: "TikTok", value: s.socials.tiktok },
  ];
  const good = [
    { icon: Car, title: "Free parking", text: "Behind the building" }, { icon: Accessibility, title: "Accessible", text: "Step-free entrance" },
    { icon: CreditCard, title: "Cards & cash", text: "All major cards" }, { icon: Baby, title: "Kid friendly", text: "Highchairs available" },
  ];
  return (
    <>
      <PageHeader title="About the restaurant" sub="Who we are, where to find us, and when we are open." />
      <Container className="py-12 sm:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display text-3xl text-cream sm:text-4xl">Our story</h2>
            <p className="mt-5 text-[17px] leading-[1.75] text-muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <p className="mt-4 text-[17px] leading-[1.75] text-muted">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</p>
            <p className="mt-6 font-semibold text-gold-text">- The founders, placeholder text</p>
          </div>
          <div className="aspect-[7/5] overflow-hidden rounded-[22px]"><Photo src="/images/dining-room.svg" alt="Our dining room" /></div>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          <Card className="p-4">
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl"><Photo tone={3} label="Map" /><span className="absolute inset-0 m-auto grid h-10 w-10 place-items-center rounded-full bg-[#1f3d36] text-cream"><MapPin size={20} /></span></div>
            <div className="p-4">
              <h2 className="font-display text-2xl text-cream">Find us</h2>
              <ul className="mt-5 space-y-4 text-[15px]">
                <li className="flex gap-3"><MapPin size={20} className="mt-0.5 shrink-0 text-gold-text" />{s.address}</li>
                <li className="flex gap-3"><Car size={20} className="mt-0.5 shrink-0 text-gold-text" />Free parking behind the building</li>
                <li className="flex gap-3"><Accessibility size={20} className="mt-0.5 shrink-0 text-gold-text" />Wheelchair accessible entrance</li>
              </ul>
            </div>
          </Card>
          <Card className="p-7">
            <h2 className="font-display text-2xl text-cream">Opening hours</h2>
            <ul className="mt-5">
              {s.hours.map((h) => (
                <li key={h.day} className="flex justify-between border-b border-line py-3 text-[15px] last:border-0"><span>{h.day}</span><span className={h.open ? "font-semibold text-cream" : "text-muted"}>{h.open ? `${h.from} - ${h.to}` : "Closed"}</span></li>
              ))}
            </ul>
          </Card>
          <Card className="p-7 md:col-span-2 lg:col-span-1">
            <h2 className="font-display text-2xl text-cream">Get in touch</h2>
            <ul className="mt-5 space-y-5">
              {contact.map(({ icon: I, label, value }) => (
                <li key={label} className="flex items-center gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold-soft text-gold-text"><I width={20} height={20} /></span><div className="min-w-0"><p className="text-[12.5px] text-muted">{label}</p><p className="break-words font-semibold">{value}</p></div></li>
              ))}
            </ul>
          </Card>
        </div>

        <h2 className="font-display mb-8 mt-16 text-3xl text-cream sm:text-4xl">Good to know</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {good.map(({ icon: I, title, text }) => (
            <Card key={title} className="flex items-center gap-4 p-6"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-raised text-mint"><I size={24} /></span><div><p className="font-bold text-cream">{title}</p><p className="text-sm text-muted">{text}</p></div></Card>
          ))}
        </div>
      </Container>
    </>
  );
}
