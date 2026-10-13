"use client";
import { Check, X } from "lucide-react";
import { createContext, useContext, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ToastFn = (text: string, kind?: "ok" | "error") => void;
const ToastContext = createContext<ToastFn>(() => {});

// Small message that appears at the bottom of the screen. Use:  const toast = useToast();  toast("Saved");
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<{ id: number; text: string; kind: "ok" | "error" }[]>([]);

  const toast: ToastFn = (text, kind = "ok") => {
    const id = Date.now() + Math.random();
    setItems((l) => [...l, { id, text, kind }]);
    setTimeout(() => setItems((l) => l.filter((t) => t.id !== id)), 3000);
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4">
        {items.map((t) => (
          <div key={t.id} className={cn("flex items-center gap-3 rounded-full border px-5 py-3 text-sm font-medium shadow-xl", t.kind === "ok" ? "border-ok/40 bg-[#163828] text-[#7fd0a0]" : "border-danger/40 bg-[#3d1e19] text-[#f08a78]")}>
            {t.kind === "ok" ? <Check size={16} /> : <X size={16} />}
            {t.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
