import { api } from "@/lib/api";
import type { NewOrder, Order } from "@/types";

export const ordersService = {
  getAll: () => api<Order[]>("orders"),
  save: (order: NewOrder) => api("orders", { method: "POST", body: order }),
  delete: (id: number) => api("orders", { method: "DELETE", body: { id } }),
  nextStatus: (id: number) =>
    api("orders/status", { method: "PUT", body: { id } }),
  setStatusCancelled: (id: number) =>
    api("orders/cancelled", { method: "PUT", body: { id } }),
};
