import Link from "next/link";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "@/components/icons";
import { Logo } from "@/components/logo";
import { settings } from "@/data/settings";

export function Footer() {
  const today = settings.hours[0];
  return (
    <footer className="bg-ink">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.3fr_1fr_1.2fr_1.2fr] lg:py-16">
        <div>
          <div className="flex items-center gap-3"><Logo size={44} /><span className="font-display text-[22px] text-cream">{settings.name}</span></div>
          <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-cream/70">Seasonal cooking for your table, your doorstep and your biggest celebrations.</p>
        </div>
        <div>
          <h3 className="font-display mb-4 text-base text-gold">Explore</h3>
          <ul className="space-y-2.5 text-[14.5px] text-cream/75">
            {[["/menu", "Menu"], ["/catering", "Catering"], ["/delivery", "Delivery"], ["/gallery", "Gallery"], ["/info", "Info & hours"]].map(([h, l]) => (
              <li key={h}><Link href={h} className="hover:text-cream">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display mb-4 text-base text-gold">Visit us</h3>
          <ul className="space-y-2.5 text-[14.5px] text-cream/75">
            <li>{settings.address}</li>
            <li>Open daily {today?.from} - {today?.to}</li>
            <li><a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:text-cream">{settings.phone}</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-display mb-4 text-base text-gold">Follow us</h3>
          <ul className="space-y-2.5 text-[14.5px] text-cream/75">
            <li>{settings.socials.instagram}</li><li>{settings.socials.facebook}</li><li>{settings.socials.tiktok}</li>
          </ul>
          <div className="mt-5 flex gap-3">
            {[InstagramIcon, FacebookIcon, TikTokIcon].map((I, i) => (
              <span key={i} className="grid h-9 w-9 place-items-center rounded-full border border-cream/30 text-cream"><I width={18} height={18} /></span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-cream/15">
        <div className="mx-auto flex max-w-[1200px] flex-wrap justify-between gap-2 px-4 py-6 text-[13px] text-cream/55 sm:px-6">
          <span>&copy; {new Date().getFullYear()} {settings.name}. All rights reserved.</span><span>Privacy &nbsp;-&nbsp; Terms</span>
        </div>
      </div>
    </footer>
  );
}
