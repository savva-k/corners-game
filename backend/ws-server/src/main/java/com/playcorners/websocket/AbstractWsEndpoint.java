package com.playcorners.websocket;

import com.playcorners.model.Game;
import io.quarkus.logging.Log;
import jakarta.websocket.*;

import java.util.HashSet;
import java.util.Set;

public abstract class AbstractWsEndpoint {

    protected final Set<Session> sessions = new HashSet<>();

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
