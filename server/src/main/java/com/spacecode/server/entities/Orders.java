package com.spacecode.server.entities;

import com.spacecode.server.enums.OrderStatus;
import com.spacecode.server.enums.OrderType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import java.util.ArrayList;
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
public class Orders {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  Long id;

  @Column(updatable = false, nullable = true)
  String address;

  @Column(updatable = false, nullable = true)
  String apartment;

  @Column(updatable = false, nullable = true)
  String name;

  @Column(updatable = false, nullable = true)
  String notes;

  @Column(updatable = false, nullable = true)
  String phone;

  @ManyToOne
  @JoinColumn(name = "dining_table_id")
  DiningTable table;

  @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
  private List<OrderItem> orders = new ArrayList<>();

  @Column(updatable = true, nullable = false)
  @Enumerated(EnumType.STRING)
  private OrderType type;

  @Column(updatable = true, nullable = false)
  @Enumerated(EnumType.STRING)
  private OrderStatus status;
}
