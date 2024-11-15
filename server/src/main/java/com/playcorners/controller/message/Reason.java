package com.playcorners.controller.message;

// todo: move to the service layer
public enum Reason {
    CANNOT_HAVE_MORE_THAN_ONE_PENDING_GAME,
    GAME_NOT_FOUND,
    LOBBY_IS_FULL,
    INVALID_TURN,
    INCORRECT_REQUEST_DATA,
    NOT_USERS_GAME,
    OPPONENTS_TURN_NOW,
    SOURCE_IS_EMPTY,
    DESTINATION_IS_TAKEN;

    @Override
    public String toString() {
        return "server.exception:" + this.name().toLowerCase();
    }
}
