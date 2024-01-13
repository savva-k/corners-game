package com.playcorners.controller.message;

public class GameError extends RuntimeException {

    private final Reason reason;

    public GameError(Reason reason) {
        super(String.valueOf(reason));
        this.reason = reason;
    }

    public Reason getReason() {
        return reason;
    }
}
