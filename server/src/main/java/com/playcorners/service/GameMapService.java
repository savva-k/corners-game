package com.playcorners.service;

import com.playcorners.model.Cell;
import com.playcorners.model.GameMap;
import com.playcorners.model.Piece;
import com.playcorners.model.Point;
import com.playcorners.model.Size2D;
import com.playcorners.service.exception.CommonGameException;
import com.playcorners.service.exception.Reason;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class GameMapService {

    private GameMap getDefaultMap() {
        var defaultField = new HashMap<Point, Cell>();

        var width = 8;
        var height = 8;
        var tileMapName = "base-cell";
        var lightTile = 0;
        var darkTile = 1;

        var rowStartsWithDark = false;
        for (int x = 0; x < width; x++) {
            var dark = rowStartsWithDark;
            for (int y = 0; y < height; y++) {
                var pos = new Point(x, y);
                defaultField.put(pos, new Cell(tileMapName, dark ? darkTile : lightTile, pos));
                dark = !dark;
            }
            rowStartsWithDark = !rowStartsWithDark;
        }

        var defaultStartPositions = Map.of(
                Piece.WHITE, List.of(
                        new Point(0, 5), new Point(1, 5), new Point(2, 5), new Point(3, 5),
                        new Point(0, 6), new Point(1, 6), new Point(2, 6), new Point(3, 6),
                        new Point(0, 7), new Point(1, 7), new Point(2, 7), new Point(3, 7)
                ),
                Piece.BLACK, List.of(
                        new Point(4, 0), new Point(5, 0), new Point(6, 0), new Point(7, 0),
                        new Point(4, 1), new Point(5, 1), new Point(6, 1), new Point(7, 1),
                        new Point(4, 2), new Point(5, 2), new Point(6, 2), new Point(7, 2)
                )
        );

        var defaultWinPositions = Map.of(
                Piece.WHITE, List.of(
                        new Point(4, 0), new Point(5, 0), new Point(6, 0), new Point(7, 0),
                        new Point(4, 1), new Point(5, 1), new Point(6, 1), new Point(7, 1),
                        new Point(4, 2), new Point(5, 2), new Point(6, 2), new Point(7, 2)
                ),
                Piece.BLACK, List.of(
                        new Point(0, 5), new Point(1, 5), new Point(2, 5), new Point(3, 5),
                        new Point(0, 6), new Point(1, 6), new Point(2, 6), new Point(3, 6),
                        new Point(0, 7), new Point(1, 7), new Point(2, 7), new Point(3, 7)
                )
        );

        return new GameMap(new Size2D(width, height), defaultField, defaultStartPositions, defaultWinPositions);
    }

    public GameMap getGameMap(String mapName) {
        if ("default".equals(mapName)) {
            return getDefaultMap();
        }

        throw new CommonGameException(Reason.MAP_DOES_NOT_EXIST);
    }

}
