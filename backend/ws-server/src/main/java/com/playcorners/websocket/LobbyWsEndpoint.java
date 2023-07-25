package com.playcorners.websocket;

import com.playcorners.service.GameService;
import com.playcorners.service.PlayerService;
import com.playcorners.websocket.message.*;
import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;

@ServerEndpoint(value = "/ws/lobby", encoders = {
        ObjectToJsonEncoder.class
})
@ApplicationScoped
public class LobbyWsEndpoint extends AbstractWsEndpoint {

    @Inject
    private GameService gameService;

    @Inject
    private PlayerService playerService;

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

}
