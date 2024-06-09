package com.playcorners.service;

import com.playcorners.model.Player;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.HashMap;
import java.util.Map;

@ApplicationScoped
public class PlayerService {

    @Inject
    private SecurityIdentity identity;

    private final Map<String, Player> players = new HashMap<>();

    public Player getPlayer() {
        var name = identity.getPrincipal().getName();
        var player = players.get(name);

        if (player != null) {
            return player;
        }

        player = new Player(name, identity.getRoles());
        players.put(name, player);
        return player;
    }

}
