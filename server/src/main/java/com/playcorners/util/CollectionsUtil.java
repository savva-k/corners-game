package com.playcorners.util;

import com.playcorners.model.Cell;
import com.playcorners.model.Piece;
import com.playcorners.model.Point;

import java.util.HashMap;
import java.util.Map;

public class CollectionsUtil {
    public static Map<Point, Piece> copyPiecePositions(Map<Point, Cell> source) {
        var copy = new HashMap<Point, Piece>();
        for (var key : source.keySet()) {
            copy.put(key, source.get(key).getPiece());
        }
        return copy;
    }

}
