package com.spacecode.server.services;

import com.spacecode.server.entities.DiningTable;
import com.spacecode.server.entities.Reservation;
import com.spacecode.server.enums.ReservationEvent;
import com.spacecode.server.enums.ReservationStatus;
import com.spacecode.server.repositories.DiningTableRepository;
import com.spacecode.server.repositories.ReservationRepository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class ReservationService {
  private final ReservationRepository reservationRep;
  private final DiningTableRepository tableRep;
  private final ObjectMapper objectMapper;

  public void save(Map<String, Object> req) {
    String customerName = (String) req.get("customerName");
    String phone = (String) req.get("phone");
    String email = (String) req.get("email");

    LocalDate date = LocalDate.parse((String) req.get("date"));
    LocalTime startTime = LocalTime.parse((String) req.get("start"));
    LocalTime endTime = LocalTime.parse((String) req.get("end"));

    List<Long> tableIds =
        objectMapper.convertValue(req.get("table"), new TypeReference<List<Long>>() {});

    List<DiningTable> tables =
        tableIds.stream()
            .map(
                id ->
                    tableRep
                        .findById(id)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND)))
            .toList();
    int guests = Integer.parseInt((String) req.get("guests"));

    String eventType = (String) req.get("eventType");
    ReservationEvent event = ReservationEvent.valueOf(eventType.toUpperCase());

    String statusString = (String) req.get("status");
    ReservationStatus status = ReservationStatus.valueOf(statusString.toUpperCase());

    String notes = (String) req.get("notes");

    Reservation reservation = new Reservation();
    reservation.setCustomerName(customerName);
    reservation.setPhone(phone);
    reservation.setEmail(email);
    reservation.setDate(date);
    reservation.setStartTime(startTime);
    reservation.setEndTime(endTime);
    reservation.setTables(tables);
    reservation.setGuests(guests);
    reservation.setEvent(event);
    reservation.setStatus(status);
    reservation.setNotes(notes);

    reservationRep.save(reservation);
  }
}
