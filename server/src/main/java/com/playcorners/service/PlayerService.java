package com.playcorners.service;

import com.playcorners.model.Player;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class PlayerService {


    public PlayerService() {}

    private final Map<String, Player> players = new HashMap<>();

    public Player getPlayer() {
        SecurityContext context = SecurityContextHolder.getContext();
        var name = context.getAuthentication().getName();
        var player = players.get(name);

        if (player != null) {
            return player;
        }

        player = new Player(
                name,
                context.getAuthentication().getAuthorities().stream()
                        .map(Objects::toString)
                        .collect(Collectors.toSet())
        );

        players.put(name, player);
        return player;
    }

}
