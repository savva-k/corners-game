"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotStartedGame = exports.checkWin = exports.validateTurn = exports.createGame = void 0;
var InitialBoardState_1 = require("../constants/InitialBoardState");
var GameBoardService_1 = require("../services/GameBoardService");
var uuid4_1 = __importDefault(require("uuid4"));
var lodash_1 = __importDefault(require("lodash"));
var createGame = function (initiatedBy) {
    return {
        id: (0, uuid4_1.default)(),
        player1: {
            name: initiatedBy,
            pieceColor: InitialBoardState_1.white,
            registered: true,
        },
        player2: undefined,
        turns: [],
        currentTurn: InitialBoardState_1.white,
        field: __assign({}, InitialBoardState_1.initialBoardState),
        isStarted: false,
        isFinished: false,
        winner: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        mistakeAtField: undefined,
        availableMoves: [],
    };
};
exports.createGame = createGame;
var validateTurn = function (game, currentPosition, desiredPosition) {
    var availableMoves = (0, GameBoardService_1.getAvailableMoves)(game, currentPosition);
    var validTurn = availableMoves.includes(desiredPosition);
    var path = validTurn
        ? (0, GameBoardService_1.getJumpsPath)(game.field, currentPosition, desiredPosition)
        : null;
    console.log(path);
    return {
        validTurn: validTurn,
        path: path,
        availableMoves: availableMoves,
    };
};
exports.validateTurn = validateTurn;
var checkWin = function (game) {
    var whitePositions = getPiecesOfColor(game.field, InitialBoardState_1.white);
    var blackPositions = getPiecesOfColor(game.field, InitialBoardState_1.black);
    var whiteWins = lodash_1.default.isEqual(whitePositions.sort(), InitialBoardState_1.blackStartPositions);
    var blackWins = lodash_1.default.isEqual(blackPositions.sort(), InitialBoardState_1.whiteStartPositions);
    console.log("white wins " + whiteWins + ", blackWins " + blackWins);
    if (whiteWins) {
        return game.player1;
    }
    else if (blackWins) {
        return game.player2;
    }
};
exports.checkWin = checkWin;
var getPiecesOfColor = function (field, pieceType) {
    return Object.keys(lodash_1.default.pickBy(field, function (value) { return value === pieceType; }));
};
var getNotStartedGame = function (games, playerName) {
    var game = games.find(function (g) { return g.player1.name === playerName && !g.player2; });
    return game;
};
exports.getNotStartedGame = getNotStartedGame;
