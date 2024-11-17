package com.playcorners.model;

public class Cell {
    private String tileMapName;
    private int tileNumber;
    private Piece piece;
    private Point position;

    public Cell() {

    }

    public Cell(String tileMapName, int tileNumber, Point position) {
        this.tileMapName = tileMapName;
        this.tileNumber = tileNumber;
        this.position = position;
    }

    public boolean isEmpty() {
        return this.piece == null;
    }

    public boolean isOccupied() {
        return this.piece != null;
    }

    public String getTileMapName() {
        return tileMapName;
    }

    public void setTileMapName(String tileMapName) {
        this.tileMapName = tileMapName;
    }

    public int getTileNumber() {
        return tileNumber;
    }

    public void setTileNumber(int tileNumber) {
        this.tileNumber = tileNumber;
    }

    public Piece getPiece() {
        return piece;
    }

    public void setPiece(Piece piece) {
        this.piece = piece;
    }

    public Point getPosition() {
        return position;
    }

    public void setPosition(Point position) {
        this.position = position;
    }
}
