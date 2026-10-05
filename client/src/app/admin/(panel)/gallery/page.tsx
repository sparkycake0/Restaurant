"use client";
import { Check, Pencil, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { Button, Chip, Photo, Pill, Select } from "@/components/ui";
import { galleryCategories, galleryImages } from "@/data/gallery";
import type { GalleryImage } from "@/data/types";
import { useToast } from "@/lib/toast";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { cn, uid } from "@/lib/utils";

export default function GalleryAdminPage() {
  const toast = useToast();
  const [images, setImages] = useLocalStorage<GalleryImage[]>("gallery", galleryImages);
  const [cat, setCat] = useState("All");
  const [uploadCat, setUploadCat] = useState("Food");
  const [sel, setSel] = useState<string[]>([]);
  const [drag, setDrag] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const list = images.filter((i) => cat === "All" || i.category === cat);

  // Adds the chosen files. TODO: upload the files to your backend / Firebase and save the returned URL instead.
  function addFiles(files: FileList | File[]) {
    [...files].filter((f) => f.type.startsWith("image/")).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setImages((all) => [{ id: uid(), image: String(reader.result), caption: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "), category: uploadCat }, ...all]);
      reader.readAsDataURL(file);
    });
    toast("Image added");
  }
  const remove = (ids: string[]) => { setImages((all) => all.filter((i) => !ids.includes(i.id))); setSel((s) => s.filter((x) => !ids.includes(x))); toast("Deleted"); };
  const setCaption = (id: string, caption: string) => setImages((all) => all.map((i) => (i.id === id ? { ...i, caption } : i)));

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
        className={cn("rounded-[18px] border-2 border-dashed p-8 text-center transition-colors", drag ? "border-gold bg-gold-soft/40" : "border-border bg-card")}>
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-gold-soft text-gold-text"><Upload size={22} /></span>
        <p className="mt-3 text-[17px] font-bold text-cream">Drag images here or browse files</p>
        <p className="mt-1 text-[13px] text-muted">JPG, PNG or WebP</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Select value={uploadCat} onChange={(e) => setUploadCat(e.target.value)} className="w-40" aria-label="Category for new images">{galleryCategories.map((c) => <option key={c}>{c}</option>)}</Select>
          <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => e.target.files && addFiles(e.target.files)} />
          <Button variant="primary" onClick={() => input.current?.click()}>Browse files</Button>
        </div>
      </div>

      <div className="my-6 flex flex-wrap items-center gap-3">
        <div className="no-scrollbar flex flex-1 gap-2 overflow-x-auto">{["All", ...galleryCategories].map((c) => <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>)}</div>
        {sel.length > 0 && <><span className="text-sm font-bold">{sel.length} selected</span><Button variant="danger" size="sm" onClick={() => confirm(`Delete ${sel.length} image(s)?`) && remove(sel)}><Trash2 size={14} />Delete selected</Button></>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {list.map((img) => {
          const selected = sel.includes(img.id);
          return (
            <div key={img.id} className={cn("overflow-hidden rounded-2xl border bg-card", selected ? "border-gold ring-2 ring-gold" : "border-line")}>
              <div className="relative aspect-[4/3]">
                <Photo src={img.image} alt={img.caption} />
                <button onClick={() => setSel((s) => (selected ? s.filter((x) => x !== img.id) : [...s, img.id]))} aria-label={selected ? "Deselect" : "Select"} aria-pressed={selected} className={cn("absolute left-3 top-3 grid h-6 w-6 place-items-center rounded-md border", selected ? "border-gold bg-gold text-ink" : "border-border bg-card/90")}>{selected && <Check size={15} strokeWidth={3.5} />}</button>
                <button onClick={() => confirm("Delete this image?") && remove([img.id])} aria-label="Delete image" className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-card/95 text-danger hover:bg-card"><Trash2 size={16} /></button>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  {editing === img.id
                    ? <input autoFocus defaultValue={img.caption} className="w-full rounded-md border border-border bg-field px-2 py-1 text-sm outline-none focus:border-gold" onBlur={(e) => { setEditing(null); e.target.value.trim() && setCaption(img.id, e.target.value.trim()); }} onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()} />
                    : <p className="truncate text-sm font-semibold">{img.caption}</p>}
                  <button onClick={() => setEditing(img.id)} aria-label="Edit caption" className="shrink-0 text-muted hover:text-fg"><Pencil size={15} /></button>
                </div>
                <div className="mt-3"><Pill kind="gold" className="px-2.5 py-1 text-[11.5px]">{img.category}</Pill></div>
              </div>
            </div>
          );
        })}
      </div>
      {list.length === 0 && <p className="rounded-2xl border border-dashed border-border p-12 text-center text-muted">No images in this category yet.</p>}
    </div>
  );
}
