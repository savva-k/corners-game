package com.playcorners.service;

import com.playcorners.model.Piece;
import io.quarkus.logging.Log;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertLinesMatch;
import static org.junit.jupiter.params.provider.Arguments.arguments;

@QuarkusTest
public class PathServiceTest {

    @Inject
    private PathService pathService;

    private static Stream<Arguments> getPositionAboveTestData() {
        return Stream.of(
                arguments("d2", "d3"),
                arguments("XY", null),
                arguments("a7", "a8"),
                arguments("a8", null),
                arguments("d8", null)
        );
    }

    private static Stream<Arguments> getPositionBelowTestData() {
        return Stream.of(
                arguments("d2", "d1"),
                arguments("XY", null),
                arguments("a7", "a6"),
                arguments("a1", null),
                arguments("d1", null)
        );
    }

    private static Stream<Arguments> getPositionLeftTestData() {
        return Stream.of(
                arguments("d2", "c2"),
                arguments("XY", null),
                arguments("a7", null),
                arguments("b8", "a8"),
                arguments("d8", "c8")
        );
    }

    private static Stream<Arguments> getPositionRightTestData() {
        return Stream.of(
                arguments("d2", "e2"),
                arguments("XY", null),
                arguments("a7", "b7"),
                arguments("h8", null),
                arguments("h1", null)
        );
    }

    private static Stream<Arguments> getJumpsPathTestData() {
        return Stream.of(
                arguments(
                        Map.of("c2", Piece.BLACK, "c3", Piece.BLACK, "d4", Piece.BLACK, "f4", Piece.BLACK),
                        "c2", "g4",
                        List.of("g4", "e4", "c4", "c2")
                ),
                arguments(
                        Map.of("c2", Piece.WHITE, "c3", Piece.WHITE),
                        "c2", "c4",
                        List.of("c4", "c2")
                ),
                arguments(
                        Map.of("c3", Piece.WHITE),
                        "c3", "c4",
                        List.of("c4", "c3")
                ),
                arguments(
                        Map.of("a2", Piece.WHITE, "a3", Piece.WHITE, "b4", Piece.WHITE, "c3", Piece.WHITE,
                               "d2", Piece.WHITE, "e3", Piece.WHITE, "f4", Piece.WHITE, "g5", Piece.WHITE),
                        "a2", "g6",
                        List.of("g6", "g4", "e4", "e2", "c2", "c4", "a4", "a2")
                )
        );
    }

    @ParameterizedTest
    @MethodSource("getJumpsPathTestData")
    public void givenCertainGameField_whenGetJumpsPath_thenReturnPathThePieceJumpsBetweenTwoCells(
            Map<String, Piece> field, String from, String to, List<String> expectedPath
    ) {
        assertLinesMatch(expectedPath, pathService.getJumpsPath(field, from, to));
    }

    @ParameterizedTest
    @MethodSource("getPositionAboveTestData")
    public void givenPositionX_whenGetPositionAbove_thenReturnY(String pos, String posAbove) {
        assertEquals(posAbove, pathService.getPositionAbove(pos));
    }

    @ParameterizedTest
    @MethodSource("getPositionBelowTestData")
    public void givenPositionX_whenGetPositionBelow_thenReturnY(String pos, String posAbove) {
        assertEquals(posAbove, pathService.getPositionBelow(pos));
    }

    @ParameterizedTest
    @MethodSource("getPositionLeftTestData")
    public void givenPositionX_whenGetPositionLeft_thenReturnY(String pos, String posAbove) {
        assertEquals(posAbove, pathService.getPositionLeft(pos));
    }

    @ParameterizedTest
    @MethodSource("getPositionRightTestData")
    public void givenPositionX_whenGetPositionRight_thenReturnY(String pos, String posAbove) {
        assertEquals(posAbove, pathService.getPositionRight(pos));
    }

}
