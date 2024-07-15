package com.playcorners.controller;

import com.playcorners.controller.message.GameError;
import com.playcorners.controller.message.Reason;
import com.playcorners.model.Game;
import com.playcorners.service.CornersGameService;
import com.playcorners.service.PlayerService;
import com.playcorners.websocket.handler.LobbyWsHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/games")
@PreAuthorize("hasAnyRole('ADMIN', 'USER')")
public class GameController {

    private final CornersGameService cornersGameService;

    private final PlayerService playerService;

    private final LobbyWsHandler lobbyWsHandler;

    @Autowired
    public GameController(CornersGameService cornersGameService, PlayerService playerService, LobbyWsHandler lobbyWsHandler) {
        this.cornersGameService = cornersGameService;
        this.playerService = playerService;
        this.lobbyWsHandler = lobbyWsHandler;
    }

    @GetMapping
    public List<Game> getAllGames(@RequestHeader("userName") String userName) {
        return cornersGameService.getGames();
    }

    @GetMapping("/{gameId}")
    public Game getGameById(@PathVariable("gameId") String gameId) {
        return cornersGameService.getGameById(gameId).orElseThrow(() -> new GameError(Reason.GAME_NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<Object> createGame() {
        cornersGameService.createGame(playerService.getPlayer())
                .ifPresentOrElse(
                        game -> lobbyWsHandler.broadcastGameUpdate(game),
                        () -> {
                            throw new GameError(Reason.GAME_NOT_CREATED);
                        }
                );

        return ResponseEntity.ok().build();
    }

    @PostMapping("/join")
    public ResponseEntity<Object> joinGame(@RequestHeader("gameId") String gameId) {
        lobbyWsHandler.broadcastGameUpdate(cornersGameService.joinGame(playerService.getPlayer(), gameId));
        return ResponseEntity.ok().build();
    }

}
