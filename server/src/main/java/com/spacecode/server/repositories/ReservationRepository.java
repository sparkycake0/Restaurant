package com.spacecode.server.repositories;

import com.spacecode.server.entities.Reservation;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
  List<Reservation> findByDateAndStartTimeLessThanAndEndTimeGreaterThan(
      LocalDate date, LocalTime endTime, LocalTime startTime);
}
