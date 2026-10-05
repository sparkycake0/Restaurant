import type { Customer } from "./types";

const daysAgo = (d: number) => Date.now() - d * 86400000;

// PLACEHOLDER
export const customers: Customer[] = [
  { id: "cu1", name: "Marko Petrovic", phone: "+381 60 000 0000", address: "Nemanjina 12, Leskovac", ordersCount: 4, lastOrderAt: daysAgo(0) },
  { id: "cu2", name: "Ana Markovic", phone: "+381 61 000 0000", address: "Vlade Zecevica 5, Leskovac", ordersCount: 2, lastOrderAt: daysAgo(7) },
  { id: "cu3", name: "Jovan Kostic", phone: "+381 62 000 0000", address: "Cara Dusana 30, Leskovac", ordersCount: 7, lastOrderAt: daysAgo(1) },
  { id: "cu4", name: "Lena Petrovic", phone: "+381 63 000 0000", address: "Bulevar Oslobodjenja 8", ordersCount: 1, lastOrderAt: daysAgo(17) },
  { id: "cu5", name: "Nikola Todorovic", phone: "+381 64 000 0000", address: "Kralja Petra 21, Leskovac", ordersCount: 5, lastOrderAt: daysAgo(0) },
  { id: "cu6", name: "Sara Bogdanovic", phone: "+381 65 000 0000", address: "Stefana Nemanje 14", ordersCount: 3, lastOrderAt: daysAgo(4) },
  { id: "cu7", name: "Petar Vasic", phone: "+381 66 000 0000", address: "Save Kovacevica 3, Leskovac", ordersCount: 9, lastOrderAt: daysAgo(0) },
  { id: "cu8", name: "Mia Tomic", phone: "+381 67 000 0000", address: "Jablanicka 27, Leskovac", ordersCount: 2, lastOrderAt: daysAgo(20) },
];
