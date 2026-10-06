"use client";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Button, Photo } from "@/components/ui";
import { galleryImages } from "@/data/gallery";

export default function GalleryAdminPage() {
  // SAMPLE DATA as the starting list.
  // TODO(api): load images with useQuery; delete / upload with useMutation.
  const [images, setImages] = useState(galleryImages);

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {images.map((img) => (
        <div key={img.id}>
          <div className="aspect-square overflow-hidden rounded-2xl">
            <Photo src={img.image} alt={img.caption} />
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="truncate text-sm">{img.caption}</span>
            <Button variant="ghost" size="sm" aria-label="Delete" onClick={() => setImages(images.filter((i) => i.id !== img.id))}>
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
