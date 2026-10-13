import Link from "next/link";
import { Card, Photo } from "@/components/ui";
import type { Food } from "@/types";
import { money } from "@/lib/utils";

export function FoodCard({ food, tone = 0 }: { food: Food; tone?: number }) {
  return (
    <Link href={`/menu/${food.id}`}>
      <Card className="p-3 transition-colors hover:border-border">
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
          <Photo src={food.image} alt={food.name} tone={tone} label={food.name} />
          {!food.available && (
            <div className="absolute inset-0 grid place-items-center bg-black/60 text-lg font-bold text-white">Sold out today</div>
          )}
        </div>
        <div className="px-2.5 pt-4">
          <h3 className="font-display text-xl text-cream">{food.name}</h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-snug text-muted">{food.description}</p>
          <p className="mt-4 border-t border-line pt-4 text-xl font-bold">{money(food.price)}</p>
        </div>
      </Card>
    </Link>
  );
}
