package com.playcorners.websocket;

import com.playcorners.model.Game;
import com.playcorners.service.GameService;
import com.playcorners.service.PlayerService;
import com.playcorners.websocket.message.*;
import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;

import java.util.HashSet;
import java.util.Set;

@ServerEndpoint(value = "/ws/lobby", encoders = {
        ObjectToJsonEncoder.class
})
@ApplicationScoped
public class LobbyWsEndpoint {

    @Inject
    private GameService gameService;

    @Inject
    private PlayerService playerService;

    private final Set<Session> sessions = new HashSet<>();

    @OnOpen
    public void onOpen(Session session) {
        sessions.add(session);
        Log.info("Lobby: user connected, total is " + sessions.size());
    }

    @OnClose
    public void onClose(Session session) {
        Log.info("Lobby: user disconnected");
        sessions.remove(session);
    }

    @OnError
    public void onError(Throwable throwable) {
        Log.error("Lobby: WS error: ", throwable);
    }

    @OnMessage
    public void onMessage(String message) {
        Log.error("Lobby: WS error: A user should not send messages here, but sent: " + message);
    }

    public void broadcastGameUpdate(Game game) {
        for (Session session : sessions) {
            Log.info("Sending game update to " + session.getId());
            session.getAsyncRemote().sendObject(game, sendResult -> {
                if (sendResult.getException() != null) {
                    Log.error("Can't send WS message: " + sendResult.getException().getMessage());
                }
            });
        }
    }

}
