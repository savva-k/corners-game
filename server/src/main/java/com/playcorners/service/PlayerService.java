package com.playcorners.service;

import com.playcorners.model.Player;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketSession;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PlayerService {

    public PlayerService() {
    }

    private final Map<String, Player> players = new HashMap<>();

    public Player getPlayer() {
        SecurityContext context = SecurityContextHolder.getContext();
        var name = context.getAuthentication().getName();
        var roles = getRoles(context.getAuthentication().getAuthorities());
        return getOrCreatePlayer(name, roles);
    }

    public Player getPlayer(WebSocketSession session) {
        if (session.getPrincipal() == null) {
            throw new IllegalStateException("User is not authorized");
        }
        var name = session.getPrincipal().getName();
        var roles = getRoles(((UsernamePasswordAuthenticationToken) session.getPrincipal()).getAuthorities());
        return getOrCreatePlayer(name, roles);
    }

    private Set<String> getRoles(Collection<? extends GrantedAuthority> authorities) {
        return authorities.stream()
                .map(Objects::toString)
                .collect(Collectors.toSet());
    }

    private Player getOrCreatePlayer(String name, Set<String> roles) {
        var player = players.get(name);

        if (player != null) {
            return player;
        }

        player = new Player(name, roles);
        players.put(name, player);
        return player;
    }
}
