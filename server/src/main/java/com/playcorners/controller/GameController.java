package com.playcorners.controller;

import com.playcorners.service.exception.CommonGameException;
import com.playcorners.service.exception.Reason;
import com.playcorners.model.Game;
import com.playcorners.service.CornersGameService;
import com.playcorners.service.PlayerService;
import com.playcorners.websocket.handler.LobbyWsHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/games")
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

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping
    public List<Game> getAllGames() {
        return cornersGameService.getGames();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("/{gameId}")
    public Game getGameById(@PathVariable("gameId") String gameId) {
        return cornersGameService.getGameById(gameId).orElseThrow(() -> new CommonGameException(Reason.GAME_NOT_FOUND));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @PostMapping
    public ResponseEntity<Object> createGame() {
        var game = cornersGameService.createGame(playerService.getPlayer());
        lobbyWsHandler.broadcastGameUpdate(game);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @PostMapping("/{gameId}/join")
    public ResponseEntity<Object> joinGame(@PathVariable("gameId") String gameId) {
        lobbyWsHandler.broadcastGameUpdate(cornersGameService.joinGame(playerService.getPlayer(), gameId));
        return ResponseEntity.ok().build();
    }

}
