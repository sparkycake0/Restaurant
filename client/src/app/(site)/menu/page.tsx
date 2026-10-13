import type { Metadata } from "next";
import { FoodCard } from "@/components/food-card";
import { Container, PageHeader } from "@/components/page-header";
import { menuItems } from "@/data/menu";

export const metadata: Metadata = { title: "Menu" };

export default function MenuPage() {
  // TODO(api): replace menuItems with the foods from your server (foodService.getAll)
  return (
    <>
      <PageHeader title="Our menu" sub="Seasonal dishes, cooked fresh every day." />
      <Container className="py-12 sm:py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {menuItems.map((f, i) => (
            <FoodCard key={f.id} food={f} tone={i} />
          ))}
        </div>
      </Container>
    </>
  );
}
