import {
  ChevronRight,
  Clock,
  Star,
  Truck,
  Users,
  Utensils,
  Check,
} from "lucide-react";
import Link from "next/link";
import { FoodCard } from "@/components/food-card";
import { Container } from "@/components/page-header";
import { MiniFloor } from "@/components/mini-floor";
import { ButtonLink, Card, Photo, SectionTitle } from "@/components/ui";
import { galleryImages } from "@/data/gallery";
import { menuItems } from "@/data/menu";
import { settings } from "@/data/settings";

const WAYS = [
  {
    icon: Utensils,
    title: "Dine in",
    text: "Reserve a table and enjoy the full menu in our dining room.",
    href: "/menu",
    cta: "Browse the menu",
  },
  {
    icon: Truck,
    title: "Delivery",
    text: "Hot food at your door in 35-50 minutes, packed with care.",
    href: "/delivery",
    cta: "Order delivery",
  },
  {
    icon: Users,
    title: "Catering & events",
    text: "Choose your tables, seat your guests and let us handle the food.",
    href: "/catering",
    cta: "Plan an event",
  },
];
const REVIEWS = [
  ["Best pasta in town, and the delivery arrived hot and on time.", "Ana M."],
  [
    "We booked catering for 60 guests. The seating plan made it effortless.",
    "Jovan K.",
  ],
  ["Warm atmosphere, honest food. Our Friday spot now.", "Lena P."],
];

export default function HomePage() {
  const shown = menuItems.filter((f) => f.featured).slice(0, 4);
  const today = settings.hours[0];
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
              Fresh seasonal cooking for your table, your doorstep, and your
              next big event.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/menu" variant="gold" size="lg">
                View menu
              </ButtonLink>
              <ButtonLink href="/catering" variant="outlineLight" size="lg">
                Book catering
              </ButtonLink>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-cream/85">
              <li className="flex items-center gap-2">
                <Clock size={18} className="text-gold" />
                Open daily {today?.from} - {today?.to}
              </li>
              <li className="flex items-center gap-2">
                <Truck size={18} className="text-gold" />
                Free delivery over {settings.delivery.freeOver} &euro;
              </li>
              <li className="flex items-center gap-2">
                <Users size={18} className="text-gold" />
                Events for {settings.catering.minGuests}-200 guests
              </li>
            </ul>
          </div>
          <div className="relative grid grid-cols-[1.7fr_1fr] grid-rows-2 gap-3 sm:gap-4">
            <div className="row-span-2 min-h-[260px] overflow-hidden rounded-[22px] sm:min-h-[400px]">
              <Photo
                src="/images/pasta-truffle.svg"
                alt="Truffle tagliatelle"
              />
            </div>
            <div className="min-h-[124px] overflow-hidden rounded-[22px]">
              <Photo src="/images/burrata.svg" alt="Burrata and tomato" />
            </div>
            <div className="min-h-[124px] overflow-hidden rounded-[22px]">
              <Photo src="/images/tiramisu.svg" alt="Tiramisu" />
            </div>
            <div className="absolute -bottom-5 left-2 flex items-center gap-3 rounded-2xl border border-line bg-card px-5 py-3.5 shadow-xl sm:-left-6">
              <Star className="text-gold" size={26} />
              <div>
                <p className="font-bold">4.9 rating</p>
                <p className="text-[13px] text-muted">1,200+ happy guests</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Three ways */}
      <section className="py-16 sm:py-24">
        <Container>
          <SectionTitle
            center
            title="Three ways to enjoy us"
            sub="Pick what suits your day - we take care of the rest."
          />
          <div className="grid gap-5 md:grid-cols-3 md:gap-9">
            {WAYS.map(({ icon: Icon, title, text, href, cta }) => (
              <Card key={title} className="flex flex-col p-8">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-gold-soft text-gold-text">
                  <Icon size={26} />
                </span>
                <h3 className="font-display mt-6 text-2xl text-cream">
                  {title}
                </h3>
                <p className="mt-3 flex-1 leading-relaxed text-muted">{text}</p>
                <Link
                  href={href}
                  className="mt-8 inline-flex items-center gap-1 font-bold text-cream hover:text-gold-text"
                >
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
          <SectionTitle
            title="Popular right now"
            action={
              <Link
                href="/menu"
                className="inline-flex items-center gap-1 text-[15px] font-bold hover:text-gold-text"
              >
                View full menu
                <ChevronRight size={18} />
              </Link>
            }
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {shown.map((f, i) => (
              <FoodCard key={f.id} food={f} tone={i} />
            ))}
          </div>
        </Container>
      </section>

      {/* Catering band */}
      <section className="bg-ink py-16 sm:py-20">
        <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display text-4xl leading-tight text-cream sm:text-[44px]">
              Hosting an event?
              <br />
              <span className="text-gold">Pick your own tables.</span>
            </h2>
            <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-cream/75">
              See which tables are free on your date, choose the ones you like
              and assign every guest a seat before you even arrive.
            </p>
            <ul className="mt-7 space-y-3">
              {[
                "Live table availability",
                "Assign every guest to a seat",
                "Confirmation within 24 hours",
              ].map((t) => (
                <li
                  key={t}
                  className="flex items-center gap-3 text-[15px] text-cream"
                >
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-gold text-ink">
                    <Check size={12} strokeWidth={3.5} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <ButtonLink
              href="/catering"
              variant="gold"
              size="lg"
              className="mt-9"
            >
              Plan your event
            </ButtonLink>
          </div>
          <Card className="rounded-[22px] p-5 sm:p-7">
            <p className="font-display text-lg text-cream">Live floor plan</p>
            <div className="mt-2">
              <MiniFloor />
            </div>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-muted">
              <span>&#9711; Available</span>
              <span className="text-gold">&#9676; Selected</span>
              <span>&#9679; Reserved</span>
            </div>
          </Card>
        </Container>
      </section>

      {/* Gallery */}
      <section className="py-16 sm:py-24">
        <Container>
          <SectionTitle
            title="Moments from our tables"
            action={
              <Link
                href="/gallery"
                className="inline-flex items-center gap-1 text-[15px] font-bold hover:text-gold-text"
              >
                Open the gallery
                <ChevronRight size={18} />
              </Link>
            }
          />
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-5">
            {galleryImages.slice(0, 5).map((g, i) => (
              <div
                key={g.id}
                className={`aspect-[3/4] overflow-hidden rounded-[18px] ${i === 4 ? "hidden md:block" : ""}`}
              >
                <Photo src={g.image} alt={g.caption} />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Reviews */}
      <section className="pb-16 sm:pb-24">
        <Container>
          <SectionTitle center title="Loved by our guests" />
          <div className="grid gap-5 md:grid-cols-3 md:gap-9">
            {REVIEWS.map(([q, a]) => (
              <Card key={a} className="flex flex-col p-7">
                <div className="flex gap-1 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={20} />
                  ))}
                </div>
                <p className="mt-5 flex-1 text-base leading-relaxed">{q}</p>
                <p className="mt-6 text-sm font-bold text-cream">{a}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-gold">
        <Container className="flex flex-col items-start justify-between gap-6 py-14 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-3xl text-ink sm:text-[40px] sm:leading-tight">
              Hungry? Order delivery in minutes.
            </h2>
            <p className="mt-2 text-[17px] text-ink/80">
              Pick your dishes, tell us where you are, we handle the rest.
            </p>
          </div>
          <ButtonLink
            href="/delivery"
            variant="primary"
            size="lg"
            className="shrink-0"
          >
            Start your order
          </ButtonLink>
        </Container>
      </section>
    </>
  );
}
