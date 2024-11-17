package com.playcorners.service;

import com.playcorners.model.GameMap;
import com.playcorners.model.Piece;
import com.playcorners.model.Point;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertIterableEquals;
import static org.junit.jupiter.params.provider.Arguments.arguments;

public class PathServiceDefault8x8MapTest {

    private PathService pathService;
    private GameMap defaultGameMap;

    @BeforeEach
    public void init() {
        pathService = new PathService();
        defaultGameMap = new GameMapService().getGameMap("default");
    }

    private static Stream<Arguments> getNeighboursTestData() {
        return Stream.of(
                arguments(
                        new Point(0, 0),
                        new PathService.Neighbours(
                                null,
                                new Point(1, 0),
                                null,
                                new Point(0, 1)
                        )
                ),
                arguments(
                        new Point(7, 0),
                        new PathService.Neighbours(
                                new Point(6, 0),
                                null,
                                null,
                                new Point(7, 1)
                        )
                ),
                arguments(
                        new Point(0, 7),
                        new PathService.Neighbours(
                                null,
                                new Point(1, 7),
                                new Point(0, 6),
                                null
                        )
                ),
                arguments(
                        new Point(7, 7),
                        new PathService.Neighbours(
                                new Point(6, 7),
                                null,
                                new Point(7, 6),
                                null
                        )
                ),
                arguments(
                        new Point(3, 3),
                        new PathService.Neighbours(
                                new Point(2, 3),
                                new Point(4, 3),
                                new Point(3, 2),
                                new Point(3, 4)
                        )
                )
        );
    }

    private static Stream<Arguments> getJumpsPathTestData() {
        return Stream.of(
                arguments(
                        Map.of(new Point(2, 6), Piece.BLACK, new Point(2, 5), Piece.BLACK, new Point(3, 4), Piece.BLACK, new Point(5, 4), Piece.BLACK),
                        new Point(2, 6), new Point(6, 4),
                        List.of(new Point(6, 4), new Point(4, 4), new Point(2, 4), new Point(2, 6))
                ),
                arguments(
                        Map.of(new Point(2, 6), Piece.WHITE, new Point(2, 5), Piece.WHITE),
                        new Point(2, 6), new Point(2, 4),
                        List.of(new Point(2, 4), new Point(2, 6))
                ),
                arguments(
                        Map.of(new Point(2, 5), Piece.WHITE),
                        new Point(2, 5), new Point(2, 4),
                        List.of(new Point(2, 4), new Point(2, 5))
                ),
                arguments(
                        Map.of(new Point(0, 6), Piece.WHITE, new Point(0, 5), Piece.WHITE, new Point(1, 4), Piece.WHITE, new Point(2, 5), Piece.WHITE,
                                new Point(3, 6), Piece.WHITE, new Point(4, 5), Piece.WHITE, new Point(5, 4), Piece.WHITE, new Point(6, 3), Piece.WHITE),
                        new Point(0, 6), new Point(6, 2),
                        List.of(new Point(6, 2), new Point(6, 4), new Point(4, 4), new Point(4, 6), new Point(2, 6), new Point(2, 4), new Point(0, 4), new Point(0, 6))
                )
        );
    }

    @ParameterizedTest
    @MethodSource("getJumpsPathTestData")
    public void givenCertainGameField_whenGetJumpsPath_thenReturnPathThePieceJumpsBetweenTwoCells(
            Map<Point, Piece> piecePositions, Point from, Point to, List<Point> expectedPath
    ) {
        piecePositions.keySet()
                .forEach(piecePosition -> defaultGameMap
                        .field().get(piecePosition)
                        .setPiece(piecePositions.get(piecePosition))
                );
        assertIterableEquals(expectedPath, pathService.getJumpsPath(defaultGameMap.field(), defaultGameMap.size(), from, to));
    }

    @ParameterizedTest
    @MethodSource("getNeighboursTestData")
    public void givenPositionX_whenGetPositionAbove_thenReturnY(Point pos, PathService.Neighbours expectedNeighbours) {
        assertEquals(expectedNeighbours, pathService.getNeighbours(defaultGameMap.size(), pos));
    }

}
