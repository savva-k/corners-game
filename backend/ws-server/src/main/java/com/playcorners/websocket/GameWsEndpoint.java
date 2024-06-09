package com.playcorners.websocket;

import com.playcorners.model.Game;
import com.playcorners.service.CornersGameService;
import com.playcorners.service.PlayerService;
import com.playcorners.websocket.message.JsonToGameTurnDecoder;
import com.playcorners.websocket.message.ObjectToJsonEncoder;
import com.playcorners.websocket.message.records.GameTurn;
import io.quarkus.logging.Log;
import jakarta.annotation.security.RolesAllowed;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnError;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@ServerEndpoint(value = "/ws/game/{gameId}", decoders = {
        JsonToGameTurnDecoder.class
}, encoders = {
        ObjectToJsonEncoder.class
})
@ApplicationScoped
public class GameWsEndpoint {

    @Inject
    private CornersGameService cornersGameService;

    @Inject
    private PlayerService playerService;

    private final Map<String, Set<Session>> sessions = new ConcurrentHashMap<>();

    @OnOpen
    @RolesAllowed({"user", "admin"})
    public void onOpen(Session session, @PathParam("gameId") String gameId) {
        Log.info("Game: user connected");
        addSession(gameId, session);
    }

    @OnClose
    public void onClose(Session session, @PathParam("gameId") String gameId) {
        Log.info("Game: user disconnected");
        removeSession(gameId, session);
    }

    @OnError
    public void onError(Session session, @PathParam("gameId") String gameId, Throwable throwable) {
        Log.error("Game: error: ", throwable);
    }

    @OnMessage
    public void onMessage(Session session, @PathParam("gameId") String gameId, GameTurn message) {
        // todo: do not log user sent messages
        Log.info("Got message: " + message);
        Game game = cornersGameService.makeTurn(gameId, playerService.getPlayer(), message.from(), message.to());

        // todo: handle exceptions - only to sender, otherwise broadcast

        sessions.get(gameId).forEach(s -> s.getAsyncRemote().sendObject(game));
    }

    private void addSession(String gameId, Session session) {
        Set<Session> gameSessions = sessions.getOrDefault(gameId, new HashSet<>());
        gameSessions.add(session);
        sessions.put(gameId, gameSessions);
    }

    private void removeSession(String gameId, Session session) {
        Set<Session> gameSessions = sessions.getOrDefault(gameId, new HashSet<>());
        gameSessions.remove(session);
        sessions.put(gameId, gameSessions);
    }

}
