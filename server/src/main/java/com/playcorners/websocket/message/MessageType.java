package com.playcorners.websocket.message;

public enum MessageType {
    // incoming
    GET_GAME,
    TURN_REQUEST,

    // outgoing
    GET_GAME_OK,
    TURN_OK,
    INVALID_TURN,
    GAME_OVER,
    GAME_EXCEPTION;
}
