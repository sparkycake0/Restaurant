package com.spacecode.server.controllers;

import com.spacecode.server.dtos.ReservationInput;
import com.spacecode.server.services.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ReservationController {
  private final ReservationService reservationService;

  @MutationMapping
  public boolean createReservation(@Argument ReservationInput input) {
    reservationService.save(input);
    return true;
  }
}
