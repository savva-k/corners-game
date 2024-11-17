package com.playcorners.model.tiles;

import java.util.Map;

public record TileMap(String name, String imageUrl, int tileWidth, int tileHeight, Map<String, Animation> animations) {
}
