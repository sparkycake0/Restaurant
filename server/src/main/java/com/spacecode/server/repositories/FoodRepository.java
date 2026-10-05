package com.spacecode.server.repositories;

import com.spacecode.server.entities.Food;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FoodRepository extends JpaRepository<Food, Integer> {}
