package com.playcorners.service;

import com.playcorners.model.Player;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketSession;

import java.util.HashMap;
import java.util.Map;

@Service
public class PlayerService {

    public PlayerService() {
    }

    private final Map<String, Player> players = new HashMap<>();

    public Player getPlayer(WebSocketSession session) {
        if (session.getPrincipal() == null) {
            throw new IllegalStateException("User is not authorized");
        }
        var name = session.getPrincipal().getName();
        return getOrCreatePlayer(name);
    }

    private Player getOrCreatePlayer(String name) {
        var player = players.get(name);

        if (player != null) {
            return player;
        }

        player = new Player(name);
        players.put(name, player);
        return player;
    }
}
