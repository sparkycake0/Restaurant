package com.spacecode.server.controllers;

import com.spacecode.server.dtos.OrderInput;
import com.spacecode.server.dtos.OrderResponse;
import com.spacecode.server.services.OrdersService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class OrdersController {
  private final OrdersService ordersService;

  @QueryMapping
  public List<OrderResponse> orders() {
    return ordersService.getAll();
  }

  @MutationMapping
  public boolean createOrder(@Argument OrderInput input) {
    ordersService.save(input);
    return true;
  }

  @MutationMapping
  public boolean deleteOrder(@Argument int id) {
    ordersService.delete((long) id);
    return true;
  }

  @MutationMapping
  public boolean advanceOrder(@Argument int id) {
    ordersService.changeStatus((long) id);
    return true;
  }

  @MutationMapping
  public boolean cancelOrder(@Argument int id) {
    ordersService.setStatusCancelled((long) id);
    return true;
  }
}
