package com.playcorners.websocket.message.outgoing;

import com.playcorners.model.Player;

public record PlayerJoined(Player player, boolean isStarted) {
}
