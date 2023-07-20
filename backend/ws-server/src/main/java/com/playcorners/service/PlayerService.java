package com.playcorners.service;

import com.playcorners.model.Player;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.*;

@ApplicationScoped
public class PlayerService {

    private final Map<String, Player> players = new HashMap<>();

    public Optional<Player> createPlayer(String name) {
        var newPlayer = new Player(name);
        players.put(name, newPlayer);
        return Optional.of(newPlayer);
    }

    public Optional<Player> getPlayerByName(String name) {
        return Optional.ofNullable(players.get(name));
    }

}
