"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (socket) {
    var createGame = function () {
        console.log("Creating a new game");
        socket.emit("createGame");
    };
    var login = function (name) {
        console.log("Logging in to the game as " + name);
        socket.emit("login", name);
    };
    var joinGame = function (gameId) {
        console.log("Joining the game " + gameId);
        socket.emit("joinGame", gameId);
    };
    var makeTurn = function (gameId, current, desired) {
        console.log("Let's pretend that we've validated the input before sending to the server for now...");
        console.log("Making a turn: gameId: ".concat(gameId, ", current: ").concat(current, ", desired: ").concat(desired));
        socket.emit("makeTurn", gameId, current, desired);
    };
    return { makeTurn: makeTurn, joinGame: joinGame, login: login, createGame: createGame };
});
