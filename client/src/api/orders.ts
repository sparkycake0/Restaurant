import { gql } from "@/lib/api";
import type { NewOrder, Order, OrderStatus, OrderType } from "@/types";

// The server uses "DINE_IN" / "NEW", the pages use "dine_in" / "new".
type ServerOrder = Omit<Order, "type" | "status"> & {
  type: string;
  status: string;
};

export const ordersService = {
  getAll: async () => {
    const { orders } = await gql<{ orders: ServerOrder[] }>(`
      { 
          orders {
            id 
            type
            status 
            name 
            phone 
            address 
            apartment 
            tableLabel 
            notes 
            total
            orders { 
              id 
              name 
              price 
              qty 
              note 
            }
      }
    }`);
    return orders.map((o) => ({
      ...o,
      type: o.type.toLowerCase() as OrderType,
      status: o.status.toLowerCase() as OrderStatus,
    }));
  },

  save: (order: NewOrder) =>
    gql(`mutation ($input: OrderInput!) { createOrder(input: $input) }`, {
      input: {
        type: order.type.toUpperCase(),
        status: order.status.toUpperCase(),
        tableId: order.table,
        name: order.name,
        phone: order.phone,
        address: order.address,
        apartment: order.apartment,
        notes: order.notes,
        items: order.orders.map((line) => ({
          foodId: line.id,
          qty: line.qty,
          note: line.note,
        })),
      },
    }),

  delete: (id: number) =>
    gql(`mutation ($id: Int!) { deleteOrder(id: $id) }`, { id }),

  nextStatus: (id: number) =>
    gql(`mutation ($id: Int!) { advanceOrder(id: $id) }`, { id }),

  setStatusCancelled: (id: number) =>
    gql(`mutation ($id: Int!) { cancelOrder(id: $id) }`, { id }),
};
