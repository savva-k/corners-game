package com.playcorners.websocket;

import com.playcorners.model.Game;
import com.playcorners.service.CornersGameService;
import com.playcorners.service.PlayerService;
import com.playcorners.websocket.message.ObjectToJsonEncoder;
import io.quarkus.logging.Log;
import jakarta.annotation.security.RolesAllowed;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnError;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;

import java.util.HashSet;
import java.util.Set;

@ServerEndpoint(value = "/ws/lobby", encoders = {
        ObjectToJsonEncoder.class
})
@ApplicationScoped
public class LobbyWsEndpoint {

    @Inject
    private CornersGameService cornersGameService;

    @Inject
    private PlayerService playerService;

    private final Set<Session> sessions = new HashSet<>();

    @OnOpen
    @RolesAllowed({"user", "admin"})
    public void onOpen(Session session) {
        sessions.add(session);
        Log.info("Lobby: user connected, total is " + sessions.size() + ", principal = " + session.getUserPrincipal().getName());
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
        throw new IllegalArgumentException("This error should not have happened");
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
