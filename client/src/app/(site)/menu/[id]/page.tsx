import { notFound } from "next/navigation";
import { Container } from "@/components/page-header";
import { ButtonLink, Photo, Pill } from "@/components/ui";
import { menuItems } from "@/data/menu";
import { money } from "@/lib/utils";

export default async function FoodPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // TODO(api): load one food from your server instead of searching the sample data
  const food = menuItems.find((f) => f.id === Number(id));
  if (!food) notFound();

  return (
    <Container className="grid gap-10 py-12 sm:py-16 lg:grid-cols-2 lg:gap-16">
      <div className="aspect-[4/3] overflow-hidden rounded-[22px]">
        <Photo src={food.image} alt={food.name} label={food.name} />
      </div>
      <div>
        <Pill kind="gold">{food.category.name}</Pill>
        <h1 className="font-display mt-4 text-4xl text-cream sm:text-5xl">{food.name}</h1>
        <p className="mt-5 text-[17px] leading-relaxed text-muted">{food.description}</p>
        <p className="mt-6 text-3xl font-bold">{money(food.price)}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {food.available ? (
            <ButtonLink href="/delivery" size="lg">Order delivery</ButtonLink>
          ) : (
            <Pill kind="cancelled">Sold out today</Pill>
          )}
          <ButtonLink href="/menu" variant="outline" size="lg">Back to menu</ButtonLink>
        </div>
      </div>
    </Container>
  );
}
