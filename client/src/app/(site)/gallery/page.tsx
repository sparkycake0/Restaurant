import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/page-header";
import { Photo } from "@/components/ui";
import { galleryImages } from "@/data/gallery";

export const metadata: Metadata = { title: "Gallery" };

export default function GalleryPage() {
  // TODO(api): replace galleryImages with images from your server
  return (
    <>
      <PageHeader title="Gallery" sub="A look at our food, our rooms and our events." />
      <Container className="py-12 sm:py-16">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {galleryImages.map((g) => (
            <figure key={g.id}>
              <div className="aspect-square overflow-hidden rounded-2xl">
                <Photo src={g.image} alt={g.caption} />
              </div>
              <figcaption className="mt-2 text-sm text-muted">{g.caption}</figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </>
  );
}
