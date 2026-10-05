package com.spacecode.server.services;

import com.spacecode.server.entities.OrderItem;
import com.spacecode.server.entities.Orders;
import com.spacecode.server.enums.OrderStatus;
import com.spacecode.server.enums.OrderType;
import com.spacecode.server.repositories.OrdersRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrdersService {
  public final OrdersRepository ordersRep;

  public List<Orders> getAll() {
    return ordersRep.findAll();
  }

  public void save(
      List<OrderItem> orders,
      int table,
      String phone,
      String name,
      String address,
      String apartment,
      String notes,
      OrderType type,
      OrderStatus status) {}
}
