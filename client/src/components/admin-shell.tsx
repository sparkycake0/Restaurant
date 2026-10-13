"use client";
import { Bell, CalendarDays, Home, ImageIcon, LayoutGrid, Lock, LogOut, Menu, ShoppingBag, SlidersHorizontal, User, Utensils, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Logo } from "@/components/logo";
import { ButtonLink } from "@/components/ui";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: Home }, { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/reservations", label: "Reservations", icon: CalendarDays }, { href: "/admin/tables", label: "Floor plan", icon: LayoutGrid },
  { href: "/admin/menu", label: "Menu", icon: Utensils }, { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/customers", label: "Customers", icon: User }, { href: "/admin/staff", label: "Staff", icon: Lock },
  { href: "/admin/settings", label: "Settings", icon: SlidersHorizontal },
];
const TITLES: Record<string, string> = {
  "/admin": "Dashboard", "/admin/orders": "Orders", "/admin/orders/new": "New order", "/admin/reservations": "Reservations", "/admin/reservations/new": "New reservation",
  "/admin/tables": "Floor plan", "/admin/menu": "Menu", "/admin/gallery": "Gallery", "/admin/customers": "Customers", "/admin/staff": "Staff", "/admin/settings": "Settings",
};

// Sidebar (desktop) / slide-in menu (phone) + top bar around every staff page.
export function AdminShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);
  const active = (href: string) => (href === "/admin" ? path === "/admin" : path.startsWith(href));

  const sidebar = (
    <div className="flex h-full flex-col bg-ink">
      <div className="flex items-center gap-3 px-6 pb-6 pt-6">
        <Logo size={44} />
        <div><p className="font-display text-[17px] leading-tight text-cream">Your Restaurant</p><p className="text-[12.5px] font-medium text-gold">Staff panel</p></div>
      </div>
      <nav className="flex-1 space-y-1 px-4" aria-label="Admin">
        {NAV.map(({ href, label, icon: I }) => (
          <Link key={href} href={href} className={cn("relative flex items-center gap-3.5 rounded-xl px-4 py-3 text-[15px] transition-colors", active(href) ? "bg-deep font-semibold text-cream" : "text-cream/70 hover:bg-white/5 hover:text-cream")}>
            {active(href) && <span className="absolute left-0 top-2.5 h-6 w-1 rounded bg-gold" />}
            <I size={20} className={active(href) ? "text-gold" : ""} />{label}
          </Link>
        ))}
      </nav>
      <div className="m-4 flex items-center gap-3 border-t border-cream/10 px-2 pt-5">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold text-sm font-bold text-ink">AD</span>
        <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-cream">Admin</p><p className="text-xs text-cream/55">Staff</p></div>
        <Link href="/admin/login" aria-label="Log out" className="grid h-9 w-9 place-items-center rounded-full text-cream/60 hover:bg-white/10 hover:text-cream"><LogOut size={18} /></Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh lg:pl-[260px]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] lg:block">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[280px]">{sidebar}</div>
          <button onClick={() => setOpen(false)} aria-label="Close menu" className="absolute left-[292px] top-4 grid h-10 w-10 place-items-center rounded-full bg-black/60 text-white"><X /></button>
        </div>
      )}
      <header className="sticky top-0 z-20 flex h-[68px] items-center gap-3 border-b border-line bg-card/95 px-4 backdrop-blur sm:px-8 lg:h-[76px]">
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/5 lg:hidden"><Menu /></button>
        <h1 className="font-display flex-1 text-2xl text-cream sm:text-[28px]">{TITLES[path] ?? "Admin"}</h1>
        <span className="relative hidden h-10 w-10 place-items-center sm:grid"><Bell size={22} /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger" /></span>
        <ButtonLink href="/admin/orders/new" variant="gold" size="sm" className="sm:h-11 sm:px-5 sm:text-[14.5px]">+ New order</ButtonLink>
      </header>
      <main className="p-4 sm:p-8">{children}</main>
    </div>
  );
}
