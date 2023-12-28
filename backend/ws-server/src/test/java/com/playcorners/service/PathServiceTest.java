package com.playcorners.service;

import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
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
