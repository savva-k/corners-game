package com.playcorners.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;

public class Game {
    private final String id;
    private final GameMap gameMap;
    private Player player1;
    private Player player2;
    private Player initiator;
    private Player winner;
    private List<Turn> turns;
    private Piece currentTurn;
    private boolean isStarted;
    private boolean isFinished;
    private FinishReason finishReason;
    private LocalDateTime createdAt;
    private LocalDateTime startedAt;

    public Game(String id, GameMap gameMap) {
        this.id = id;
        this.gameMap = gameMap;
        this.createdAt = LocalDateTime.now();
        this.startedAt = LocalDateTime.now();
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

    public Player getPlayerByUserName(String username) {
        if (player1 != null && player1.name().equals(username)) {
            return player1;
        } else if (player2 != null && player2.name().equals(username)) {
            return player2;
        }
        return null;
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
        return player1.piece() == currentTurn ? player1 : player2;
    }

    public Player getPlayerByPiece(Piece piece) {
        return player1.piece()  == piece ? player1 : player2;
    }

    public void setCurrentTurn(Piece currentTurn) {
        this.currentTurn = currentTurn;
    }

    public boolean isJoinable() {
        return this.player1 == null || this.player2 == null;
    }

    public Piece getUntakenPiece() {
        if (isJoinable()) {
            if (this.player1 != null) {
                return player1.piece().opposite();
            } else if (this.player2 != null) {
                return player2.piece().opposite();
            }
        }
        return null;
    }

    @JsonProperty(value = "isStarted")
    public boolean isStarted() {
        return isStarted;
    }

    public void setStarted(boolean started) {
        if (started && this.startedAt == null) {
            this.startedAt = LocalDateTime.now();
        }
        isStarted = started;
    }

    @JsonProperty(value = "isFinished")
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

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public GameMap getGameMap() {
        return this.gameMap;
    }

    public Map<Point, Cell> getField() {
        return this.gameMap.field();
    }

    public Size2D getMapSize() {
        return this.gameMap.size();
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
