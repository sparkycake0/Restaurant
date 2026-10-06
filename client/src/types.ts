// All types in one place.
// Category, Food, Order and DiningTable match what the Spring Boot server sends and expects.
// Reservation, Customer, Staff, Settings and GalleryImage are placeholders until you build them.

export type Category = { id: number; name: string };

export type Food = {
  id: number;
  name: string;
  description: string;
  price: number; // whole number, the server stores an Integer
  category: Category;
  image: string | null;
  available: boolean;
};

export type OrderType = "dine_in" | "pickup" | "delivery";
export type OrderStatus =
  "new" | "preparing" | "ready" | "delivering" | "done" | "cancelled";

// One line of an order. `id` is the food id.
export type OrderItem = {
  id: number;
  name: string;
  price: number;
  qty: number;
  note?: string;
};

// What GET /orders returns
export type Order = {
  id: number;
  type: OrderType;
  status: OrderStatus;
  name: string | null;
  phone: string | null;
  address: string | null;
  apartment: string | null;
  tableLabel: string | null;
  notes: string | null;
  orders: OrderItem[];
  total: number;
};

// What POST /orders expects. `table` is a table id, 0 means no table.
export type NewOrder = {
  type: OrderType;
  status: OrderStatus;
  table: number;
  name: string;
  phone: string;
  address: string;
  apartment: string;
  notes: string;
  orders: OrderItem[];
};

export type TableShape = "round" | "rect";
export type DiningTable = {
  id: number | null; // null = not saved yet
  clientId: string; // only used in the browser, never sent to the server
  label: string;
  shape: TableShape;
  seats: number;
  x: number;
  y: number;
  w?: number;
  active: boolean;
};

/* ---------------- placeholders (no backend yet) ---------------- */

export type GalleryImage = {
  id: string;
  image: string;
  caption: string;
  category: string;
};

export type ReservationStatus =
  "pending" | "confirmed" | "seated" | "cancelled";
export type Reservation = {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  eventType: string;
  guests: number;
  customerName: string;
  phone: string;
  email?: string;
  notes?: string;
  status: ReservationStatus;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  address: string;
  ordersCount: number;
  lastOrderAt: number;
};
export type Staff = {
  id: string;
  name: string;
  username: string;
  role: "admin" | "staff";
  active: boolean;
  lastLogin: number;
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
