import type { Reservation } from "./types";

// Date helper: 0 = today, 1 = tomorrow ...
const day = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};
const r = (n: number, date: string, time: string, eventType: string, guests: number, tableIds: string[], customerName: string, phone: string, status: Reservation["status"], extra: Partial<Reservation> = {}): Reservation => ({
  id: `r${n}`, code: `R-${200 + n}`, date, time, eventType, guests, tableIds, customerName, phone, status, depositPaid: false, seatedCount: 0, ...extra,
});

// PLACEHOLDER: reservations shown in the staff panel.
export const reservations: Reservation[] = [
  r(18, day(0), "12:30", "Lunch", 4, ["t3"], "Tanja Milic", "+381 60 111 1111", "confirmed"),
  r(19, day(0), "14:00", "Corporate", 12, ["t6", "t7"], "Business lunch", "+381 60 222 2222", "confirmed", { depositPaid: true, seatedCount: 12 }),
  r(20, day(0), "17:30", "Dinner", 6, ["t12"], "Family Stojanovic", "+381 60 333 3333", "seated", { seatedCount: 6 }),
  r(21, day(0), "19:00", "Birthday", 14, ["t4", "t7", "t8"], "Ana Markovic", "+381 60 000 0000", "pending", { email: "ana@example.com", notes: "Two vegetarian guests, one nut allergy. Cake arrives at 20:30.", seatedCount: 10 }),
  r(22, day(0), "20:30", "Dinner", 6, ["t12"], "Jovan Kostic", "+381 62 000 0000", "confirmed"),
  r(23, day(1), "13:00", "Lunch", 8, ["t6"], "Dragan P.", "+381 60 444 4444", "confirmed"),
  r(24, day(2), "19:30", "Anniversary", 2, ["t1"], "Nina M.", "+381 60 555 5555", "pending"),
];
