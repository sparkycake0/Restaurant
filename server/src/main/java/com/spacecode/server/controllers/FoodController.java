package com.spacecode.server.controllers;

import com.spacecode.server.dtos.FoodResponse;
import com.spacecode.server.entities.Food;
import com.spacecode.server.services.FoodService;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/food")
public class FoodController {

  private final FoodService foodService;

  public FoodController(FoodService foodService) {
    this.foodService = foodService;
  }

  @PostMapping(consumes = "multipart/form-data")
  @ResponseStatus(HttpStatus.OK)
  public Food save(
      @RequestParam(required = false) Integer id,
      @RequestParam String name,
      @RequestParam Integer price,
      @RequestParam Integer categoryId,
      @RequestParam(required = false) String description,
      @RequestParam(required = false) MultipartFile image,
      @RequestParam boolean available) {
    return foodService.save(id, name, price, categoryId, description, image, available);
  }

  @GetMapping
  public List<FoodResponse> all() {
    return foodService.all();
  }

  @DeleteMapping
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@RequestBody Map<String, Integer> req) {
    int id = req.get("id");
    foodService.delete(id);
  }

  @PatchMapping
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void changeAvaialble(@RequestBody Map<String, String> req) {
    int id = Integer.parseInt(req.get("id"));
    boolean available = Boolean.parseBoolean(req.get("available"));

    foodService.changeAvailable(id, !available);
  }
}
