"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJumpsPath = exports.getAvailableMoves = exports.getPositionRight = exports.getPositionLeft = exports.getPositionBelow = exports.getPositionAbove = exports.getNeighbours = void 0;
var files = ["a", "b", "c", "d", "e", "f", "g", "h"];
var ranks = [1, 2, 3, 4, 5, 6, 7, 8];
var getJumpsPath = function (field, currentPosition, desiredPosition, checkedCells) {
    checkedCells = checkedCells ? checkedCells : [];
    if (checkedCells.includes(currentPosition)) {
        return null;
    }
    checkedCells.push(currentPosition);
    var neighbours = getNeighbours(currentPosition);
    if (Object.values(neighbours).includes(desiredPosition)) {
        return [desiredPosition, currentPosition];
    }
    var jumpableNeighbours = getJumpableNeighbours(field, neighbours, currentPosition, checkedCells);
    if (jumpableNeighbours.includes(desiredPosition)) {
        return [desiredPosition, currentPosition];
    }
    if (jumpableNeighbours.length > 0) {
        var recursiveCheck = jumpableNeighbours.map(function (jumpableNeighbour) {
            return getJumpsPath(field, jumpableNeighbour, desiredPosition, checkedCells);
        });
        for (var i = 0; i < recursiveCheck.length; i++) {
            var checkResult = recursiveCheck[i];
            if (Array.isArray(checkResult)) {
                return __spreadArray(__spreadArray([], checkResult, true), [currentPosition], false);
            }
        }
    }
    return null;
};
exports.getJumpsPath = getJumpsPath;
var getAvailableMoves = function (game, piecePosition) {
    var field = game.field;
    var availableMoves = [];
    if (field[piecePosition] !== undefined) {
        var neighbours = getNeighbours(piecePosition);
        var singleMoves = Object.values(neighbours).filter(function (p) { return p && field[p] === undefined; });
        var jumpableCells = getJumpableCells(field, piecePosition);
        availableMoves.push.apply(availableMoves, __spreadArray(__spreadArray([], singleMoves, false), jumpableCells, false));
    }
    // todo remove "as string[]"
    return availableMoves;
};
exports.getAvailableMoves = getAvailableMoves;
var getJumpableNeighbours = function (field, neighbours, fromPosition, checkedCells) {
    return Object.values(neighbours)
        .filter(function (p) { return p !== undefined; })
        .filter(function (p) { return field[p] !== undefined; })
        .flatMap(function (p) { return whereCanJump(field, fromPosition, p); })
        .filter(function (p) { return p !== undefined && !checkedCells.includes(p); });
};
var getJumpableCells = function (field, fromPosition, checkedCells) {
    checkedCells = checkedCells ? checkedCells : [];
    var neighbours = getNeighbours(fromPosition);
    checkedCells.push(fromPosition);
    var jumpableNeighbours = getJumpableNeighbours(field, neighbours, fromPosition, checkedCells);
    return __spreadArray(__spreadArray([], jumpableNeighbours, true), jumpableNeighbours.flatMap(function (p) {
        return getJumpableCells(field, p, checkedCells);
    }), true);
};
var whereCanJump = function (field, from, over) {
    var overNeighbours = getNeighbours(over);
    var canJumpTo = [];
    if (overNeighbours.left === from &&
        overNeighbours.right &&
        field[overNeighbours.right] === undefined) {
        canJumpTo.push(overNeighbours.right);
    }
    if (overNeighbours.right === from &&
        overNeighbours.left &&
        field[overNeighbours.left] === undefined) {
        canJumpTo.push(overNeighbours.left);
    }
    if (overNeighbours.top === from &&
        overNeighbours.bottom &&
        field[overNeighbours.bottom] === undefined) {
        canJumpTo.push(overNeighbours.bottom);
    }
    if (overNeighbours.bottom === from &&
        overNeighbours.top &&
        field[overNeighbours.top] === undefined) {
        canJumpTo.push(overNeighbours.top);
    }
    return canJumpTo;
};
var getNeighbours = function (position) {
    return {
        top: getPositionAbove(position),
        bottom: getPositionBelow(position),
        left: getPositionLeft(position),
        right: getPositionRight(position),
    };
};
exports.getNeighbours = getNeighbours;
var getPositionAbove = function (position) {
    return getPosition(position, 0, 1);
};
exports.getPositionAbove = getPositionAbove;
var getPositionBelow = function (position) {
    return getPosition(position, 0, -1);
};
exports.getPositionBelow = getPositionBelow;
var getPositionLeft = function (position) {
    return getPosition(position, -1, 0);
};
exports.getPositionLeft = getPositionLeft;
var getPositionRight = function (position) {
    return getPosition(position, 1, 0);
};
exports.getPositionRight = getPositionRight;
var getPosition = function (position, fileOffset, rankOffset) {
    var file = position[0];
    var rank = position[1];
    var currentFileIndex = files.findIndex(function (f) { return f === file; });
    if (currentFileIndex !== -1) {
        var currentRankIndex = ranks.findIndex(function (r) { return r === parseInt(rank); });
        if (currentRankIndex !== -1) {
            if (fileOffset !== 0) {
                var newFile = files[currentFileIndex + fileOffset];
                return newFile ? "".concat(newFile).concat(rank) : undefined;
            }
            else if (rankOffset !== 0) {
                var newRank = ranks[currentRankIndex + rankOffset];
                return newRank ? "".concat(file).concat(newRank) : undefined;
            }
        }
    }
};
