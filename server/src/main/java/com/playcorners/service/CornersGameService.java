package com.playcorners.service;

import com.playcorners.model.FinishReason;
import com.playcorners.model.Game;
import com.playcorners.model.Turn;
import com.playcorners.model.Piece;
import com.playcorners.model.Player;
import com.playcorners.model.Point;
import com.playcorners.model.GameOver;
import com.playcorners.service.exception.CommonGameException;
import com.playcorners.service.exception.TurnValidationException;
import com.playcorners.service.exception.Reason;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

import static com.playcorners.service.exception.Reason.LOBBY_IS_FULL;

@Service
public class CornersGameService {

    Logger log = LoggerFactory.getLogger(CornersGameService.class);

    private final GameMapService gameMapService;
    private final TurnValidator turnValidator;
    private final PathService pathService;

    public CornersGameService(GameMapService gameMapService, PathService pathService, TurnValidator turnValidator) {
        this.gameMapService = gameMapService;
        this.pathService = pathService;
        this.turnValidator = turnValidator;
    }

    private List<Game> games = new ArrayList<>();

    public List<Game> getGames() {
        return games;
    }

    public Optional<Game> getGameById(String gameId) {
        return getGames().stream().filter(g -> g.getId().equals(gameId)).findFirst();
    }

    public Game createGame(Player initiator, String mapName) {
        log.info("Creating a new game. Currently we have {} games", getGames().size());
        if (getGames().stream().anyMatch(g -> Objects.equals(initiator, g.getInitiator()) && !g.isStarted())) {
            throw new CommonGameException(Reason.CANNOT_HAVE_MORE_THAN_ONE_PENDING_GAME);
        }

        var gameMap = gameMapService.getGameMap(mapName);
        var game = new Game(getUniqueId(), gameMap);

        game.setCurrentTurn(Piece.WHITE);
        game.setPlayer1(initiator);
        game.setInitiator(initiator);
        game.setTurns(new ArrayList<>());

        List.of(Piece.WHITE, Piece.BLACK)
                .forEach(piece -> game.getGameMap().startPositions().get(piece)
                        .forEach(startPos -> game.getField().get(startPos).setPiece(piece))
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

    public Turn makeTurn(String gameId, Player player, Point from, Point to) {
        return getGameById(gameId).map(game -> {
            turnValidator.validateTurnConditions(game, player);
            var turnValidation = turnValidator.validatePlayersTurn(game, from, to);
            if (turnValidation.isValid()) {
                movePieces(game, from, to);
                checkWinner(game);
                switchPlayersTurn(game);
            } else {
                throw new TurnValidationException(Reason.INVALID_TURN, turnValidation);
            }
            return game.getTurns().getLast();
        }).orElseThrow(() -> new CommonGameException(Reason.GAME_NOT_FOUND));
    }

    public Optional<GameOver> checkForGameOver(String gameId) {
        var game = getGameById(gameId).orElseThrow(() -> new CommonGameException(Reason.GAME_NOT_FOUND));
        if (game.isFinished()) {
            return Optional.of(new GameOver(game.getFinishReason(), game.getWinner()));
        }
        return Optional.empty();
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
            throw new CommonGameException(LOBBY_IS_FULL);
        }
    }

    private void movePieces(Game game, Point from, Point to) {
        Piece pieceFrom = game.getField().get(from).getPiece();
        Piece pieceTo = game.getField().get(to).getPiece();
        if (pieceFrom == null) throw new CommonGameException(Reason.SOURCE_IS_EMPTY);
        if (pieceTo != null) throw new CommonGameException(Reason.DESTINATION_IS_TAKEN);

        if (game.getTurns() == null) game.setTurns(new LinkedList<>());

        game.getTurns().add(new Turn(from, to, pathService.getJumpsPath(game.getField(), game.getMapSize(), from, to)));
        game.getField().get(from).setPiece(null);
        game.getField().get(to).setPiece(pieceFrom);
    }

    private void checkWinner(Game game) {
        // todo: check if Black can finish game in one move
        // We check for a winner only when it's Blacks' turn. They have one turn to finish, as Whites started
        if (game.getCurrentTurn() == Piece.WHITE) return;

        if (isWinPosition(game, Piece.BLACK)) {
            game.setFinished(true);
            if (isWinPosition(game, Piece.WHITE)) {
                game.setFinishReason(FinishReason.DrawBothHome);
            } else {
                game.setWinner(game.getPlayerByPiece(Piece.BLACK));
                game.setFinishReason(FinishReason.BlackWon);
            }
        } else if (isWinPosition(game, Piece.WHITE)) {
            game.setFinished(true);
            game.setWinner(game.getPlayerByPiece(Piece.WHITE));
            game.setFinishReason(FinishReason.WhiteWon);
        }
    }

    private void switchPlayersTurn(Game game) {
        game.setCurrentTurn(game.getCurrentTurn() == Piece.WHITE ? Piece.BLACK : Piece.WHITE);
    }

    private boolean isWinPosition(Game game, Piece piece) {
        return new HashSet<>(
                game.getField()
                        .keySet().stream()
                        .filter(pos -> game.getField().get(pos).getPiece() == piece)
                        .toList()
        ).containsAll(game
                .getGameMap()
                .winPositions()
                .get(piece)
        );
    }
}
