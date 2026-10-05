package com.spacecode.server.dtos;

import com.spacecode.server.entities.Category;

public record FoodResponse(
    Integer id,
    String name,
    Integer price,
    String description,
    Category category,
    String image,
    boolean available) {}
