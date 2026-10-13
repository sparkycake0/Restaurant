package com.spacecode.server.dtos;

import com.spacecode.server.enums.OrderStatus;
import com.spacecode.server.enums.OrderType;
import java.util.List;

public record OrderInput(
    OrderType type,
    OrderStatus status,
    Integer tableId,
    String name,
    String phone,
    String address,
    String apartment,
    String notes,
    List<OrderItemInput> items) {

  public record OrderItemInput(int foodId, int qty, String note) {}
}
