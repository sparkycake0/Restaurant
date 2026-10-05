package com.spacecode.server.dtos;

import com.spacecode.server.enums.TableShape;

public record DiningTableRequest(
    Long id, String label, TableShape shape, int seats, int x, int y, boolean active) {}
