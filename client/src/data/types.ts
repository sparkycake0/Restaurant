// The shapes of the placeholder data. When your backend is ready, return objects with these fields.

import { Category } from "@/types/menu";

export type Food = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: Category | string;
  image: string | undefined;
  available: boolean;
  prepTime: string;
  serves: string;
  tags: string[];
  allergens: string;
};

export type GalleryImage = {
  id: string;
  image: string;
  caption: string;
  category: string;
};

export type DiningTable = {
  id: number | null;
  clientId: string;
  label: string;
  shape: "round" | "rect";
  seats: number;
  x: number;
  y: number;
  w?: number;
  active: boolean;
};

export type OrderType = "dine_in" | "pickup" | "delivery";
export type OrderStatus =
  "new" | "preparing" | "ready" | "delivering" | "done" | "cancelled";
export type OrderItem = {
  id?: number;
  name: string;
  food: Food;
  price: number;
  qty: number;
  note?: string;
};
export type Order = {
  id?: string;
  number?: number;
  type: OrderType;
  status: OrderStatus | string;
  name?: string;
  apartment?: string;
  phone?: string;
  address?: string;
  tableLabel?: string;
  orders: OrderItem[];
  total?: number;
  notes?: string;
  createdAt?: number; // milliseconds (Date.now())
};

export type ReservationStatus =
  "pending" | "confirmed" | "seated" | "cancelled";
export type Reservation = {
  id: string;
  code: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  eventType: string;
  guests: number;
  tableIds: string[];
  customerName: string;
  phone: string;
  email?: string;
  notes?: string;
  status: ReservationStatus;
  depositPaid: boolean;
  seatedCount: number; // how many guests already have a seat
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  address: string;
  email?: string;
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
  delivery: {
    enabled: boolean;
    fee: number;
    freeOver: number;
    minOrder: number;
    radiusKm: number;
    eta: string;
  };
  catering: {
    minGuests: number;
    noticeDays: number;
    depositPercent: number;
    requireDeposit: boolean;
  };
  socials: { instagram: string; facebook: string; tiktok: string };
};
