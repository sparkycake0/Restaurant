import { TableShape } from "@/components/floor";
import type { DiningTable } from "@/data/types";

const T = (id: string, shape: DiningTable["shape"], seats: number, x: number, y: number, w?: number): DiningTable => ({ id, label: id.toUpperCase(), shape, seats, x, y, w, active: true });

/** Decorative floor plan used on the home page. */
export function MiniFloor() {
  const kw = { sr: 8, gap: 6, sub: false } as const;
  return (
    <svg viewBox="0 0 540 300" className="h-auto w-full" role="img" aria-label="Live floor plan preview">
      <TableShape table={T("t1", "round", 4, 70, 80)} state="free" radius={28} {...kw} />
      <TableShape table={T("t2", "round", 4, 200, 80)} state="sel" radius={28} {...kw} />
      <TableShape table={T("t3", "rect", 6, 400, 80, 110)} state="res" {...kw} />
      <TableShape table={T("t4", "rect", 6, 110, 220, 110)} state="free" {...kw} />
      <TableShape table={T("t5", "round", 4, 300, 220)} state="sel" radius={28} {...kw} />
      <TableShape table={T("t6", "round", 4, 450, 220)} state="res" radius={28} {...kw} />
    </svg>
  );
}
