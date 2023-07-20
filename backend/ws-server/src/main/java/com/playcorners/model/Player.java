package com.playcorners.model;

import java.util.Objects;

public class Player {
    private String name;
    private Piece pieceColor;
    private boolean registered;

    public Player() {
    }

    public Player(String name) {
        this.name = name;
        this.pieceColor = Piece.WHITE;
        this.registered = true;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Piece getPieceColor() {
        return pieceColor;
    }

    public void setPieceColor(Piece pieceColor) {
        this.pieceColor = pieceColor;
    }

    public boolean isRegistered() {
        return registered;
    }

    public void setRegistered(boolean registered) {
        this.registered = registered;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Player player = (Player) o;
        return Objects.equals(name, player.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name);
    }
}
