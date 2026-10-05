"use client";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Chip, Photo } from "@/components/ui";
import type { GalleryImage } from "@/data/types";
import { cn } from "@/lib/utils";

const RATIOS = ["aspect-[4/5]", "aspect-square", "aspect-[3/4]", "aspect-[4/3]"];

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const cats = useMemo(() => ["All", ...Array.from(new Set(images.map((i) => i.category)))], [images]);
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState<number | null>(null);
  const list = useMemo(() => images.filter((i) => cat === "All" || i.category === cat), [images, cat]);
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + list.length) % list.length)), [list.length]);

  useEffect(() => {
    if (open === null) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(null); if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open, step]);

  return (
    <>
      <div className="no-scrollbar -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        {cats.map((c) => <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>)}
      </div>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 lg:gap-6">
        {list.map((img, i) => (
          <button key={img.id} type="button" onClick={() => setOpen(i)} className="group relative mb-4 block w-full overflow-hidden rounded-2xl text-left lg:mb-6" aria-label={`Open ${img.caption}`}>
            <div className={cn("w-full", RATIOS[i % RATIOS.length])}><Photo src={img.image} alt={img.caption} tone={i} label={img.caption} className="transition-transform duration-500 group-hover:scale-105" /></div>
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10 text-sm font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">{img.caption}</span>
          </button>
        ))}
      </div>
      {open !== null && list[open] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={() => setOpen(null)} role="dialog" aria-modal="true" aria-label={list[open].caption}>
          <button className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white" onClick={() => setOpen(null)} aria-label="Close"><X /></button>
          <button className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous"><ChevronLeft /></button>
          <button className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next"><ChevronRight /></button>
          <figure className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <div className="aspect-[4/3] overflow-hidden rounded-2xl"><Photo src={list[open].image} alt={list[open].caption} tone={open} /></div>
            <figcaption className="mt-4 text-center text-white"><span className="font-display text-xl">{list[open].caption}</span><span className="ml-3 text-sm text-white/60">{list[open].category}</span></figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
