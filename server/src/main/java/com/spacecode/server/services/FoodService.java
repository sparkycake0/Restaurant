package com.spacecode.server.services;

import com.spacecode.server.dtos.FoodResponse;
import com.spacecode.server.entities.Category;
import com.spacecode.server.entities.Food;
import com.spacecode.server.repositories.CategoryRepository;
import com.spacecode.server.repositories.FoodRepository;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class FoodService {

  private final FoodRepository foodRepository;
  private final CategoryRepository categoryRepository;
  private final StorageService storageService;

  public FoodService(
      FoodRepository foodRepository,
      CategoryRepository categoryRepository,
      StorageService storageService) {
    this.foodRepository = foodRepository;
    this.categoryRepository = categoryRepository;
    this.storageService = storageService;
  }

  public Food save(
      Integer id,
      String name,
      Integer price,
      Integer categoryId,
      String description,
      MultipartFile image,
      boolean available) {
    Category category =
        categoryRepository
            .findById(categoryId)
            .orElseThrow(() -> new RuntimeException("Category not found"));

    Food food;

    if (id != null) {
      food = foodRepository.findById(id).orElseThrow(() -> new RuntimeException("Food not found"));
    } else {
      food = new Food();
    }

    food.setName(name);
    food.setPrice(price);
    food.setCategory(category);
    food.setDescription(description);
    food.setAvailable(available);

    if (image != null && !image.isEmpty()) {
      String extension = getExtension(image.getOriginalFilename());
      String imageKey = "foods/" + UUID.randomUUID() + extension;

      try {
        storageService.upload(image, imageKey);
      } catch (IOException e) {
        throw new RuntimeException("Failed to upload image", e);
      }

      food.setImageKey(imageKey);
    }

    return foodRepository.save(food);
  }

  private String getExtension(String filename) {
    if (filename == null || !filename.contains(".")) {
      return "";
    }

    return filename.substring(filename.lastIndexOf("."));
  }

  public List<FoodResponse> all() {
    return foodRepository.findAll().stream()
        .map(
            food ->
                new FoodResponse(
                    food.getId(),
                    food.getName(),
                    food.getPrice(),
                    food.getDescription(),
                    food.getCategory(),
                    storageService.getImage(food.getImageKey()),
                    food.isAvailable()))
        .toList();
  }

  public void delete(int id) {
    foodRepository.deleteById(id);
  }

  public void changeAvailable(int id, boolean available) {
    Food food =
        foodRepository
            .findById(id)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cant find that food"));
    food.setAvailable(available);

    foodRepository.save(food);
  }

  public List<FoodResponse> getAvailable() {

    List<FoodResponse> foods =
        foodRepository.findByAvailableTrue().stream()
            .map(
                food ->
                    new FoodResponse(
                        food.getId(),
                        food.getName(),
                        food.getPrice(),
                        food.getDescription(),
                        food.getCategory(),
                        storageService.getImage(food.getImageKey()),
                        food.isAvailable()))
            .toList();

    return foods;
  }
}
