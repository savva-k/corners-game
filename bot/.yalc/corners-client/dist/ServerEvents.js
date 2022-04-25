"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (socket) {
    var onLogin = function () { };
    var onGameCreated = function () { };
    var onGameUpdated = function () { };
    var onError = function () { };
    // todo implement player initiation on backend
    socket.on("identityCreated", function (games, player) {
        console.log("User joined: " + player.name);
        onLogin(games, player);
    });
    socket.on("gameCreated", function (game) {
        console.log("Game created: " + game);
        onGameCreated(game);
    });
    socket.on("gameUpdated", function (game) {
        console.log("Game updated: " + game.id);
        onGameUpdated(game);
    });
    socket.on("error", function (message) {
        console.error("Error: " + message);
        onError(message);
    });
    return {
        onLogin: function (f) { return (onLogin = f); },
        onGameCreated: function (f) { return (onGameCreated = f); },
        onGameUpdated: function (f) { return (onGameUpdated = f); },
        onError: function (f) { return (onError = f); },
    };
});
