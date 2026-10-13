package com.spacecode.server.services;

import com.spacecode.server.dtos.ReservationInput;
import com.spacecode.server.entities.DiningTable;
import com.spacecode.server.entities.Reservation;
import com.spacecode.server.repositories.DiningTableRepository;
import com.spacecode.server.repositories.ReservationRepository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReservationService {
  private final ReservationRepository reservationRep;
  private final DiningTableRepository tableRep;

  public void save(ReservationInput input) {
    List<DiningTable> tables =
        input.tableIds().stream()
            .map(
                id ->
                    tableRep
                        .findById(id.longValue())
                        .orElseThrow(() -> new RuntimeException("Table not found: " + id)))
            .toList();

    Reservation reservation = new Reservation();
    reservation.setCustomerName(input.customerName());
    reservation.setPhone(input.phone());
    reservation.setEmail(input.email());
    reservation.setStartDate(LocalDate.parse(input.startDate()));
    reservation.setEndDate(LocalDate.parse(input.endDate()));
    reservation.setStartTime(LocalTime.parse(input.startTime()));
    reservation.setEndTime(LocalTime.parse(input.endTime()));
    reservation.setTables(tables);
    reservation.setGuests(input.guests());
    reservation.setEvent(input.eventType());
    reservation.setStatus(input.status());
    reservation.setNotes(input.notes());

    reservationRep.save(reservation);
  }
}
