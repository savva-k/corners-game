package com.playcorners.websocket.handler;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.playcorners.websocket.message.MessageDispatcher;
import com.playcorners.websocket.message.SessionUtil;
import com.playcorners.websocket.message.handler.IncomingMessageHandler;
import com.playcorners.websocket.message.incoming.IncomingMessage;
import com.playcorners.websocket.message.json.GsonInstance;
import com.playcorners.websocket.message.outgoing.GameResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

public class GameWsHandler extends TextWebSocketHandler implements WsMessageSender {

    private final Logger log = LoggerFactory.getLogger(GameWsHandler.class);
    private final Map<String, Set<WebSocketSession>> sessions = new ConcurrentHashMap<>();
    private final MessageDispatcher messageDispatcher;
    private final Gson gson = GsonInstance.gson;

    public GameWsHandler(List<IncomingMessageHandler<?>> messageHandlers) {
        this.messageDispatcher = new MessageDispatcher(this, messageHandlers);
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String gameId = SessionUtil.getGameId(session);
        String username = SessionUtil.getUsername(session);
        log.info("{} joined to game {}", username, gameId);
        addSession(gameId, session);
        super.afterConnectionEstablished(session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String gameId = SessionUtil.getGameId(session);
        String username = SessionUtil.getUsername(session);
        log.info("{} disconnected from game {}", username, gameId);
        removeSession(gameId, session);
        super.afterConnectionClosed(session, status);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        log.info("Game: Got message: {}", message);
        IncomingMessage incomingMessage;

        try {
            incomingMessage = gson.fromJson(message.getPayload(), IncomingMessage.class);
            messageDispatcher.dispatch(session, incomingMessage);
        } catch (JsonSyntaxException e) {
            log.error("Malformed incoming message {}", session.getRemoteAddress());
        }
    }

    @Override
    public <T> void toAll(String gameId, GameResponse<T> response) {
        sessions.get(gameId).forEach(s -> toParticular(s, response));
    }

    @Override
    public <T> void toAllExceptCurrent(String gameId, WebSocketSession session, GameResponse<T> response) {
        sessions.get(gameId)
                .stream()
                .filter(s -> !s.equals(session))
                .forEach(s -> toParticular(s, response));
    }

    @Override
    public <T> void toParticular(WebSocketSession session, GameResponse<T> response) {
        try {
            session.sendMessage(new TextMessage(gson.toJson(response)));
        } catch (IOException e) {
            log.error("Game: Cannot send update to a particular user");
            log.debug("Game: Unable to send the following payload: {}", gson.toJson(response));
        }
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
