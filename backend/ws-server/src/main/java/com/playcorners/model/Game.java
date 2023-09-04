package com.playcorners.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;

public class Game {
    private final String id;
    private Player player1;
    private Player player2;
    private Player initiator;
    private Player winner;
    private List<Turn> turns;
    private Piece currentTurn;
    private Piece player1Piece = Piece.WHITE;
    private Piece player2Piece = Piece.BLACK;
    private Map<String, Piece> field;
    private boolean isStarted;
    private boolean isFinished;
    private FinishReason finishReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String mistakeAtField;
    private List<String> availableMoves;

    public Game(String id) {
        this.id = id;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public Player getPlayer1() {
        return player1;
    }

    public void setPlayer1(Player player1) {
        this.player1 = player1;
    }

    public Player getPlayer2() {
        return player2;
    }

    public void setPlayer2(Player player2) {
        this.player2 = player2;
    }

    public Player getInitiator() {
        return initiator;
    }

    public void setInitiator(Player initiator) {
        this.initiator = initiator;
    }

    public Player getWinner() {
        return winner;
    }

    public void setWinner(Player winner) {
        this.winner = winner;
    }

    public List<Turn> getTurns() {
        return turns;
    }

    public void setTurns(List<Turn> turns) {
        this.turns = turns;
    }

    public Piece getCurrentTurn() {
        return currentTurn;
    }

    public Player getCurrentPlayer() {
        if (!this.isStarted) return null;
        return player1Piece == currentTurn ? player1 : player2;
    }

    public void setCurrentTurn(Piece currentTurn) {
        this.currentTurn = currentTurn;
    }

    public Piece getPlayer1Piece() {
        return player1Piece;
    }

    public void setPlayer1Piece(Piece player1Piece) {
        this.player1Piece = player1Piece;
    }

    public Piece getPlayer2Piece() {
        return player2Piece;
    }

    public void setPlayer2Piece(Piece player2Piece) {
        this.player2Piece = player2Piece;
    }

    public Map<String, Piece> getField() {
        return field;
    }

    public void setField(Map<String, Piece> field) {
        this.field = field;
    }

    @JsonProperty(value="isStarted")
    public boolean isStarted() {
        return isStarted;
    }

    public void setStarted(boolean started) {
        isStarted = started;
    }

    @JsonProperty(value="isFinished")
    public boolean isFinished() {
        return isFinished;
    }

    public void setFinished(boolean finished) {
        isFinished = finished;
    }

    public FinishReason getFinishReason() {
        return finishReason;
    }

    public void setFinishReason(FinishReason finishReason) {
        this.finishReason = finishReason;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public void updateTime() {
        this.updatedAt = LocalDateTime.now();
    }

    public String getMistakeAtField() {
        return mistakeAtField;
    }

    public void setMistakeAtField(String mistakeAtField) {
        this.mistakeAtField = mistakeAtField;
    }

    public List<String> getAvailableMoves() {
        return availableMoves;
    }

    public void setAvailableMoves(List<String> availableMoves) {
        this.availableMoves = availableMoves;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Game game = (Game) o;
        return Objects.equals(id, game.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
