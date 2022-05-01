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
exports.getPiecesOfColor = exports.getNotStartedGame = exports.checkGameStatus = exports.validateTurn = exports.createGame = exports.MAX_TURNS_NUMBER = void 0;
var InitialBoardState_1 = require("../constants/InitialBoardState");
var GameBoardService_1 = require("../services/GameBoardService");
var uuid4_1 = __importDefault(require("uuid4"));
var lodash_1 = __importDefault(require("lodash"));
var Piece_1 = require("../model/Piece");
var FinishReason_1 = require("../model/FinishReason");
exports.MAX_TURNS_NUMBER = 80;
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
        finishReason: undefined,
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
var checkGameStatus = function (game) {
    var whitePositions = getPiecesOfColor(game.field, InitialBoardState_1.white);
    var blackPositions = getPiecesOfColor(game.field, InitialBoardState_1.black);
    var whiteIsHome = lodash_1.default.isEqual(whitePositions.sort(), InitialBoardState_1.blackStartPositions);
    var blackIsHome = lodash_1.default.isEqual(blackPositions.sort(), InitialBoardState_1.whiteStartPositions);
    var currentPlayer = (0, GameBoardService_1.getCurrentPlayer)(game);
    if (whiteIsHome && blackIsHome) {
        console.log("Both players got home, it's a draw");
        return {
            finishReason: FinishReason_1.FinishReason.DrawBothHome,
            player: undefined,
        };
    }
    if (whiteIsHome && !blackIsHome && game.currentTurn === Piece_1.Piece.White) {
        console.log("White wins");
        return {
            finishReason: FinishReason_1.FinishReason.WhiteWon,
            player: game.player1,
        };
    }
    if (blackIsHome && !whiteIsHome) {
        console.log("Black wins");
        return {
            finishReason: FinishReason_1.FinishReason.BlackWon,
            player: game.player2,
        };
    }
    if (game.turns.length >= exports.MAX_TURNS_NUMBER) {
        console.log("Over " + exports.MAX_TURNS_NUMBER + " turns done, it's a draw");
        return {
            finishReason: FinishReason_1.FinishReason.DrawMoreThan80Moves,
            player: undefined,
        };
    }
    var currentPlayersPositions = game.currentTurn === Piece_1.Piece.White ? whitePositions : blackPositions;
    var hasNoMoves = currentPlayersPositions.flatMap(function (position) { return (0, GameBoardService_1.getAvailableMoves)(game, position); }).length === 0;
    if (hasNoMoves) {
        console.log((currentPlayer === null || currentPlayer === void 0 ? void 0 : currentPlayer.name) + " cannot move, it's a draw");
        return {
            finishReason: game.currentTurn === Piece_1.Piece.White ? FinishReason_1.FinishReason.DrawWhiteCantMove : FinishReason_1.FinishReason.DrawBlackCantMove,
            player: undefined,
        };
    }
};
exports.checkGameStatus = checkGameStatus;
var getPiecesOfColor = function (field, pieceType) {
    return Object.keys(lodash_1.default.pickBy(field, function (value) { return value === pieceType; }));
};
exports.getPiecesOfColor = getPiecesOfColor;
var getNotStartedGame = function (games, playerName) {
    var game = games.find(function (g) { return g.player1.name === playerName && !g.player2; });
    return game;
};
exports.getNotStartedGame = getNotStartedGame;
