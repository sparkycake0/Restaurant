package com.spacecode.server.services;

import com.spacecode.server.dtos.DiningTableInput;
import com.spacecode.server.entities.DiningTable;
import com.spacecode.server.repositories.DiningTableRepository;
import com.spacecode.server.repositories.ReservationRepository;
import jakarta.transaction.Transactional;
import java.time.LocalDate;
import java.time.LocalTime;
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
  private final DiningTableRepository tableRep;
  private final ReservationRepository reservationRep;

  public List<DiningTable> findAll() {
    return tableRep.findAll();
  }

  public List<DiningTable> getActiveTables() {
    return tableRep.findByActiveTrue();
  }

  public List<DiningTable> getAvailableByActiveAndByTime(
      LocalDate startDate, LocalDate endDate, LocalTime startTime, LocalTime endTime) {
    Set<Long> takenIds =
        reservationRep.findOverlapping(startDate, startTime, endDate, endTime).stream()
            .flatMap(r -> r.getTables().stream())
            .map(DiningTable::getId)
            .collect(Collectors.toSet());
    return tableRep.findByActiveTrue().stream().filter(t -> !takenIds.contains(t.getId())).toList();
  }

  @Transactional
  public List<DiningTable> saveLayout(List<DiningTableInput> incoming) {
    Set<Long> incomingIds =
        incoming.stream()
            .map(DiningTableInput::id)
            .filter(Objects::nonNull)
            .map(Integer::longValue)
            .collect(Collectors.toSet());

    tableRep.findAll().stream()
        .filter(table -> !incomingIds.contains(table.getId()))
        .forEach(tableRep::delete);

    List<DiningTable> result = new ArrayList<>();

    for (DiningTableInput dto : incoming) {
      DiningTable table;
      if (dto.id() == null) {
        table = new DiningTable();
      } else {
        table =
            tableRep
                .findById(dto.id().longValue())
                .orElseThrow(() -> new RuntimeException("Table not found: " + dto.id()));
      }
      table.setLabel(dto.label());
      table.setActive(dto.active());
      table.setShape(dto.shape());
      table.setX(dto.x());
      table.setY(dto.y());
      table.setW(dto.w());
      table.setSeats(dto.seats());

      result.add(table);
    }
    return tableRep.saveAll(result);
  }
}
