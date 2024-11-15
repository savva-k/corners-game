package com.playcorners.service;

import com.playcorners.controller.message.GameError;
import com.playcorners.controller.message.Reason;
import com.playcorners.model.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.playcorners.controller.message.Reason.LOBBY_IS_FULL;

@Service
public class CornersGameService {

    Logger log = LoggerFactory.getLogger(CornersGameService.class);

    private final PathService pathService;

    public CornersGameService(PathService pathService) {
        this.pathService = pathService;
    }

    private final List<String> whiteStartPositions = List.of("a1", "b1", "c1", "d1", "a2", "b2", "c2", "d2", "a3", "b3", "c3", "d3");

    private final List<String> blackStartPositions = List.of("h8", "g8", "f8", "e8", "h7", "g7", "f7", "e7", "h6", "g6", "f6", "e6");

//    Positions with 1 move to finish a game - for testing purpose
//    private final List<String> whiteStartPositions = List.of("h8", "g8", "f8", "e8", "h7", "g7", "f5", "e7", "h6", "g6", "f6", "e6");
//
//    private final List<String> blackStartPositions = List.of("a1", "b1", "c1", "d1", "a2", "b4", "c2", "d2", "a3", "b3", "c3", "d3");

    private final List<String> whiteWinPositions = List.of("h8", "g8", "f8", "e8", "h7", "g7", "f7", "e7", "h6", "g6", "f6", "e6");

    private final List<String> blackWinPositions = List.of("a1", "b1", "c1", "d1", "a2", "b2", "c2", "d2", "a3", "b3", "c3", "d3");

    private List<Game> games = new ArrayList<>();

    public List<Game> getGames() {
        return games;
    }

    public Optional<Game> getGameById(String gameId) {
        return getGames().stream().filter(g -> g.getId().equals(gameId)).findFirst();
    }

    public Game createGame(Player initiator) {
        log.info("Creating a new game. Currently we have {} games", getGames().size());
        if (getGames().stream().anyMatch(g -> Objects.equals(initiator, g.getInitiator()) && !g.isStarted())) {
            throw new GameError(Reason.CANNOT_HAVE_MORE_THAN_ONE_PENDING_GAME);
        }

        var game = new Game(getUniqueId());
        game.setCurrentTurn(Piece.WHITE);
        game.setPlayer1(initiator);
        game.setInitiator(initiator);
        game.setTurns(new ArrayList<>());
        game.setAvailableMoves(new ArrayList<>());
        game.setField(new HashMap<>());
        game.getField().putAll(whiteStartPositions.stream().collect(
                Collectors.toMap(position -> position, position -> Piece.WHITE))
        );
        game.getField().putAll(blackStartPositions.stream().collect(
                Collectors.toMap(position -> position, position -> Piece.BLACK))
        );

        getGames().add(game);
        return game;
    }

    public Game joinGame(Player player, String gameId) {
        Game game = getGameById(gameId).orElseThrow();
        setSecondPlayer(game, player);
        game.setStarted(true);
        game.updateTime();
        return game;
    }

    public Turn makeTurn(String gameId, Player player, String from, String to) {
        return getGameById(gameId).map(game -> {
            if (validatePlayersTurn(game, player, from, to)) {
                movePieces(game, from, to);
                checkWinner(game);
                switchPlayersTurn(game);
            }
            return game.getTurns().getLast();
        }).orElseThrow(() -> new GameError(Reason.GAME_NOT_FOUND));
    }

    public List<String> getWhiteStartPositions() {
        return whiteStartPositions;
    }

    public List<String> getBlackStartPositions() {
        return blackStartPositions;
    }

    public void cleanGames() {
        this.games = new ArrayList<>();
    }

    private String getUniqueId() {
        var ref = new Object() {
            String uuid = UUID.randomUUID().toString();
        };
        while (getGames().stream().anyMatch(g -> g.getId().equals(ref.uuid))) {
            ref.uuid = UUID.randomUUID().toString();
        }
        return ref.uuid;
    }

    private void setSecondPlayer(Game game, Player secondPlayer) {
        if (game.getPlayer1() == null) {
            game.setPlayer1(secondPlayer);
        } else if (game.getPlayer2() == null) {
            game.setPlayer2(secondPlayer);
        } else {
            throw new GameError(LOBBY_IS_FULL);
        }
    }

    private boolean validatePlayersTurn(Game game, Player player, String from, String to) {
        if (Objects.equals(game.getPlayer1(), player)) {
            if (game.getPlayer1Piece() != game.getCurrentTurn()) {
                throw new GameError(Reason.OPPONENTS_TURN_NOW);
            }
        } else if (Objects.equals(game.getPlayer2(), player)) {
            if (game.getPlayer2Piece() != game.getCurrentTurn()) {
                throw new GameError(Reason.OPPONENTS_TURN_NOW);
            }
        } else {
            throw new GameError(Reason.NOT_USERS_GAME);
        }

        List<String> availableMoves = pathService.getAvailableMoves(game, from);
        game.setAvailableMoves(availableMoves);
        var valid = availableMoves.contains(to);
        if (!valid) {
            game.setMistakeAtField(to);
        }
        return valid;
    }

    private void movePieces(Game game, String from, String to) {
        Piece pieceFrom = game.getField().get(from);
        Piece pieceTo = game.getField().get(to);
        if (pieceFrom == null) throw new GameError(Reason.SOURCE_IS_EMPTY);
        if (pieceTo != null) throw new GameError(Reason.DESTINATION_IS_TAKEN);

        if (game.getTurns() == null) game.setTurns(new LinkedList<>());

        game.getTurns().add(new Turn(from, to, pathService.getJumpsPath(game.getField(), from, to)));
        game.getField().put(from, null);
        game.getField().put(to, pieceFrom);
    }

    private void checkWinner(Game game) {
        // todo: check if Black can finish game in one move
        // We check for a winner only when it's Blacks' turn. They have one turn to finish, as Whites started
        if (game.getCurrentTurn() == Piece.WHITE) return;

        if (isWinPosition(game.getField(), Piece.BLACK)) {
            game.setFinished(true);
            if (isWinPosition(game.getField(), Piece.WHITE)) {
                game.setFinishReason(FinishReason.DrawBothHome);
            } else {
                game.setWinner(game.getPlayerByPiece(Piece.BLACK));
                game.setFinishReason(FinishReason.BlackWon);
            }
        } else if (isWinPosition(game.getField(), Piece.WHITE)) {
            game.setFinished(true);
            game.setWinner(game.getPlayerByPiece(Piece.WHITE));
            game.setFinishReason(FinishReason.WhiteWon);
        }
    }

    private void switchPlayersTurn(Game game) {
        game.setCurrentTurn(game.getCurrentTurn() == Piece.WHITE ? Piece.BLACK : Piece.WHITE);
    }

    private boolean isWinPosition(Map<String, Piece> field, Piece piece) {
        if (piece == Piece.WHITE) {
            return whiteWinPositions.stream().allMatch(whiteWinPos -> Objects.equals(field.get(whiteWinPos), Piece.WHITE));
        } else {
            return blackWinPositions.stream().allMatch(blackWinPos -> Objects.equals(field.get(blackWinPos), Piece.BLACK));
        }
    }
}
