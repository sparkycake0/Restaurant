import { gql } from "@/lib/api";
import { Reservation } from "@/types";

export const reservationService = {
  save: (reservation: Reservation) =>
    gql(
      `mutation ($input: ReservationInput!) { createReservation(input: $input) } `,
      {
        input: reservation,
      },
    ),
};
