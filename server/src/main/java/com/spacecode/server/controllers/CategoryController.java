package com.spacecode.server.controllers;

import com.spacecode.server.entities.Category;
import com.spacecode.server.services.CategoryService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class CategoryController {
  private final CategoryService categoryService;

  @QueryMapping
  public List<Category> categories() {
    return categoryService.all();
  }

  @MutationMapping
  public Category saveCategory(@Argument String name) {
    return categoryService.save(name);
  }

  @MutationMapping
  public boolean deleteCategory(@Argument int id) {
    categoryService.delete(id);
    return true;
  }
}
