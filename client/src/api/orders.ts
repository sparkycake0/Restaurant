import { Order } from "@/data/types";
import { api } from "@/lib/api";

export const ordersService = {
  save: (body: Order) =>
    api("orders", {
      method: "POST",
      body,
    }),
  getAll: () => {
    return api<Order[]>("orders");
  },
};
