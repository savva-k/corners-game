package com.playcorners.service;

import com.playcorners.controller.message.GameError;
import com.playcorners.controller.message.Reason;
import com.playcorners.model.Game;
import com.playcorners.model.Piece;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Stream;

@Service
public class PathService {

    private static final List<String> files = List.of("a", "b", "c", "d", "e", "f", "g", "h");
    private static final List<String> ranks = List.of("1", "2", "3", "4", "5", "6", "7", "8");

    record Neighbours(String left, String right, String top, String bottom) {
        public List<String> getNeighboursAsList() {
            var result = new ArrayList<String>(5);
            result.add(left);
            result.add(right);
            result.add(top);
            result.add(bottom);
            return result;
        }

        public boolean includes(String pos) {
            return Objects.equals(left, pos) || Objects.equals(right, pos)
                    || Objects.equals(top, pos) || Objects.equals(bottom, pos);
        }
    }

    public List<String> getAvailableMoves(Game game, String from) {
        var field = game.getField();
        if (field.containsKey(from)) {
            var neighbours = getNeighbours(from);
            var singleMoves = neighbours.getNeighboursAsList().stream()
                    .filter(Objects::nonNull)
                    .filter(possibleMove -> field.get(possibleMove) == null);
            var reachableByJumpingOver = getCellsReachableByJumpingOver(field, from, new HashSet<>());
            return Stream.concat(singleMoves, reachableByJumpingOver.stream()).toList();
        }
        return Collections.emptyList();
    }

    public List<String> getJumpsPath(Map<String, Piece> field, String from, String to) {
        return getJumpsPath(field, from, to, new HashSet<>());
    }

    private List<String> getJumpsPath(Map<String, Piece> field, String from, String to, Set<String> checkedCells) {
        if (checkedCells.contains(from)) {
            return Collections.emptyList();
        }

        checkedCells.add(from);
        var neighbours = getNeighbours(from);

        if (neighbours.includes(to)) {
            return List.of(to, from);
        }

        var neighboursWeCanJumpOver = getNeighboursWeCanJumpOver(field, neighbours, from, checkedCells);

        if (neighboursWeCanJumpOver.contains(to)) {
            return List.of(to, from);
        }

        if (!neighboursWeCanJumpOver.isEmpty()) {
            return neighboursWeCanJumpOver.stream()
                    .map(n -> getJumpsPath(field, n, to, checkedCells))
                    .filter(checkResult -> !checkResult.isEmpty())
                    .findFirst()
                    .map(checkResult -> Stream.concat(checkResult.stream(), Stream.of(from)).toList())
                    .orElse(Collections.emptyList());
        }

        return Collections.emptyList();
    }

    private List<String> getCellsReachableByJumpingOver(Map<String, Piece> field, String from, Set<String> checkedCells) {
        checkedCells.add(from);
        var neighbours = getNeighbours(from);
        var neighboursWeCanJumpOver = getNeighboursWeCanJumpOver(field, neighbours, from, checkedCells);
        var result = new ArrayList<>(neighboursWeCanJumpOver);
        result.addAll(neighboursWeCanJumpOver.stream()
                .flatMap(pos -> getCellsReachableByJumpingOver(field, pos, checkedCells).stream())
                .toList());
        return result;
    }

    private List<String> getNeighboursWeCanJumpOver(Map<String, Piece> field, Neighbours neighbours, String from, Set<String> checkedCells) {
        return neighbours.getNeighboursAsList().stream()
                .filter(Objects::nonNull)
                .filter(pos -> field.get(pos) != null)
                .flatMap(pos -> whereCanJump(field, from, pos))
                .filter(Objects::nonNull)
                .filter(pos -> !checkedCells.contains(pos))
                .toList();
    }

    // todo: check whether it should rather return just String or still multiple values can be returned
    private Stream<String> whereCanJump(Map<String, Piece> field, String from, String jumpedOverPos) {
        var jumpedOverPosNeighbours = getNeighbours(jumpedOverPos);
        Stream.Builder<String> streamBuilder = Stream.builder();

        if (from.equals(jumpedOverPosNeighbours.left) && jumpedOverPosNeighbours.right != null
                && field.get(jumpedOverPosNeighbours.right) == null) {
            streamBuilder.add(jumpedOverPosNeighbours.right);
        }

        if (from.equals(jumpedOverPosNeighbours.right) && jumpedOverPosNeighbours.left != null
                && field.get(jumpedOverPosNeighbours.left) == null) {
            streamBuilder.add(jumpedOverPosNeighbours.left);
        }

        if (from.equals(jumpedOverPosNeighbours.top) && jumpedOverPosNeighbours.bottom != null
                && field.get(jumpedOverPosNeighbours.bottom) == null) {
            streamBuilder.add(jumpedOverPosNeighbours.bottom);
        }

        if (from.equals(jumpedOverPosNeighbours.bottom) && jumpedOverPosNeighbours.top != null
                && field.get(jumpedOverPosNeighbours.top) == null) {
            streamBuilder.add(jumpedOverPosNeighbours.top);
        }

        return streamBuilder.build();
    }

    private Neighbours getNeighbours(String from) {
        if (from == null || from.length() != 2) throw new GameError(Reason.INCORRECT_REQUEST_DATA);
        return new Neighbours(
                getPositionBelow(from),
                getPositionAbove(from),
                getPositionRight(from),
                getPositionLeft(from)
        );
    }

    protected String getPositionRight(String pos) {
        return getPosition(pos, 1, 0);
    }

    protected String getPositionLeft(String pos) {
        return getPosition(pos, -1, 0);
    }

    protected String getPositionBelow(String pos) {
        return getPosition(pos, 0, -1);
    }

    protected String getPositionAbove(String pos) {
        return getPosition(pos, 0, 1);
    }

    private String getPosition(String from, int fileOffset, int rankOffset) {
        var file = String.valueOf(from.charAt(0));
        var rank = String.valueOf(from.charAt(1));
        var currentFileIndex = files.indexOf(file);

        if (currentFileIndex != -1) {
            var currentRankIndex = ranks.indexOf(rank);
            if (currentRankIndex != -1) {
                if (fileOffset != 0 && isInListSizeBounds(files, currentFileIndex + fileOffset)) {
                    return files.get(currentFileIndex + fileOffset) + rank;
                } else if (rankOffset != 0 && isInListSizeBounds(ranks, currentRankIndex + rankOffset)) {
                    return file + ranks.get(currentRankIndex + rankOffset);
                }
            }
        }

        return null;
    }

    private boolean isInListSizeBounds(List<?> list, int index) {
        return index >= 0 && index < list.size();
    }
}
