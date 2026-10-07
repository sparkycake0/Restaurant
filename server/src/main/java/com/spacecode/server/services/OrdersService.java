package com.spacecode.server.services;

import com.spacecode.server.dtos.OrderResponse;
import com.spacecode.server.entities.DiningTable;
import com.spacecode.server.entities.Food;
import com.spacecode.server.entities.OrderItem;
import com.spacecode.server.entities.Orders;
import com.spacecode.server.enums.OrderStatus;
import com.spacecode.server.enums.OrderType;
import com.spacecode.server.repositories.DiningTableRepository;
import com.spacecode.server.repositories.FoodRepository;
import com.spacecode.server.repositories.OrdersRepository;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class OrdersService {
  private final OrdersRepository ordersRep;
  private final DiningTableRepository tableRep;
  private final FoodRepository foodRep;

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

              double total =
                  items.stream().mapToDouble(item -> item.getPrice() * item.getQty()).sum();

              return new OrderResponse(
                  String.valueOf(order.getId()),
                  order.getType().name().toLowerCase(),
                  order.getStatus().name().toLowerCase(),
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

  public void save(
      Object orders,
      Long tableId,
      String phone,
      String name,
      String address,
      String apartment,
      String notes,
      OrderType type,
      OrderStatus status) {
    Orders newOrder = new Orders();
    DiningTable table = tableRep.findById(tableId).orElse(null);
    newOrder.setTable(table);
    newOrder.setAddress(address);
    newOrder.setName(name);
    newOrder.setApartment(apartment);
    newOrder.setNotes(notes);
    newOrder.setStatus(status);
    newOrder.setType(type);
    List<Map<String, Object>> orderList = (List<Map<String, Object>>) orders;
    List<OrderItem> items =
        orderList.stream()
            .map(
                item -> {
                  Integer foodId = (Integer) item.get("id");
                  int qty = ((Number) item.get("qty")).intValue();
                  String note = (String) item.get("note");

                  Food food =
                      foodRep
                          .findById(foodId)
                          .orElseThrow(
                              () ->
                                  new ResponseStatusException(
                                      HttpStatus.NOT_FOUND, "Food not found: " + foodId));

                  OrderItem orderItem = new OrderItem();
                  orderItem.setFood(food);
                  orderItem.setQty(qty);
                  orderItem.setNote(note);
                  orderItem.setOrder(newOrder);

                  return orderItem;
                })
            .toList();
    newOrder.setOrders(items);
    ordersRep.save(newOrder);
  }

  public void delete(Long id) {
    Orders order =
        ordersRep.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    ordersRep.delete(order);
  }

  public void changeStatus(Long id) {
    Orders order =
        ordersRep.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

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
    Orders order =
        ordersRep.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    if (order.getStatus() != OrderStatus.CANCELLED) {
      order.setStatus(OrderStatus.CANCELLED);
      ordersRep.save(order);
    }
  }
}
