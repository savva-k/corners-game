package com.playcorners.websocket.message.incoming;

import com.google.gson.JsonElement;
import com.playcorners.websocket.message.MessageType;

public record IncomingMessage(MessageType type, JsonElement payload) {
}
