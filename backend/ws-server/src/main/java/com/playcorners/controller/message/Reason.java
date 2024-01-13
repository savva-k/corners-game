package com.playcorners.controller.message;

// todo: move to the service layer
public enum Reason {
    USER_NOT_FOUND,
    GAME_NOT_CREATED,
    GAME_NOT_FOUND,
    PLAYER_ALREADY_EXISTS,
    CANNOT_CREATE_PLAYER,
    CANNOT_JOIN_GAME_GENERAL,
    LOBBY_IS_FULL,
    CANNOT_MAKE_TURN,
    INCORRECT_REQUEST_DATA
}
