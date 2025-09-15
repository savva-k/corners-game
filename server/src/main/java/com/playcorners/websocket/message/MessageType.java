package com.playcorners.websocket.message;

public enum MessageType {
    // incoming
    CREATE_OR_LOAD_GAME,
    TURN_REQUEST,

    // outgoing
    CREATE_OR_LOAD_GAME_OK,
    PLAYER_JOINED,
    TURN_OK,
    INVALID_TURN,
    GAME_OVER,
    GAME_EXCEPTION;
}
