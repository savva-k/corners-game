"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blackStartPositions = exports.whiteStartPositions = exports.black = exports.white = exports.initialBoardState = void 0;
var white = 0;
exports.white = white;
var black = 1;
exports.black = black;
var whiteStartPositions = [
    "a1",
    "b1",
    "c1",
    "d1",
    "a2",
    "b2",
    "c2",
    "d2",
    "a3",
    "b3",
    "c3",
    "d3",
].sort();
exports.whiteStartPositions = whiteStartPositions;
var blackStartPositions = [
    "h8",
    "g8",
    "f8",
    "e8",
    "h7",
    "g7",
    "f7",
    "e7",
    "h6",
    "g6",
    "f6",
    "e6",
].sort();
exports.blackStartPositions = blackStartPositions;
var initialBoardState = (function () {
    var state = {};
    whiteStartPositions.forEach(function (p) {
        state[p] = black;
    });
    blackStartPositions.forEach(function (p) {
        state[p] = white;
    });
    state["g6"] = undefined;
    state["g5"] = white;
    state["b3"] = undefined;
    state["b4"] = black;
    return state;
})();
exports.initialBoardState = initialBoardState;
