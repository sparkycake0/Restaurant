import type { Order } from "@/types";

// SAMPLE DATA - same shape as GET /orders.
const empty = { name: null, phone: null, address: null, apartment: null, tableLabel: null, notes: null };

export const orders: Order[] = [
  { ...empty, id: "1046", type: "delivery", status: "new", name: "Marko Petrovic", phone: "+381 60 000 0000", address: "Nemanjina 12, Leskovac", orders: [{ id: 1, name: "Truffle Tagliatelle", price: 15, qty: 2 }, { id: 3, name: "Burrata & Tomato", price: 11, qty: 1 }], total: 41 },
  { ...empty, id: "1045", type: "dine_in", status: "preparing", tableLabel: "T6", orders: [{ id: 2, name: "Grilled Sea Bass", price: 19, qty: 1 }], total: 19 },
  { ...empty, id: "1044", type: "pickup", status: "ready", name: "Ivana R.", phone: "+381 61 000 0000", orders: [{ id: 5, name: "Margherita", price: 11, qty: 3 }], total: 33 },
  { ...empty, id: "1043", type: "delivery", status: "done", name: "Nikola T.", phone: "+381 62 000 0000", address: "Kralja Petra 21, Leskovac", orders: [{ id: 7, name: "Tiramisu", price: 8, qty: 2 }], total: 16 },
];
