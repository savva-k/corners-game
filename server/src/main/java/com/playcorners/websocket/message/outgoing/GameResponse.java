package com.playcorners.websocket.message.outgoing;

import com.playcorners.websocket.message.MessageType;

public record GameResponse<T>(MessageType type, T payload) {
}
