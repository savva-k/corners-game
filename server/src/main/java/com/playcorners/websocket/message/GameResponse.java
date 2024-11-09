package com.playcorners.websocket.message;

public record GameResponse<T>(MessageType type, T payload) {
}
