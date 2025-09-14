package com.playcorners.service.exception;

public enum Reason {
    GAME_NOT_FOUND,
    LOBBY_IS_FULL,
    INVALID_TURN,
    NOT_USERS_GAME,
    OPPONENTS_TURN_NOW,
    SOURCE_IS_EMPTY,
    DESTINATION_IS_TAKEN,
    GAME_IS_FINISHED,
    MAP_DOES_NOT_EXIST;

    @Override
    public String toString() {
        return "server_exception:" + this.name().toLowerCase();
    }
}
