package com.playcorners.service;

import com.playcorners.controller.message.GameError;
import com.playcorners.model.Game;
import com.playcorners.model.Piece;
import com.playcorners.model.Player;
import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.*;
import java.util.stream.Collectors;

import static com.playcorners.controller.message.Reason.LOBBY_IS_FULL;

@ApplicationScoped
public class GameService {

    private final List<String> whiteStartPositions = List.of("a1", "b1", "c1", "d1", "a2", "b2", "c2", "d2", "a3", "b3", "c3", "d3");

    private final List<String> blackStartPositions = List.of("h8", "g8", "f8", "e8", "h7", "g7", "f7", "e7", "h6", "g6", "f6", "e6");

    private final List<Game> games = new ArrayList<>();

    public List<Game> getAllGames() {
        return games;
    }

    public Optional<Game> getGameById(String gameId) {
        return games.stream().filter(g -> g.getId().equals(gameId)).findFirst();
    }

    public Optional<Game> createGame(Player initiator) {
        Log.info("Creating a new game. Currently we have " + games.size() + " games");
        if (games.stream().anyMatch(g -> Objects.equals(initiator, g.getInitiator()))) {
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

        games.add(game);

        return Optional.of(game);
    }

    public Game joinGame(Player player, String gameId) {
        Game game = getGameById(gameId).orElseThrow();
        setSecondPlayer(game, player);
        game.setStarted(true);
        game.updateTime();
        return game;
    }

    private String getUniqueId() {
        var ref = new Object() {
            String uuid = UUID.randomUUID().toString();
        };
        while (games.stream().anyMatch(g -> g.getId().equals(ref.uuid))) {
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
}
