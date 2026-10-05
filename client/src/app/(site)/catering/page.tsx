import type { Metadata } from "next";
import { CateringPlanner } from "@/components/catering-planner";
import { Container } from "@/components/page-header";

export const metadata: Metadata = { title: "Catering & events" };
export default function CateringPage() {
  return (
    <>
      <section className="border-b border-line bg-raised">
        <Container className="py-12 sm:py-16">
          <h1 className="font-display text-4xl text-cream sm:text-5xl lg:text-[52px]">
            Plan your event
          </h1>
          <p className="mt-3 max-w-2xl text-base text-muted sm:text-lg">
            Choose your tables, seat your guests, and we will prepare the rest.
          </p>
        </Container>
      </section>
      <Container className="pb-16 pt-2 sm:pb-24">
        <CateringPlanner />
      </Container>
    </>
  );
}
