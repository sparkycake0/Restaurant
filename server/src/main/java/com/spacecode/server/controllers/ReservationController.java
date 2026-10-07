package com.spacecode.server.controllers;

import com.spacecode.server.services.ReservationService;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/reservation")
@RequiredArgsConstructor
public class ReservationController {
  private final ReservationService reservationService;

  @PostMapping
  public void save(@RequestBody Map<String, Object> req) {
    reservationService.save(req);
  }
}
