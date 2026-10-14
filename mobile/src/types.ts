import type { ImageSourcePropType } from "react-native";

// Same shapes as the website (client/src/types.ts).
// The only difference: `image` is a local image (require) instead of a URL string.

export type Category = { id: number; name: string };

export type Food = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: ImageSourcePropType | null;
  available: boolean;
};

export type GalleryImage = {
  id: string;
  image: ImageSourcePropType;
  caption: string;
  category: string;
};

export type Settings = {
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: { day: string; open: boolean; from: string; to: string }[];
  delivery: { fee: number; freeOver: number; minOrder: number; eta: string };
  socials: { instagram: string; facebook: string; tiktok: string };
};
