import { Order } from "@/data/types";
import { api } from "@/lib/api";

export const ordersService = {
  save: (body) =>
    api("orders", {
      method: "POST",
      body,
    }),
};
