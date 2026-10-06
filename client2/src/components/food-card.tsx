import Link from "next/link";
import { AddButton } from "@/components/add-button";
import { Card, Photo, Pill } from "@/components/ui";
import type { Food } from "@/data/types";
import { money } from "@/lib/utils";

export function FoodCard({ food, tone = 0 }: { food: Food; tone?: number }) {
  return (
    <Card className="flex flex-col p-3 transition-colors hover:border-border">
      <Link href={`/menu/${food.id}`} className="block flex-1" aria-label={`${food.name}, details`}>
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
          <Photo src={food.image} alt={food.name} tone={tone} label={food.name} />
          {!food.available ? (
            <div className="absolute inset-0 grid place-items-center bg-black/60 text-lg font-bold text-white">Sold out today</div>
          ) : (
            <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">{food.tags.slice(0, 2).map((t) => <Pill key={t} kind="tag">{t}</Pill>)}</div>
          )}
        </div>
        <div className="px-2.5 pt-4">
          <h3 className="font-display text-xl text-cream">{food.name}</h3>
          <p className="mt-1.5 line-clamp-2 min-h-[42px] text-sm leading-snug text-muted">{food.description}</p>
        </div>
      </Link>
      <div className="mt-4 flex items-center justify-between border-t border-line px-2.5 pt-4">
        <span className="text-xl font-bold">{money(food.price)}</span>
        <AddButton food={food} />
      </div>
    </Card>
  );
}
