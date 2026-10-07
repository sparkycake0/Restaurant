import { api } from "@/lib/api";
import { Reservation } from "@/types";

export const reservationService = {
  save: (reservation: Reservation) =>
    api("reservation", { method: "POST", body: reservation }),
};
