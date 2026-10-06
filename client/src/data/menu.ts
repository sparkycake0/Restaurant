import type { Food } from "@/types";

// SAMPLE DATA - same shape as GET /food. Replace with: useQuery({ queryKey: queryKeys.foods, queryFn: foodService.getAll })
export const menuItems: Food[] = [
  { id: 1, name: "Truffle Tagliatelle", description: "Fresh egg pasta, cream, black truffle, parmesan", price: 15, category: { id: 2, name: "Pasta" }, image: "/images/pasta-truffle.svg", available: true },
  { id: 2, name: "Grilled Sea Bass", description: "Lemon butter, roasted fennel, herb potatoes", price: 19, category: { id: 4, name: "Mains" }, image: "/images/sea-bass.svg", available: true },
  { id: 3, name: "Burrata & Tomato", description: "Heirloom tomatoes, basil oil, warm sourdough", price: 11, category: { id: 1, name: "Starters" }, image: "/images/burrata.svg", available: true },
  { id: 4, name: "Slow-cooked Lamb", description: "Rosemary jus, creamy polenta, glazed carrots", price: 23, category: { id: 4, name: "Mains" }, image: "/images/slow-cooked-lamb.svg", available: false },
  { id: 5, name: "Margherita", description: "San Marzano tomato, mozzarella, basil, olive oil", price: 11, category: { id: 3, name: "Pizza" }, image: "/images/margherita.svg", available: true },
  { id: 6, name: "Spicy Arrabbiata", description: "Penne, chili, garlic, tomato and pecorino", price: 12, category: { id: 2, name: "Pasta" }, image: "/images/pasta-arrabbiata.svg", available: true },
  { id: 7, name: "Tiramisu", description: "Espresso-soaked savoiardi, mascarpone, cocoa", price: 8, category: { id: 5, name: "Desserts" }, image: "/images/tiramisu.svg", available: true },
  { id: 8, name: "Caesar Salad", description: "Romaine, anchovy dressing, croutons, grana", price: 10, category: { id: 1, name: "Starters" }, image: "/images/caesar-salad.svg", available: true },
];
