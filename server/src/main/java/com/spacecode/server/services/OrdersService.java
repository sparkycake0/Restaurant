package com.spacecode.server.services;

import com.spacecode.server.dtos.OrderInput;
import com.spacecode.server.dtos.OrderResponse;
import com.spacecode.server.entities.DiningTable;
import com.spacecode.server.entities.Food;
import com.spacecode.server.entities.OrderItem;
import com.spacecode.server.entities.Orders;
import com.spacecode.server.enums.OrderStatus;
import com.spacecode.server.repositories.DiningTableRepository;
import com.spacecode.server.repositories.FoodRepository;
import com.spacecode.server.repositories.OrdersRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrdersService {
  private final OrdersRepository ordersRep;
  private final DiningTableRepository tableRep;
  private final FoodRepository foodRep;

  @Transactional(readOnly = true)
  public List<OrderResponse> getAll() {
    return ordersRep.findAll().stream()
        .map(
            order -> {
              List<OrderResponse.OrderItemResponse> items =
                  order.getOrders().stream()
                      .map(
                          item ->
                              new OrderResponse.OrderItemResponse(
                                  item.getFood().getId(),
                                  item.getFood().getName(),
                                  item.getFood().getPrice(),
                                  item.getQty(),
                                  item.getNote()))
                      .toList();

              double total = items.stream().mapToDouble(item -> item.price() * item.qty()).sum();

              return new OrderResponse(
                  order.getId(),
                  order.getType(),
                  order.getStatus(),
                  order.getName(),
                  order.getApartment(),
                  order.getPhone(),
                  order.getAddress(),
                  order.getTable() != null ? order.getTable().getLabel() : null,
                  items,
                  total,
                  order.getNotes());
            })
        .toList();
  }

  @Transactional
  public void save(OrderInput input) {
    Orders order = new Orders();

    // no table id (or an unknown one, like 0) means the order has no table
    DiningTable table =
        input.tableId() == null ? null : tableRep.findById(input.tableId().longValue()).orElse(null);

    order.setTable(table);
    order.setAddress(input.address());
    order.setName(input.name());
    order.setPhone(input.phone());
    order.setApartment(input.apartment());
    order.setNotes(input.notes());
    order.setStatus(input.status());
    order.setType(input.type());

    List<OrderItem> items =
        input.items().stream()
            .map(
                line -> {
                  Food food =
                      foodRep
                          .findById(line.foodId())
                          .orElseThrow(
                              () -> new RuntimeException("Food not found: " + line.foodId()));

                  OrderItem item = new OrderItem();
                  item.setFood(food);
                  item.setQty(line.qty());
                  item.setNote(line.note());
                  item.setOrder(order);
                  return item;
                })
            .toList();

    order.setOrders(items);
    ordersRep.save(order);
  }

  public void delete(Long id) {
    ordersRep.delete(find(id));
  }

  // Moves the order to its next status. An order that is already DONE gets deleted.
  public void changeStatus(Long id) {
    Orders order = find(id);

    if (order.getStatus() == OrderStatus.DONE) {
      ordersRep.delete(order);
      return;
    }

    OrderStatus[] statuses = OrderStatus.values();
    int nextIndex = order.getStatus().ordinal() + 1;

    if (nextIndex < statuses.length) {
      order.setStatus(statuses[nextIndex]);
      ordersRep.save(order);
    }
  }

  public void setStatusCancelled(Long id) {
    Orders order = find(id);

    if (order.getStatus() != OrderStatus.CANCELLED) {
      order.setStatus(OrderStatus.CANCELLED);
      ordersRep.save(order);
    }
  }

  private Orders find(Long id) {
    return ordersRep.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
  }
}
