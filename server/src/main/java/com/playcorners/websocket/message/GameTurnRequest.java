package com.playcorners.websocket.message;

import com.playcorners.model.Point;

public record GameTurnRequest(Point from, Point to) {
}
