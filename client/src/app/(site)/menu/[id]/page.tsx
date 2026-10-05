import { ChevronRight, Clock, Leaf, StickyNote, User } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FoodCard } from "@/components/food-card";
import { Container } from "@/components/page-header";
import { ItemActions } from "@/components/item-actions";
import { Photo, Pill } from "@/components/ui";
import { menuItems } from "@/data/menu";
import { settings } from "@/data/settings";
import { money } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: menuItems.find((f) => f.id === id)?.name ?? "Dish" };
}

export default async function MenuItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const food = menuItems.find((f) => f.id === id);
  if (!food) notFound();
  const others = menuItems.filter((f) => f.id !== food.id);
  const related = others.filter((f) => f.category === food.category).concat(others.filter((f) => f.category !== food.category)).slice(0, 3);
  const facts = [
    { icon: Clock, label: "Prep time", value: food.prepTime ?? "15-20 minutes" }, { icon: User, label: "Serves", value: food.serves ?? "1 person" },
    { icon: Leaf, label: "Dietary", value: food.tags.join(", ") || "-" }, { icon: StickyNote, label: "Allergens", value: food.allergens ?? "-" },
  ];
  return (
    <Container className="py-8 sm:py-12">
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/menu" className="hover:text-fg">Menu</Link><ChevronRight size={14} /><span>{food.category}</span><ChevronRight size={14} /><span className="font-bold text-cream">{food.name}</span>
      </nav>
      <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <div>
          <div className="aspect-[6/5] overflow-hidden rounded-[22px]"><Photo src={food.image} alt={food.name} /></div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {[1, 2, 3].map((n, i) => <div key={n} className={`aspect-[8/5] overflow-hidden rounded-[14px] ${i === 0 ? "ring-2 ring-gold" : ""}`}><Photo src={food.image} tone={n} /></div>)}
          </div>
        </div>
        <div>
          <div className="flex flex-wrap gap-2"><Pill kind="gold">{food.category}</Pill>{food.tags.map((t) => <Pill key={t} kind="green">{t}</Pill>)}</div>
          <h1 className="font-display mt-4 text-4xl leading-tight text-cream sm:text-[46px]">{food.name}</h1>
          <p className="mt-3 text-3xl font-bold text-gold-text">{money(food.price)}</p>
          <p className="mt-5 text-[17px] leading-relaxed text-muted">{food.description}. Prepared to order with seasonal ingredients and finished at the pass.</p>
          <dl className="mt-7 grid gap-5 border-y border-line py-7 sm:grid-cols-2">
            {facts.map(({ icon: I, label, value }) => (
              <div key={label} className="flex items-center gap-3.5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold-soft text-gold-text"><I size={20} /></span>
                <div><dt className="text-[13px] text-muted">{label}</dt><dd className="font-semibold">{value}</dd></div>
              </div>
            ))}
          </dl>
          <p className={`mt-6 flex items-center gap-2 font-semibold ${food.available ? "text-ok" : "text-danger"}`}><span className={`h-2 w-2 rounded-full ${food.available ? "bg-ok" : "bg-danger"}`} />{food.available ? "Available today" : "Sold out today"}</p>
          <div className="mt-6"><ItemActions food={food} freeOver={settings.delivery.freeOver} /></div>
        </div>
      </div>
      <h2 className="font-display mb-8 mt-16 text-3xl text-cream sm:text-4xl">You might also like</h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">{related.map((f, i) => <FoodCard key={f.id} food={f} tone={i + 2} />)}</div>
    </Container>
  );
}
