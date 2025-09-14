package com.playcorners.websocket.message;

public enum MessageType {
    // incoming
    JOIN_GAME,
    TURN_REQUEST,

    // outgoing
    JOIN_GAME_OK,
    TURN_OK,
    INVALID_TURN,
    GAME_OVER,
    GAME_EXCEPTION;
}
