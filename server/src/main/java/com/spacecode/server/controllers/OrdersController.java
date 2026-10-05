package com.spacecode.server.controllers;

import com.spacecode.server.entities.OrderItem;
import com.spacecode.server.entities.Orders;
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
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrdersController {
  public final OrdersService ordersService;
  public final ObjectMapper objectMapper;

  @GetMapping
  public List<Orders> getAll() {
    return ordersService.getAll();
  }

  @PostMapping
  public void save(@RequestBody Map<String, Object> req) {
    System.out.println(req);
    List<OrderItem> orders =
        objectMapper.convertValue(req.get("orders"), new TypeReference<List<OrderItem>>() {});
    int table = (int) req.get("table");
    String phone = (String) req.get("phone");
    String name = (String) req.get("name");
    String address = (String) req.get("address");
    String apartment = (String) req.get("apartment");
    String notes = (String) req.get("notes");
    OrderType type = (OrderType) req.get("type");
    OrderStatus status = (OrderStatus) req.get("status");

    ordersService.save(orders, table, phone, name, address, apartment, notes, type, status);
  }
}
