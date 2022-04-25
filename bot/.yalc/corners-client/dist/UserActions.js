"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (socket) {
    var createGame = function () {
        socket.emit("createGame");
    };
    var login = function (name) {
        socket.emit("login", name);
    };
    var joinGame = function (gameId) {
        socket.emit("joinGame", gameId);
    };
    var makeTurn = function (gameId, current, desired) {
        console.log("Let's pretend that we've validated the input before sending to the server for now...");
        socket.emit("makeTurn", gameId, current, desired);
    };
    return { makeTurn: makeTurn, joinGame: joinGame, login: login, createGame: createGame };
});
