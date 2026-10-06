package com.spacecode.server.repositories;

import com.spacecode.server.entities.DiningTable;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiningTableRepository extends JpaRepository<DiningTable, Long> {
  List<DiningTable> findByActiveTrue();
}
