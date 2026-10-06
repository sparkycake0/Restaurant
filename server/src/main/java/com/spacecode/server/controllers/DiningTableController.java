package com.spacecode.server.controllers;

import com.spacecode.server.dtos.TableLayoutRequest;
import com.spacecode.server.entities.DiningTable;
import com.spacecode.server.services.DiningTableService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("tables")
@RequiredArgsConstructor
public class DiningTableController {
  public final DiningTableService tableService;

  @GetMapping
  public List<DiningTable> getTables() {
    return tableService.findAll();
  }

  @PutMapping("/layout")
  public List<DiningTable> saveLayout(@RequestBody TableLayoutRequest req) {
    return tableService.saveLayout(req);
  }

  @GetMapping("/available")
  public List<DiningTable> getActiveTables() {
    return tableService.getActiveTables();
  }
}
