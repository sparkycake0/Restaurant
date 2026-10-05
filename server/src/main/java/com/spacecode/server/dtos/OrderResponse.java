package com.spacecode.server.dtos;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

  private String id;
  private String type;
  private String status;

  private String name;
  private String apartment;
  private String phone;
  private String address;
  private String tableLabel;

  private List<OrderItemResponse> orders;

  private Double total;
  private String notes;

  @Getter
  @Setter
  @NoArgsConstructor
  @AllArgsConstructor
  public static class OrderItemResponse {
    private int id;
    private String name;
    private int price;
    private int qty;
    private String note;
  }
}
