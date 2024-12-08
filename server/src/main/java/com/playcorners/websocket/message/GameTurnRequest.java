package com.playcorners.websocket.message;

import com.playcorners.model.Point;
import jakarta.validation.constraints.NotNull;

public record GameTurnRequest(@NotNull Point from, @NotNull Point to) {
}
