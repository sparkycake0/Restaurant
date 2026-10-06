import { Instagram } from "lucide-react";
import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/page-header";
import { GalleryGrid } from "@/components/gallery-grid";
import { galleryImages } from "@/data/gallery";
import { settings } from "@/data/settings";

export const metadata: Metadata = { title: "Gallery" };
export default function GalleryPage() {
  return (
    <>
      <PageHeader title="Gallery" sub="A look at our kitchen, our tables and the moments we have shared." />
      <Container className="py-10 sm:py-14"><GalleryGrid images={galleryImages} /></Container>
      <section className="bg-hero">
        <Container className="flex flex-col items-start justify-between gap-6 py-12 sm:flex-row sm:items-center">
          <div><h2 className="font-display text-3xl text-cream sm:text-4xl">See more on Instagram</h2><p className="mt-2 font-medium text-gold">{settings.socials.instagram}</p></div>
          <span className="inline-flex h-14 items-center gap-2 rounded-full bg-gold px-7 font-semibold text-ink"><Instagram size={18} />Follow us</span>
        </Container>
      </section>
    </>
  );
}
