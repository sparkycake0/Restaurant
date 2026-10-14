import type { GalleryImage } from "@/types";
import { images } from "./images";

// SAMPLE DATA
export const galleryImages: GalleryImage[] = [
  { id: "g1", image: images["pasta-truffle"], caption: "Fresh pasta", category: "Food" },
  { id: "g2", image: images["wine-cellar"], caption: "Wine cellar", category: "Restaurant" },
  { id: "g3", image: images["caesar-salad"], caption: "Sunday brunch", category: "Events" },
  { id: "g4", image: images.tiramisu, caption: "Dessert table", category: "Food" },
  { id: "g5", image: images.kitchen, caption: "Chef at work", category: "Team" },
  { id: "g6", image: images.terrace, caption: "Terrace", category: "Restaurant" },
  { id: "g7", image: images["event-hall"], caption: "Wedding, 120 guests", category: "Catering" },
  { id: "g8", image: images.bread, caption: "Bread baking", category: "Food" },
  { id: "g9", image: images["dining-room"], caption: "Dining room", category: "Restaurant" },
  { id: "g10", image: images["sea-bass"], caption: "Grill night", category: "Events" },
  { id: "g11", image: images.bar, caption: "The bar", category: "Team" },
  { id: "g12", image: images.margherita, caption: "Corporate lunch", category: "Catering" },
];
