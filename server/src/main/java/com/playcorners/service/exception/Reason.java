package com.playcorners.service.exception;

public enum Reason {
    CANNOT_HAVE_MORE_THAN_ONE_PENDING_GAME,
    GAME_NOT_FOUND,
    LOBBY_IS_FULL,
    INVALID_TURN,
    NOT_USERS_GAME,
    OPPONENTS_TURN_NOW,
    SOURCE_IS_EMPTY,
    DESTINATION_IS_TAKEN,
    MAP_DOES_NOT_EXIST;

    @Override
    public String toString() {
        return "server_exception:" + this.name().toLowerCase();
    }
}
