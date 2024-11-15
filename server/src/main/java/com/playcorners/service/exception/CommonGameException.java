package com.playcorners.service.exception;

public class CommonGameException extends RuntimeException {

    private final Reason reason;

    public CommonGameException(Reason reason) {
        super(String.valueOf(reason));
        this.reason = reason;
    }

    public Reason getReason() {
        return reason;
    }
}
