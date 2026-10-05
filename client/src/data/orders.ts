import type { Order, OrderItem } from "./types";

const minutesAgo = (m: number) => Date.now() - m * 60000;
const item = (
  name: string,
  price: number,
  quantity: number,
  note?: string,
): OrderItem => ({ name, price, quantity, note });
const make = (
  number: number,
  type: Order["type"],
  status: Order["status"],
  customerName: string,
  min: number,
  items: OrderItem[],
  extra: Partial<Order> = {},
): Order => ({
  id: `o${number}`,
  number,
  type,
  status,
  customerName,
  items,
  deliveryFee: 0,
  createdAt: minutesAgo(min),
  total: items.reduce((s, i) => s + i.price * i.quantity, 0),
  ...extra,
});

// PLACEHOLDER: orders shown in the staff panel.
export const orders: Order[] = [
  make(
    1046,
    "delivery",
    "new",
    "Marko Petrovic",
    2,
    [
      item("Truffle Tagliatelle", 14.5, 2, "No truffle oil"),
      item("Burrata & Tomato", 11, 1),
      item("Margherita", 10.5, 1, "Extra basil"),
    ],
    {
      phone: "+381 60 000 0000",
      address: "Nemanjina 12, floor 2, ap. 5, Leskovac",
    },
  ),
  make(
    1045,
    "dine_in",
    "new",
    "Table 6",
    6,
    [item("Grilled Sea Bass", 19, 1), item("House Lemonade", 4, 2)],
    { tableLabel: "T6" },
  ),
  make(1044, "pickup", "new", "Ivana R.", 9, [item("Margherita", 10.5, 3)], {
    phone: "+381 61 000 0000",
  }),
  make(
    1043,
    "delivery",
    "preparing",
    "Nikola T.",
    14,
    [item("Slow-cooked Lamb", 22.5, 1), item("Caesar Salad", 9.5, 1)],
    { phone: "+381 62 000 0000", address: "Kralja Petra 21, Leskovac" },
  ),
  make(
    1042,
    "dine_in",
    "preparing",
    "Table 2",
    18,
    [item("Spicy Arrabbiata", 12, 2)],
    { tableLabel: "T2" },
  ),
  make(1041, "pickup", "ready", "Sara B.", 24, [item("Tiramisu", 7.5, 2)], {
    phone: "+381 63 000 0000",
  }),
  make(
    1040,
    "delivery",
    "ready",
    "Luka D.",
    27,
    [item("Truffle Tagliatelle", 14.5, 1), item("Grilled Sea Bass", 19, 1)],
    { phone: "+381 64 000 0000", address: "Cara Dusana 30, Leskovac" },
  ),
  make(
    1039,
    "delivery",
    "delivering",
    "Petar V.",
    31,
    [item("Margherita", 10.5, 4)],
    { phone: "+381 65 000 0000", address: "Save Kovacevica 3, Leskovac" },
  ),
  make(
    1038,
    "pickup",
    "done",
    "Mia T.",
    44,
    [item("Burrata & Tomato", 11, 1), item("Espresso", 2.5, 2)],
    { phone: "+381 66 000 0000" },
  ),
];
