package com.playcorners.websocket.handler;

import com.google.gson.Gson;
import com.playcorners.model.Game;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

public class LobbyWsHandler extends TextWebSocketHandler {

    private final Logger log = LoggerFactory.getLogger(LobbyWsHandler.class);
    private final Set<WebSocketSession> sessions = new HashSet<>();
    private final Gson gson = new Gson();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        log.info("Lobby: User joined");
        sessions.add(session);
        super.afterConnectionEstablished(session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        log.info("Lobby: User disconnected");
        sessions.remove(session);
        super.afterConnectionClosed(session, status);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        log.error("Lobby: WS error: A user should not send messages here, but someone sent");
        throw new IllegalArgumentException("This error should not have happened");
    }

    public void broadcastGameUpdate(Game game) {
        for (WebSocketSession session : sessions) {
            log.info("Lobby: Sending game update to {}", session.getId());

            try {
                session.sendMessage(new TextMessage(gson.toJson(game)));
            } catch (IOException e) {
                log.error("Lobby: Can't send WS message: {}", e.getMessage());
            }
        }
    }

}
