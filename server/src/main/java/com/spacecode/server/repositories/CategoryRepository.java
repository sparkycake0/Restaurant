package com.spacecode.server.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.spacecode.server.entities.Category;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
}
