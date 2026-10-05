package com.spacecode.server.services;

import com.spacecode.server.dtos.DiningTableRequest;
import com.spacecode.server.dtos.TableLayoutRequest;
import com.spacecode.server.entities.DiningTable;
import com.spacecode.server.repositories.DiningTableRepository;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DiningTableService {
  public final DiningTableRepository tableRep;

  public List<DiningTable> findAll() {
    return tableRep.findAll();
  }

  @Transactional
  public List<DiningTable> saveLayout(TableLayoutRequest request) {
    List<DiningTableRequest> incoming = request.tables();

    Set<Long> incomingIds =
        incoming.stream()
            .map(DiningTableRequest::id)
            .filter(Objects::nonNull)
            .collect(Collectors.toSet());

    tableRep.findAll().stream()
        .filter(table -> !incomingIds.contains(table.getId()))
        .forEach(tableRep::delete);

    List<DiningTable> result = new ArrayList<>();

    for (DiningTableRequest dto : incoming) {
      DiningTable table;
      if (dto.id() == null) {
        table = new DiningTable();
      } else {
        table =
            tableRep
                .findById(dto.id())
                .orElseThrow(() -> new RuntimeException("Table not found: " + dto.id()));
      }
      table.setLabel(dto.label());
      table.setActive(dto.active());
      table.setShape(dto.shape());
      table.setX(dto.x());
      table.setY(dto.y());
      table.setSeats(dto.seats());

      result.add(table);
    }
    return tableRep.saveAll(result);
  }
}
