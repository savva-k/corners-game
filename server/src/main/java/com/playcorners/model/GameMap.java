package com.playcorners.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.playcorners.controller.serialization.GameFieldSerializer;

import java.util.List;
import java.util.Map;

public record GameMap(Size2D size,
                      @JsonSerialize(using = GameFieldSerializer.class) Map<Point, Cell> field,
                      @JsonIgnore Map<Piece, List<Point>> startPositions,
                      @JsonIgnore Map<Piece, List<Point>> winPositions) {
}
