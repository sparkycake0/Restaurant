import type { Settings } from "@/types";

// SAMPLE DATA - restaurant info shown on Info, Contact, footer and the settings page.
export const settings: Settings = {
  name: "Your Restaurant",
  address: "Main Street 12, 21000 City",
  phone: "+381 00 000 0000",
  email: "hello@yourrestaurant.com",
  hours: [
    { day: "Monday", open: true, from: "11:00", to: "23:00" },
    { day: "Tuesday", open: true, from: "11:00", to: "23:00" },
    { day: "Wednesday", open: true, from: "11:00", to: "23:00" },
    { day: "Thursday", open: true, from: "11:00", to: "23:00" },
    { day: "Friday", open: true, from: "11:00", to: "00:00" },
    { day: "Saturday", open: true, from: "12:00", to: "00:00" },
    { day: "Sunday", open: false, from: "12:00", to: "22:00" },
  ],
  delivery: { fee: 2, freeOver: 30, minOrder: 8, eta: "35 - 50" },
  socials: { instagram: "@yourrestaurant", facebook: "facebook.com/yourrestaurant", tiktok: "@yourrestaurant" },
};
