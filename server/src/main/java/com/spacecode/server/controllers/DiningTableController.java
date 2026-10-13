package com.spacecode.server.controllers;

import com.spacecode.server.dtos.DiningTableInput;
import com.spacecode.server.dtos.TimeRange;
import com.spacecode.server.entities.DiningTable;
import com.spacecode.server.services.DiningTableService;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class DiningTableController {
  private final DiningTableService tableService;

  @QueryMapping
  public List<DiningTable> tables() {
    return tableService.findAll();
  }

  @QueryMapping
  public List<DiningTable> activeTables(@Argument TimeRange range) {
    if (range == null) {
      return tableService.getActiveTables();
    }
    LocalDate startDate = LocalDate.parse(range.startDate());
    LocalDate endDate = LocalDate.parse(range.endDate());
    LocalTime startTime = LocalTime.parse(range.startTime());
    LocalTime endTime = LocalTime.parse(range.endTime());
    return tableService.getAvailableByActiveAndByTime(startDate, endDate, startTime, endTime);
  }

  @MutationMapping
  public List<DiningTable> saveTableLayout(@Argument List<DiningTableInput> tables) {
    return tableService.saveLayout(tables);
  }
}
