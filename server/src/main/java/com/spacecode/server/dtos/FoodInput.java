package com.spacecode.server.dtos;

// id == null means "create a new dish".
// image is optional: a data URL like "data:image/png;base64,...". Without it the old image stays.
public record FoodInput(
    Integer id,
    String name,
    int price,
    int categoryId,
    String description,
    String image,
    boolean available) {}
