"use client";
import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Modal({ open, onClose, title, children, className, side }: { open: boolean; onClose: () => void; title?: string; children: ReactNode; className?: string; side?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className={cn("fixed inset-0 z-50 flex bg-black/70 backdrop-blur-sm", side ? "justify-end" : "items-end justify-center sm:items-center sm:p-4")} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={title}
        className={cn("relative max-h-[92dvh] w-full overflow-y-auto border border-line bg-card p-6 shadow-2xl sm:p-8",
          side ? "h-dvh max-h-none max-w-md rounded-none border-y-0 border-r-0" : "max-w-xl rounded-t-3xl sm:rounded-3xl", className)}>
        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-white/5 hover:text-fg"><X size={20} /></button>
        {title && <h2 className="mb-5 pr-8 font-display text-2xl text-cream sm:text-3xl">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
