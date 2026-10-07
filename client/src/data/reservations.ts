import type { Reservation } from "@/types";

// SAMPLE DATA - dates are plain "YYYY-MM-DD" strings.
const day = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};

export const reservations: Reservation[] = [
  {
    id: "r1",
    date: day(0),
    start: "12:30",
    end: "17:00",
    eventType: "Lunch",
    guests: 4,
    customerName: "Tanja Milic",
    phone: "+381 60 111 1111",
    status: "confirmed",
  },
  {
    id: "r2",
    date: day(0),
    start: "12:30",
    end: "17:00",
    eventType: "Birthday",
    guests: 14,
    customerName: "Ana Markovic",
    phone: "+381 60 000 0000",
    email: "ana@example.com",
    notes: "Two vegetarian guests",
    status: "pending",
  },
  {
    id: "r3",
    date: day(1),
    start: "19:00",
    end: "01:00",
    eventType: "Corporate",
    guests: 12,
    customerName: "Business lunch",
    phone: "+381 60 222 2222",
    status: "confirmed",
  },
  {
    id: "r4",
    date: day(2),
    start: "19:30",
    end: "02:00",
    eventType: "Anniversary",
    guests: 2,
    customerName: "Nina M.",
    phone: "+381 60 555 5555",
    status: "pending",
  },
];
