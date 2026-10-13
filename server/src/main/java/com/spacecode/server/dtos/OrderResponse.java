package com.spacecode.server.dtos;

import com.spacecode.server.enums.OrderStatus;
import com.spacecode.server.enums.OrderType;
import java.util.List;

public record OrderResponse(
    Long id,
    OrderType type,
    OrderStatus status,
    String name,
    String apartment,
    String phone,
    String address,
    String tableLabel,
    List<OrderItemResponse> orders,
    double total,
    String notes) {

  public record OrderItemResponse(int id, String name, int price, int qty, String note) {}
}
