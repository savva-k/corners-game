package com.playcorners.websocket.handler;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.playcorners.model.Game;
import com.playcorners.service.CornersGameService;
import com.playcorners.service.PlayerService;
import com.playcorners.websocket.message.GameTurn;
import com.playcorners.websocket.message.LocalDateTimeTypeAdapter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

public class GameWsHandler extends TextWebSocketHandler {

    private final Logger log = LoggerFactory.getLogger(GameWsHandler.class);
    private final Gson gson = new GsonBuilder()
            .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeTypeAdapter())
            .create();

    private final Map<String, Set<WebSocketSession>> sessions = new ConcurrentHashMap<>();

    private final CornersGameService gameService;
    private final PlayerService playerService;

    public GameWsHandler(CornersGameService gameService, PlayerService playerService) {
        this.gameService = gameService;
        this.playerService = playerService;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        log.info("Game: User joined");
        String gameId = getGameId(session);
        addSession(gameId, session);
        super.afterConnectionEstablished(session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        log.info("Game: User disconnected");
        String gameId = getGameId(session);
        removeSession(gameId, session);
        super.afterConnectionClosed(session, status);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        log.info("Game: Got message: {}", message);
        var gameId = getGameId(session);
        var turn = gson.fromJson(message.getPayload(), GameTurn.class);
        var game = gameService.makeTurn(gameId, playerService.getPlayer(session), turn.from(), turn.to());

        // todo: handle exceptions - only to sender, otherwise broadcast

        sessions.get(gameId).forEach(s -> {
            try {
                s.sendMessage(new TextMessage(gson.toJson(game)));
            } catch (IOException e) {
                log.error("Game: Cannot send update to a user, game id: {}", gameId);
                log.debug("Game: Unable to send the following payload: {}", gson.toJson(game));
            }
        });
    }

    private String getGameId(WebSocketSession session) {
        String gameId = (String) session.getAttributes().get("gameId");

        if (StringUtils.hasLength(gameId)) {
            return gameId;
        }

        throw new RuntimeException("Empty game id");
    }

    private void addSession(String gameId, WebSocketSession session) {
        Set<WebSocketSession> gameSessions = sessions.getOrDefault(gameId, new HashSet<>());
        gameSessions.add(session);
        sessions.put(gameId, gameSessions);
    }

    private void removeSession(String gameId, WebSocketSession session) {
        Set<WebSocketSession> gameSessions = sessions.getOrDefault(gameId, new HashSet<>());
        gameSessions.remove(session);
        sessions.put(gameId, gameSessions);
    }

}
