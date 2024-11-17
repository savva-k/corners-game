package com.playcorners.service;

import com.playcorners.model.Cell;
import com.playcorners.model.Point;
import com.playcorners.model.Size2D;
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

    public record Neighbours(Point left, Point right, Point top, Point bottom) {
        public List<Point> getNeighboursAsList() {
            var result = new ArrayList<Point>(5);
            result.add(left);
            result.add(right);
            result.add(top);
            result.add(bottom);
            return result;
        }

        public boolean includes(Point pos) {
            return Objects.equals(left, pos) || Objects.equals(right, pos)
                    || Objects.equals(top, pos) || Objects.equals(bottom, pos);
        }
    }

    public List<Point> getAvailableMoves(Map<Point, Cell> field, Size2D mapSize, Point from) {
        if (field.containsKey(from)) {
            var neighbours = getNeighbours(mapSize, from);
            var singleMoves = neighbours.getNeighboursAsList().stream()
                    .filter(Objects::nonNull)
                    .filter(possibleMove -> field.get(possibleMove).isEmpty());
            var reachableByJumpingOver = getCellsReachableByJumpingOver(field, mapSize, from, new HashSet<>());
            return Stream.concat(singleMoves, reachableByJumpingOver.stream()).toList();
        }
        return Collections.emptyList();
    }

    public List<Point> getJumpsPath(Map<Point, Cell> field, Size2D mapSize, Point from, Point to) {
        return getJumpsPath(field, mapSize, from, to, new HashSet<>());
    }

    private List<Point> getJumpsPath(Map<Point, Cell> field, Size2D mapSize, Point from, Point to, Set<Point> checkedCells) {
        if (checkedCells.contains(from)) {
            return Collections.emptyList();
        }

        checkedCells.add(from);
        var neighbours = getNeighbours(mapSize, from);

        if (neighbours.includes(to)) {
            return List.of(to, from);
        }

        var neighboursWeCanJumpOver = getNeighboursWeCanJumpOver(field, mapSize, neighbours, from, checkedCells);

        if (neighboursWeCanJumpOver.contains(to)) {
            return List.of(to, from);
        }

        if (!neighboursWeCanJumpOver.isEmpty()) {
            return neighboursWeCanJumpOver.stream()
                    .map(n -> getJumpsPath(field, mapSize, n, to, checkedCells))
                    .filter(checkResult -> !checkResult.isEmpty())
                    .findFirst()
                    .map(checkResult -> Stream.concat(checkResult.stream(), Stream.of(from)).toList())
                    .orElse(Collections.emptyList());
        }

        return Collections.emptyList();
    }

    private List<Point> getCellsReachableByJumpingOver(Map<Point, Cell> field, Size2D mapSize, Point from, Set<Point> checkedCells) {
        checkedCells.add(from);
        var neighbours = getNeighbours(mapSize, from);
        var neighboursWeCanJumpOver = getNeighboursWeCanJumpOver(field, mapSize, neighbours, from, checkedCells);
        var result = new ArrayList<>(neighboursWeCanJumpOver);
        result.addAll(neighboursWeCanJumpOver.stream()
                .flatMap(pos -> getCellsReachableByJumpingOver(field, mapSize, pos, checkedCells).stream())
                .toList());
        return result;
    }

    private List<Point> getNeighboursWeCanJumpOver(Map<Point, Cell> field, Size2D mapSize, Neighbours neighbours, Point from, Set<Point> checkedCells) {
        return neighbours.getNeighboursAsList().stream()
                .filter(Objects::nonNull)
                .filter(pos -> field.get(pos).isOccupied())
                .flatMap(pos -> whereCanJump(field, mapSize, from, pos))
                .filter(Objects::nonNull)
                .filter(pos -> !checkedCells.contains(pos))
                .toList();
    }

    // todo: check whether it should rather return just one Point or still multiple values can be returned
    private Stream<Point> whereCanJump(Map<Point, Cell> field, Size2D mapSize, Point from, Point jumpedOverPos) {
        var jumpedOverPosNeighbours = getNeighbours(mapSize, jumpedOverPos);
        Stream.Builder<Point> streamBuilder = Stream.builder();

        if (from.equals(jumpedOverPosNeighbours.left) && jumpedOverPosNeighbours.right != null
                && field.get(jumpedOverPosNeighbours.right).isEmpty()) {
            streamBuilder.add(jumpedOverPosNeighbours.right);
        }

        if (from.equals(jumpedOverPosNeighbours.right) && jumpedOverPosNeighbours.left != null
                && field.get(jumpedOverPosNeighbours.left).isEmpty()) {
            streamBuilder.add(jumpedOverPosNeighbours.left);
        }

        if (from.equals(jumpedOverPosNeighbours.top) && jumpedOverPosNeighbours.bottom != null
                && field.get(jumpedOverPosNeighbours.bottom).isEmpty()) {
            streamBuilder.add(jumpedOverPosNeighbours.bottom);
        }

        if (from.equals(jumpedOverPosNeighbours.bottom) && jumpedOverPosNeighbours.top != null
                && field.get(jumpedOverPosNeighbours.top).isEmpty()) {
            streamBuilder.add(jumpedOverPosNeighbours.top);
        }

        return streamBuilder.build();
    }

    protected Neighbours getNeighbours(Size2D mapSize, Point from) {
        return new Neighbours(
                getRelativePosition(mapSize, from, new Point(-1, 0)),  // to the left
                getRelativePosition(mapSize, from, new Point(1, 0)),   // to the right
                getRelativePosition(mapSize, from, new Point(0, -1)),  // above
                getRelativePosition(mapSize, from, new Point(0, 1))    // below
        );
    }

    protected Point getRelativePosition(Size2D mapSize, Point from, Point offset) {
        var newPos = new Point(from.x() + offset.x(), from.y() + offset.y());

        if (newPos.x() < 0 || newPos.y() < 0 || newPos.x() >= mapSize.width() || newPos.y() >= mapSize.height()) {
            return null;
        }

        return newPos;
    }

}
