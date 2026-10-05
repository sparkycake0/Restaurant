package com.spacecode.server.controllers;

import com.spacecode.server.dtos.OrderResponse;
import com.spacecode.server.enums.OrderStatus;
import com.spacecode.server.enums.OrderType;
import com.spacecode.server.services.OrdersService;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrdersController {
  public final OrdersService ordersService;

  @GetMapping
  public List<OrderResponse> getAll() {
    return ordersService.getAll();
  }

  @PostMapping
  public void save(@RequestBody Map<String, Object> req) {
    Long tableId = ((Number) req.get("table")).longValue();
    String phone = (String) req.get("phone");
    String name = (String) req.get("name");
    String address = (String) req.get("address");
    String apartment = (String) req.get("apartment");
    String notes = (String) req.get("notes");
    OrderType type = OrderType.valueOf(((String) req.get("type")).toUpperCase());
    OrderStatus status = OrderStatus.valueOf(((String) req.get("status")).toUpperCase());
    Object orders = req.get("orders");
    ordersService.save(orders, tableId, phone, name, address, apartment, notes, type, status);
  }
}
