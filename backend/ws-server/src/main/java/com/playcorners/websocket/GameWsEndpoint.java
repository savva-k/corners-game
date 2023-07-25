package com.playcorners.websocket;

import com.playcorners.service.GameService;
import com.playcorners.service.PlayerService;
import com.playcorners.websocket.message.JsonToGameTurnDecoder;
import com.playcorners.websocket.message.ObjectToJsonEncoder;
import com.playcorners.websocket.message.records.GameTurn;
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

@ServerEndpoint(value = "/ws/game/{gameId}", decoders = {
        JsonToGameTurnDecoder.class
}, encoders = {
        ObjectToJsonEncoder.class
})
@ApplicationScoped
public class GameWsEndpoint extends AbstractWsEndpoint {

    @Inject
    private GameService gameService;

    @Inject
    private PlayerService playerService;

    @OnOpen
    public void onOpen(Session session, @PathParam("gameId") String gameId) {
        sessions.add(session);
        Log.info("Game: user connected");
    }

    @OnClose
    public void onClose(Session session, @PathParam("gameId") String gameId) {
        Log.info("Game: user disconnected");
        sessions.remove(session);
    }

    @OnError
    public void onError(Session session, @PathParam("gameId") String gameId, Throwable throwable) {
        Log.error("Game: error: ", throwable);
    }

    @OnMessage
    public void onMessage(Session session, @PathParam("gameId") String gameId, GameTurn message) {
        Log.info("Got message: " + message);
    }

}
