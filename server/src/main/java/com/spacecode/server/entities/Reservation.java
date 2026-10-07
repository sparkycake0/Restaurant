package com.spacecode.server.entities;

import com.spacecode.server.enums.ReservationEvent;
import com.spacecode.server.enums.ReservationStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToMany
  @JoinTable(
      name = "reservation_tables",
      joinColumns = @JoinColumn(name = "reservation_id"),
      inverseJoinColumns = @JoinColumn(name = "table_id"))
  private List<DiningTable> tables;

  @Column(updatable = true, nullable = false)
  private String phone;

  @Column(updatable = true, nullable = false)
  private String customerName;

  @Column(updatable = true, nullable = false)
  @Enumerated(EnumType.STRING)
  private ReservationStatus status;

  @Column(updatable = true, nullable = true)
  @Enumerated(EnumType.STRING)
  private ReservationEvent event;

  @Column(updatable = true, nullable = false)
  private LocalDate date;

  @Column(updatable = true, nullable = false)
  private LocalTime startTime;

  @Column(updatable = true, nullable = false)
  private LocalTime endTime;

  @Column(updatable = true, nullable = false)
  private int guests;

  @Column(updatable = true, nullable = true)
  private String notes;

  @Column(updatable = true, nullable = true)
  private String email;
}
