"use client";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { FoodCard } from "@/components/food-card";
import { Chip, Empty, Input } from "@/components/ui";
import { categories, menuItems as foods } from "@/data/menu";

// Search box + category buttons + the grid of dishes.
export function MenuBrowser() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const list = useMemo(
    () => foods.filter((f) => (cat === "all" || f.category === cat) && (!q || f.name.toLowerCase().includes(q.toLowerCase()) || f.description.toLowerCase().includes(q.toLowerCase()))),
    [q, cat],
  );
  return (
    <>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative w-full lg:w-[360px]">
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search dishes..." className="h-12 rounded-full pl-11" aria-label="Search dishes" />
        </div>
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          <Chip active={cat === "all"} onClick={() => setCat("all")}>All</Chip>
          {categories.map((c) => <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>)}
        </div>
      </div>
      {list.length === 0 ? <Empty>No dishes match your search.</Empty> : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {list.map((f) => <FoodCard key={f.id} food={f} tone={foods.indexOf(f)} />)}
        </div>
      )}
      <p className="mt-10 text-center text-sm text-muted">Showing {list.length} of {foods.length} dishes</p>
    </>
  );
}
