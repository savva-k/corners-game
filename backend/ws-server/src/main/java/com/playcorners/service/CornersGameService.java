package com.playcorners.service;

import com.playcorners.controller.message.GameError;
import com.playcorners.controller.message.Reason;
import com.playcorners.model.*;
import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.*;
import java.util.stream.Collectors;

import static com.playcorners.controller.message.Reason.LOBBY_IS_FULL;

@ApplicationScoped
public class CornersGameService {

    @Inject
    private PathService pathService;

    private final List<String> whiteStartPositions = List.of("a1", "b1", "c1", "d1", "a2", "b2", "c2", "d2", "a3", "b3", "c3", "d3");

    private final List<String> blackStartPositions = List.of("h8", "g8", "f8", "e8", "h7", "g7", "f7", "e7", "h6", "g6", "f6", "e6");

    private List<Game> games = new ArrayList<>();

    public List<Game> getGames() {
        return games;
    }

    public Optional<Game> getGameById(String gameId) {
        return getGames().stream().filter(g -> g.getId().equals(gameId)).findFirst();
    }

    public Optional<Game> createGame(Player initiator) {
        Log.info("Creating a new game. Currently we have " + getGames().size() + " games");
        if (getGames().stream().anyMatch(g -> Objects.equals(initiator, g.getInitiator()) && !g.isStarted())) {
            return Optional.empty();
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

        return Optional.of(game);
    }

    public Game joinGame(Player player, String gameId) {
        Game game = getGameById(gameId).orElseThrow();
        setSecondPlayer(game, player);
        game.setStarted(true);
        game.updateTime();
        return game;
    }

    public Game makeTurn(String gameId, Player player, String from, String to) {
        return getGameById(gameId).map(game -> {
            if (validatePlayersTurn(game, player, from, to)) {
                movePieces(game, from, to);
                checkWinner(game);
                switchPlayersTurn(game);
            }
            return game;
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
                throw new GameError(Reason.CANNOT_MAKE_TURN);
            }
        } else if (Objects.equals(game.getPlayer2(), player)) {
            if (game.getPlayer2Piece() != game.getCurrentTurn()) {
                throw new GameError(Reason.CANNOT_MAKE_TURN);
            }
        } else {
            throw new GameError(Reason.CANNOT_MAKE_TURN);
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
        if (pieceFrom == null || pieceTo != null) throw new GameError(Reason.CANNOT_MAKE_TURN);

        if (game.getTurns() == null) game.setTurns(new LinkedList<>());
        // pathService.getJumpsPath(game, from, to) (todo)
        List<String> jumpsPath = Collections.emptyList();
        game.getTurns().add(new Turn(from, to, jumpsPath)); // todo set path

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
                game.setWinner(game.getCurrentPlayer());
                game.setFinishReason(FinishReason.BlackWon);
            }
        } else if (isWinPosition(game.getField(), Piece.WHITE)) {
            game.setFinished(true);
            game.setWinner(game.getCurrentPlayer()); // todo handle last move for Black
            game.setFinishReason(FinishReason.WhiteWon);
        }
    }

    private void switchPlayersTurn(Game game) {
        game.setCurrentTurn(game.getCurrentTurn() == Piece.WHITE ? Piece.BLACK : Piece.WHITE);
    }

    private boolean isWinPosition(Map<String, Piece> field, Piece piece) {
        if (piece == Piece.WHITE) {
            return blackStartPositions.stream().allMatch(whiteWinPos -> Objects.equals(field.get(whiteWinPos), Piece.WHITE));
        } else {
            return whiteStartPositions.stream().allMatch(blackWinPos -> Objects.equals(field.get(blackWinPos), Piece.BLACK));
        }
    }
}
