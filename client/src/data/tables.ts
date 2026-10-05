import type { DiningTable } from "./types";

const t = (n: number, shape: "round" | "rect", seats: number, x: number, y: number, w?: number): DiningTable => ({
  id: `t${n}`, label: `T${n}`, shape, seats, x, y, w, active: true,
});

// PLACEHOLDER: the floor plan. x / y is the centre of each table on a 760 x 570 plan.
export const tables: DiningTable[] = [
  t(1, "round", 4, 76, 170), t(2, "round", 4, 206, 170), t(3, "rect", 6, 360, 170, 130), t(4, "round", 6, 520, 170), t(5, "round", 4, 660, 170),
  t(6, "rect", 8, 125, 330, 170), t(7, "round", 6, 310, 330), t(8, "rect", 6, 490, 330, 130), t(9, "round", 4, 650, 330),
  t(10, "round", 4, 90, 480), t(11, "rect", 4, 230, 480, 100), t(12, "round", 6, 545, 480), t(13, "round", 4, 690, 480),
];

// PLACEHOLDER: tables that are already booked for the chosen date/time.
// Your backend should return this for the date and time the customer picks.
export const reservedTableIds = ["t4", "t9", "t10", "t12"];
