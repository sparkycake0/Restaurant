"use client";
import { Check, ChevronDown, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Option<T> = { value: T; label: string };

type MultiSelectProps<T extends string | number> = {
  options: Option<T>[];
  value: T[]; // selected values
  onChange: (value: T[]) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
};

// A select where you can pick more than one option.
// Selected options show as chips, the list opens on click.
export function MultiSelect<T extends string | number>({
  options,
  value,
  onChange,
  placeholder = "Select...",
  required,
  className,
}: MultiSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  // close the list on outside click or Escape
  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) =>
      e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const toggle = (v: T) =>
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  const selected = options.filter((o) => value.includes(o.value));

  return (
    <div ref={box} className={cn("relative", className)}>
      {/* the box you click (the whole area opens the list) */}
      <div
        onClick={() => setOpen(!open)}
        className={cn(
          "flex min-h-11 w-full cursor-pointer items-center gap-2 rounded-[10px] border bg-field px-2.5 py-1.5 transition-colors",
          open ? "border-gold" : "border-border focus-within:border-gold",
        )}
      >
        <div className="flex flex-1 flex-wrap gap-1.5">
          {selected.length === 0 && (
            <span className="px-1.5 text-[15px] text-muted">{placeholder}</span>
          )}

          {selected.map((o) => (
            <span
              key={o.value}
              className="inline-flex items-center gap-1.5 rounded-full bg-gold-soft py-1 pl-3 pr-1.5 text-sm font-medium text-gold-text"
            >
              {o.label}
              <button
                type="button"
                aria-label={`Remove ${o.label}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(o.value);
                }}
                className="grid h-5 w-5 place-items-center rounded-full hover:bg-white/10"
              >
                <X size={13} />
              </button>
            </span>
          ))}
        </div>

        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label="Show options"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-muted outline-none"
        >
          <ChevronDown
            size={18}
            className={cn("transition-transform", open && "rotate-180")}
          />
        </button>
      </div>

      {/* the list */}
      {open && (
        <div
          role="listbox"
          aria-multiselectable="true"
          className="absolute inset-x-0 top-full z-20 mt-2 max-h-60 overflow-y-auto rounded-xl border border-border bg-card p-1.5 shadow-xl"
        >
          {options.length === 0 && (
            <p className="px-3 py-2.5 text-sm text-muted">Nothing to select</p>
          )}

          {options.map((o) => {
            const on = value.includes(o.value);
            return (
              <button
                key={o.value}
                type="button"
                role="option"
                aria-selected={on}
                onClick={() => toggle(o.value)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[15px] transition-colors hover:bg-raised",
                  on && "bg-raised/60",
                )}
              >
                <span
                  className={cn(
                    "grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors",
                    on ? "border-gold bg-gold text-ink" : "border-border",
                  )}
                >
                  {on && <Check size={14} strokeWidth={3} />}
                </span>
                {o.label}
              </button>
            );
          })}
        </div>
      )}

      {/* invisible input so the browser can block the form when nothing is selected */}
      {required && (
        <input
          tabIndex={-1}
          aria-hidden
          required
          value={value.length ? "ok" : ""}
          onChange={() => {}}
          className="pointer-events-none absolute bottom-0 left-1/2 h-0 w-0 opacity-0"
        />
      )}
    </div>
  );
}
