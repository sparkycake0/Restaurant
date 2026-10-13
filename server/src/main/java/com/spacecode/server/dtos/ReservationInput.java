package com.spacecode.server.dtos;

import com.spacecode.server.enums.ReservationEvent;
import com.spacecode.server.enums.ReservationStatus;
import java.util.List;

// date is "YYYY-MM-DD", start and end are "HH:mm".
public record ReservationInput(
    String customerName,
    String phone,
    String email,
    String startDate,
    String endDate,
    String startTime,
    String endTime,
    List<Integer> tableIds,
    int guests,
    ReservationEvent eventType,
    ReservationStatus status,
    String notes) {}
