import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Joins class names and lets later Tailwind classes win (used by the UI components).
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const money = (n: number) => `${n.toFixed(2)} \u20ac`;
export const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
export const uid = () => Math.random().toString(36).slice(2, 10);

// ---- dates (dates are plain "YYYY-MM-DD" strings) ----
export const isoDate = (d = new Date()) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
export const addDays = (iso: string, n: number) => {
  const d = new Date(iso + "T12:00:00");
  d.setDate(d.getDate() + n);
  return isoDate(d);
};
export const fmtDate = (iso: string) => new Date(iso + "T12:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
export const fmtDay = (iso: string) => new Date(iso + "T12:00:00").toLocaleDateString("en-GB", { weekday: "short" });
export const fmtDayNum = (iso: string) => new Date(iso + "T12:00:00").getDate();

// "5 min ago" from a timestamp in milliseconds
export function timeAgo(ms: number) {
  const m = Math.max(0, Math.round((Date.now() - ms) / 60000));
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  return h < 24 ? `${h} h ago` : `${Math.round(h / 24)} d ago`;
}

// Used on the checkout popup: shows only part of the saved details.
export const maskName = (n: string) => n.split(" ").map((p) => p.slice(0, 1) + "***").join(" ");
export const maskPhone = (p: string) => p.slice(0, 5) + p.slice(5).replace(/\d/g, "*");
export const maskAddress = (a: string) => a.replace(/\d+/, (m) => m.slice(0, 1) + "*");

export const ORDER_STATUS_LABEL: Record<string, string> = { new: "New", preparing: "Preparing", ready: "Ready", delivering: "On the way", done: "Done", cancelled: "Cancelled" };
export const TYPE_LABEL: Record<string, string> = { dine_in: "Dine-in", pickup: "Pickup", delivery: "Delivery" };

// Order workflow: which status comes next and what the button says.
export function nextStatus(o: { status: string; type: string }): { to: "preparing" | "ready" | "delivering" | "done"; label: string } | null {
  if (o.status === "new") return { to: "preparing", label: "Start preparing" };
  if (o.status === "preparing") return { to: "ready", label: "Mark as ready" };
  if (o.status === "ready") return o.type === "delivery" ? { to: "delivering", label: "Send out for delivery" } : { to: "done", label: "Mark as done" };
  if (o.status === "delivering") return { to: "done", label: "Mark as delivered" };
  return null;
}
