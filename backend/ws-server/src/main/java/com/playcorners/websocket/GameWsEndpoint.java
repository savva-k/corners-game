package com.playcorners.websocket;

import com.playcorners.service.GameService;
import com.playcorners.service.PlayerService;
import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnError;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;

@ServerEndpoint(value = "/ws/game/{gameId}")
@ApplicationScoped
public class GameWsEndpoint {

    @Inject
    private GameService gameService;

    @Inject
    private PlayerService playerService;

    @OnOpen
    public void onOpen(Session session, @PathParam("gameId") String gameId) {
        Log.info("New user connected");
    }

    @OnClose
    public void onClose(Session session, @PathParam("gameId") String gameId) {
        Log.info("Connection closed");
    }

    @OnError
    public void onError(Session session, @PathParam("gameId") String gameId, Throwable throwable) {
        Log.error("WS error: ", throwable);
    }

    @OnMessage
    public void onMessage(Session session, String message, @PathParam("gameId") String gameId) {
        if ("hello".equals(message)) session.getAsyncRemote().sendText("hey");
    }

}
