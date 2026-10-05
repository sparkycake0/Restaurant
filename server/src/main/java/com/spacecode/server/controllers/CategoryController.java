package com.spacecode.server.controllers;

import com.spacecode.server.dtos.CategoryRequest;
import com.spacecode.server.entities.Category;
import com.spacecode.server.services.CategoryService;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/category")
public class CategoryController {
  public final CategoryService categoryService;

  public CategoryController(CategoryService categoryService) {
    this.categoryService = categoryService;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void save(@RequestBody CategoryRequest request) {
    categoryService.save(request.name());
  }

  @DeleteMapping
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@RequestBody Map<String, Integer> request) {
    categoryService.delete(request.get("id"));
  }

  @GetMapping
  public List<Category> all() {
    return categoryService.all();
  }
}
