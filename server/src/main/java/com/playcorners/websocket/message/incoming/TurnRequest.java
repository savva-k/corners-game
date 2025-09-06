package com.playcorners.websocket.message.incoming;

import com.playcorners.model.Point;
import jakarta.validation.constraints.NotNull;

public record TurnRequest(@NotNull Point from, @NotNull Point to) {
}
