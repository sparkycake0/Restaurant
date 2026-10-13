package com.spacecode.server.dtos;

import com.spacecode.server.enums.TableShape;

// id == null means "new table".
public record DiningTableInput(
    Integer id,
    String label,
    TableShape shape,
    int seats,
    int x,
    int y,
    int w,
    boolean active) {}
