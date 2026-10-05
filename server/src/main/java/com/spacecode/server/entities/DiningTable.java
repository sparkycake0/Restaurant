package com.spacecode.server.entities;

import com.spacecode.server.enums.TableShape;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class DiningTable {
  @Id
  @Column(updatable = false, nullable = false)
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @Column(updatable = true, nullable = false)
  @Enumerated(EnumType.STRING)
  private TableShape shape;

  @Column(updatable = true, nullable = false)
  private int x;

  @Column(updatable = true, nullable = false)
  private int y;

  @Column(updatable = true, nullable = false)
  private int seats;

  @Column(updatable = true, nullable = true)
  private int w;

  @Column(updatable = true, nullable = false)
  private String label;

  @Column(updatable = true, nullable = false)
  private boolean active;
}
