import type { Metadata } from "next";
import { DeliveryOrder } from "@/components/delivery-order";
import { Container } from "@/components/page-header";
import { Pill } from "@/components/ui";
import { settings } from "@/data/settings";

export const metadata: Metadata = { title: "Order delivery" };

export default function DeliveryPage() {
  const d = settings.delivery;
  return (
    <>
      <section className="border-b border-line bg-raised">
        <Container className="flex flex-wrap items-end justify-between gap-6 py-12 sm:py-14">
          <div>
            <h1 className="font-display text-4xl text-cream sm:text-5xl">Order delivery</h1>
            <p className="mt-3 text-base text-muted sm:text-lg">Pick your dishes, we bring them to your door.</p>
          </div>
          <div className="flex flex-wrap gap-2"><Pill kind="gold" className="px-4 py-2 text-[13.5px]">Delivery {d.eta} min</Pill><Pill kind="green" className="px-4 py-2 text-[13.5px]">Free over {d.freeOver} &euro;</Pill></div>
        </Container>
      </section>
      <Container className="py-8 sm:py-12">
        {d.enabled ? <DeliveryOrder /> : <p className="rounded-2xl border border-line p-10 text-center text-muted">Delivery is currently unavailable. Please call us to order.</p>}
      </Container>
    </>
  );
}
