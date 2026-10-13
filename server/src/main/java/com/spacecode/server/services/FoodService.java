package com.spacecode.server.services;

import com.spacecode.server.dtos.FoodInput;
import com.spacecode.server.entities.Category;
import com.spacecode.server.entities.Food;
import com.spacecode.server.repositories.CategoryRepository;
import com.spacecode.server.repositories.FoodRepository;
import java.util.Base64;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FoodService {

  private final FoodRepository foodRepository;
  private final CategoryRepository categoryRepository;
  private final StorageService storageService;

  public Food save(FoodInput input) {
    Category category =
        categoryRepository
            .findById(input.categoryId())
            .orElseThrow(() -> new RuntimeException("Category not found"));

    Food food;
    if (input.id() != null) {
      food =
          foodRepository
              .findById(input.id())
              .orElseThrow(() -> new RuntimeException("Food not found"));
    } else {
      food = new Food();
    }

    food.setName(input.name());
    food.setPrice(input.price());
    food.setCategory(category);
    food.setDescription(input.description());
    food.setAvailable(input.available());

    if (input.image() != null && !input.image().isBlank()) {
      food.setImageKey(uploadImage(input.image()));
    }

    return foodRepository.save(food);
  }

  // dataUrl looks like "data:image/png;base64,iVBORw0..."
  private String uploadImage(String dataUrl) {
    String contentType = dataUrl.substring("data:".length(), dataUrl.indexOf(';'));
    byte[] bytes = Base64.getDecoder().decode(dataUrl.substring(dataUrl.indexOf(',') + 1));

    // "image/png" -> ".png", "image/svg+xml" -> ".svg"
    String extension = contentType.substring(contentType.indexOf('/') + 1);
    if (extension.contains("+")) {
      extension = extension.substring(0, extension.indexOf('+'));
    }

    String imageKey = "foods/" + UUID.randomUUID() + "." + extension;
    storageService.upload(bytes, contentType, imageKey);
    return imageKey;
  }

  public List<Food> all() {
    return foodRepository.findAll();
  }

  public List<Food> getAvailable() {
    return foodRepository.findByAvailableTrue();
  }

  public void delete(int id) {
    foodRepository.deleteById(id);
  }

  public void changeAvailable(int id, boolean available) {
    Food food =
        foodRepository.findById(id).orElseThrow(() -> new RuntimeException("Food not found"));
    food.setAvailable(available);
    foodRepository.save(food);
  }

  public String getImage(Food food) {
    return storageService.getImage(food.getImageKey());
  }
}
