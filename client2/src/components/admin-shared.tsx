"use client";
import type { ReactNode } from "react";
import { Card, Pill, type PillKind } from "@/components/ui";
import type { OrderStatus, OrderType, ReservationStatus } from "@/data/types";
import { ORDER_STATUS_LABEL, TYPE_LABEL, cn } from "@/lib/utils";

const TYPE_KIND: Record<OrderType, PillKind> = { delivery: "delivering", pickup: "gold", dine_in: "dine" };
export const OrderStatusPill = ({ status }: { status: OrderStatus }) => <Pill kind={status}>{ORDER_STATUS_LABEL[status]}</Pill>;
export const TypePill = ({ type }: { type: OrderType }) => <Pill kind={TYPE_KIND[type]}>{TYPE_LABEL[type]}</Pill>;
export const ResStatusPill = ({ status }: { status: ReservationStatus }) => <Pill kind={status}>{status[0].toUpperCase() + status.slice(1)}</Pill>;

export function TableWrap({ children, min = 640, className }: { children: ReactNode; min?: number; className?: string }) {
  return <Card className={cn("overflow-hidden", className)}><div className="overflow-x-auto"><table className="w-full text-left text-sm" style={{ minWidth: min }}>{children}</table></div></Card>;
}
export const Th = ({ children, className }: { children?: ReactNode; className?: string }) => <th className={cn("bg-raised px-4 py-3.5 text-[11.5px] font-bold uppercase tracking-wider text-muted", className)}>{children}</th>;
export const Td = ({ children, className }: { children?: ReactNode; className?: string }) => <td className={cn("border-t border-line px-4 py-3.5 align-middle", className)}>{children}</td>;

export function PageBar({ children }: { children: ReactNode }) {
  return <div className="mb-6 flex flex-wrap items-center gap-3">{children}</div>;
}
export function Loading() {
  return <div className="grid place-items-center py-24 text-muted">Loading...</div>;
}
export function Panel({ title, sub, children, className, action }: { title?: string; sub?: string; children: ReactNode; className?: string; action?: ReactNode }) {
  return (
    <Card className={cn("p-5 sm:p-6", className)}>
      {(title || action) && <div className="mb-4 flex items-start justify-between gap-3"><div>{title && <h2 className="font-display text-xl text-cream">{title}</h2>}{sub && <p className="mt-1 text-[13px] text-muted">{sub}</p>}</div>{action}</div>}
      {children}
    </Card>
  );
}

export function Tabs({ tabs, active, onChange }: { tabs: { id: string; label: string; href?: string }[]; active: string; onChange?: (id: string) => void }) {
  return (
    <div className="no-scrollbar mb-6 inline-flex max-w-full overflow-x-auto rounded-full bg-raised p-1" role="tablist">
      {tabs.map((t) => {
        const cls = cn("whitespace-nowrap rounded-full px-5 py-2.5 text-[14.5px] transition-colors", t.id === active ? "bg-primary font-bold text-cream" : "text-fg hover:text-cream");
        return t.href
          ? <a key={t.id} href={t.href} className={cls} role="tab">{t.label}</a>
          : <button key={t.id} type="button" role="tab" aria-selected={t.id === active} onClick={() => onChange?.(t.id)} className={cls}>{t.label}</button>;
      })}
    </div>
  );
}
