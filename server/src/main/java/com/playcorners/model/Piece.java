package com.playcorners.model;

public enum Piece {
    WHITE(0),
    BLACK(1);

    private final int numValue;

    Piece(int num) {
        this.numValue = num;
    }

    public Piece opposite() {
        return this == WHITE ? BLACK : WHITE;
    }

    @Override
    public String toString() {
        return String.valueOf(numValue);
    }
}
