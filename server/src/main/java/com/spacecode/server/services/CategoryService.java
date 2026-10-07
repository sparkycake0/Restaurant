package com.spacecode.server.services;

import com.spacecode.server.entities.Category;
import com.spacecode.server.repositories.CategoryRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class CategoryService {
  private final CategoryRepository categoryRep;

  public CategoryService(CategoryRepository categoryRep) {
    this.categoryRep = categoryRep;
  }

  public void save(String name) {
    Category category = new Category();
    category.setName(name);
    categoryRep.save(category);
  }

  public void delete(Integer id) {
    categoryRep.deleteById(id);
  }

  public List<Category> all() {
    return categoryRep.findAll();
  }
}
