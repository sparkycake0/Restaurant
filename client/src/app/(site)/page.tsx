import { ChevronRight, Truck, Users, Utensils } from "lucide-react";
import Link from "next/link";
import { FoodCard } from "@/components/food-card";
import { Container } from "@/components/page-header";
import { ButtonLink, Card, Photo, SectionTitle } from "@/components/ui";
import { galleryImages } from "@/data/gallery";
import { menuItems } from "@/data/menu";

const WAYS = [
  { icon: Utensils, title: "Dine in", text: "Browse the menu and visit us in the dining room.", href: "/menu", cta: "Browse the menu" },
  { icon: Truck, title: "Delivery", text: "Hot food at your door in 35-50 minutes.", href: "/delivery", cta: "Order delivery" },
  { icon: Users, title: "Catering & events", text: "Tell us about your event and we handle the food.", href: "/catering", cta: "Plan an event" },
];

export default function HomePage() {
  // TODO(api): load the menu from your server instead of the sample data
  const popular = menuItems.slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="bg-hero">
        <Container className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:py-20">
          <div>
            <h1 className="font-display text-[42px] leading-[1.08] text-cream sm:text-6xl">
              Food worth
              <br />
              gathering around.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-cream/80 sm:text-xl">
              Fresh seasonal cooking for your table, your doorstep, and your next big event.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/menu" variant="gold" size="lg">View menu</ButtonLink>
              <ButtonLink href="/catering" variant="outlineLight" size="lg">Book catering</ButtonLink>
            </div>
          </div>
          <div className="grid grid-cols-[1.7fr_1fr] grid-rows-2 gap-3 sm:gap-4">
            <div className="row-span-2 min-h-[260px] overflow-hidden rounded-[22px] sm:min-h-[400px]">
              <Photo src="/images/pasta-truffle.svg" alt="Truffle tagliatelle" />
            </div>
            <div className="min-h-[124px] overflow-hidden rounded-[22px]">
              <Photo src="/images/burrata.svg" alt="Burrata and tomato" />
            </div>
            <div className="min-h-[124px] overflow-hidden rounded-[22px]">
              <Photo src="/images/tiramisu.svg" alt="Tiramisu" />
            </div>
          </div>
        </Container>
      </section>

      {/* Three ways */}
      <section className="py-16 sm:py-24">
        <Container>
          <SectionTitle center title="Three ways to enjoy us" sub="Pick what suits your day - we take care of the rest." />
          <div className="grid gap-5 md:grid-cols-3 md:gap-9">
            {WAYS.map(({ icon: Icon, title, text, href, cta }) => (
              <Card key={title} className="flex flex-col p-8">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-gold-soft text-gold-text">
                  <Icon size={26} />
                </span>
                <h3 className="font-display mt-6 text-2xl text-cream">{title}</h3>
                <p className="mt-3 flex-1 leading-relaxed text-muted">{text}</p>
                <Link href={href} className="mt-8 inline-flex items-center gap-1 font-bold text-cream hover:text-gold-text">
                  {cta}
                  <ChevronRight size={18} />
                </Link>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Popular */}
      <section className="pb-16 sm:pb-24">
        <Container>
          <SectionTitle title="Popular right now" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((f, i) => (
              <FoodCard key={f.id} food={f} tone={i} />
            ))}
          </div>
        </Container>
      </section>

      {/* Gallery */}
      <section className="pb-16 sm:pb-24">
        <Container>
          <SectionTitle title="Moments from our tables" />
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
            {galleryImages.slice(0, 4).map((g) => (
              <div key={g.id} className="aspect-[3/4] overflow-hidden rounded-[18px]">
                <Photo src={g.image} alt={g.caption} />
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
