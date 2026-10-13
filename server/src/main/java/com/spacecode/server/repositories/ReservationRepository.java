package com.spacecode.server.repositories;

import com.spacecode.server.entities.Reservation;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
  @Query(
      """
      SELECT DISTINCT r FROM Reservation r
      LEFT JOIN FETCH r.tables
      WHERE (r.startDate < :endDate OR (r.startDate = :endDate AND r.startTime < :endTime))
        AND (r.endDate > :startDate OR (r.endDate = :startDate AND r.endTime > :startTime))
      """)
  List<Reservation> findOverlapping(
      @Param("startDate") LocalDate startDate,
      @Param("startTime") LocalTime startTime,
      @Param("endDate") LocalDate endDate,
      @Param("endTime") LocalTime endTime);
}
