package com.playcorners.model;

import java.util.List;

public record Turn(String from, String to, List<String> path) {}
