package com.playcorners.model;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

public class Player {
    private String name;
    private Set<String> roles;

    public Player() {
    }

    public Player(String name, Set<String> roles) {
        this.name = name;
        this.roles = new HashSet<>(roles);
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Player player = (Player) o;
        return Objects.equals(name, player.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name);
    }

    @Override
    public String toString() {
        return "Player{name='" + name + "'}";
    }
}
