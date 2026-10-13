"use client";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { ButtonLink } from "@/components/ui";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" }, { href: "/menu", label: "Menu" }, { href: "/catering", label: "Catering" },
  { href: "/delivery", label: "Delivery" }, { href: "/gallery", label: "Gallery" }, { href: "/info", label: "Info" }, { href: "/contact", label: "Contact" },
];

export function Navbar({ name }: { name: string }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-card/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6 lg:h-[84px]">
        <Link href="/" className="flex items-center gap-3" aria-label={name}>
          <Logo size={44} />
          <span className="font-display text-xl text-cream sm:text-[22px]">{name}</span>
        </Link>
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={cn("relative py-2 text-[15px] transition-colors hover:text-cream", active(l.href) ? "font-semibold text-cream" : "font-medium text-fg")}>
              {l.label}
              {active(l.href) && <span className="absolute inset-x-0 -bottom-[2px] h-[3px] rounded bg-gold" />}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ButtonLink href="/delivery" className="hidden lg:inline-flex" variant="primary">
            Order now
          </ButtonLink>
          <button type="button" onClick={() => setOpen((v) => !v)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} className="grid h-10 w-10 place-items-center rounded-full text-fg hover:bg-white/5 lg:hidden">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-line bg-card px-4 pb-5 pt-2 lg:hidden" aria-label="Mobile">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={cn("flex items-center justify-between border-b border-line py-3.5 text-base", active(l.href) ? "font-semibold text-gold-text" : "text-fg")}>{l.label}</Link>
          ))}
          <ButtonLink href="/delivery" className="mt-4 w-full" size="lg">Order now</ButtonLink>
        </nav>
      )}
    </header>
  );
}
