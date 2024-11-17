package com.playcorners.model;

import java.util.List;

public record Turn(Point from, Point to, List<Point> path) {}
