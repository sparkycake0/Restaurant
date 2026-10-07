package com.spacecode.server.repositories;

import com.spacecode.server.entities.Category;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
  Optional<Category> findByName(String name);
}
