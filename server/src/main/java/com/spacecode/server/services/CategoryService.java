package com.spacecode.server.services;

import com.spacecode.server.entities.Category;
import com.spacecode.server.repositories.CategoryRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategoryService {
  private final CategoryRepository categoryRep;

  public Category save(String name) {
    Category category = new Category();
    category.setName(name);
    return categoryRep.save(category);
  }

  public void delete(int id) {
    categoryRep.deleteById(id);
  }

  public List<Category> all() {
    return categoryRep.findAll();
  }
}
