package com.spacecode.server.controllers;

import com.spacecode.server.dtos.FoodInput;
import com.spacecode.server.entities.Food;
import com.spacecode.server.services.FoodService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class FoodController {
  private final FoodService foodService;

  @QueryMapping
  public List<Food> foods() {
    return foodService.all();
  }

  @QueryMapping
  public List<Food> availableFoods() {
    return foodService.getAvailable();
  }

  // The image is only loaded from storage when a query asks for the `image` field.
  @SchemaMapping(typeName = "Food", field = "image")
  public String image(Food food) {
    return foodService.getImage(food);
  }

  @MutationMapping
  public Food saveFood(@Argument FoodInput input) {
    return foodService.save(input);
  }

  @MutationMapping
  public boolean deleteFood(@Argument int id) {
    foodService.delete(id);
    return true;
  }

  @MutationMapping
  public boolean setFoodAvailable(@Argument int id, @Argument boolean available) {
    foodService.changeAvailable(id, available);
    return true;
  }
}
