import type { Food } from "./types";

export const categories = ["Starters", "Pasta", "Pizza", "Mains", "Desserts", "Drinks"];

// PLACEHOLDER: replace with the menu from your backend.
export const menuItems: Food[] = [
  { id: "f1", name: "Truffle Tagliatelle", description: "Fresh egg pasta, cream, black truffle, parmesan", price: 14.5, category: "Pasta", image: "/images/pasta-truffle.svg", available: true, featured: true, tags: ["Vegetarian"], prepTime: "15-20 minutes", serves: "1 person", allergens: "Gluten, dairy, egg" },
  { id: "f2", name: "Grilled Sea Bass", description: "Lemon butter, roasted fennel, herb potatoes", price: 19, category: "Mains", image: "/images/sea-bass.svg", available: true, featured: true, tags: ["Gluten-free"], prepTime: "20-25 minutes", serves: "1 person", allergens: "Fish, dairy" },
  { id: "f3", name: "Burrata & Tomato", description: "Heirloom tomatoes, basil oil, warm sourdough", price: 11, category: "Starters", image: "/images/burrata.svg", available: true, tags: ["Vegetarian"], prepTime: "10 minutes", serves: "1-2 people", allergens: "Dairy, gluten" },
  { id: "f4", name: "Slow-cooked Lamb", description: "Rosemary jus, creamy polenta, glazed carrots", price: 22.5, category: "Mains", image: "/images/slow-cooked-lamb.svg", available: false, tags: [], prepTime: "25 minutes", serves: "1 person", allergens: "Dairy" },
  { id: "f5", name: "Margherita", description: "San Marzano tomato, mozzarella, basil, olive oil", price: 10.5, category: "Pizza", image: "/images/margherita.svg", available: true, featured: true, tags: ["Vegetarian"], prepTime: "15 minutes", serves: "1 person", allergens: "Gluten, dairy" },
  { id: "f6", name: "Spicy Arrabbiata", description: "Penne, chili, garlic, tomato and pecorino", price: 12, category: "Pasta", image: "/images/pasta-arrabbiata.svg", available: true, tags: ["Vegan", "Spicy"], prepTime: "15 minutes", serves: "1 person", allergens: "Gluten" },
  { id: "f7", name: "Tiramisu", description: "Espresso-soaked savoiardi, mascarpone, cocoa", price: 7.5, category: "Desserts", image: "/images/tiramisu.svg", available: true, featured: true, tags: [], prepTime: "5 minutes", serves: "1 person", allergens: "Gluten, dairy, egg" },
  { id: "f8", name: "Caesar Salad", description: "Romaine, anchovy dressing, croutons, grana", price: 9.5, category: "Starters", image: "/images/caesar-salad.svg", available: true, tags: [], prepTime: "10 minutes", serves: "1 person", allergens: "Fish, egg, gluten, dairy" },
  { id: "f9", name: "House Lemonade", description: "Fresh lemon, mint and sparkling water", price: 4, category: "Drinks", image: "/images/lemonade.svg", available: true, tags: ["Vegan"], prepTime: "3 minutes", serves: "1 person", allergens: "-" },
  { id: "f10", name: "Espresso", description: "Double shot, house blend", price: 2.5, category: "Drinks", image: "/images/espresso.svg", available: true, tags: ["Vegan"], prepTime: "2 minutes", serves: "1 person", allergens: "-" },
];
