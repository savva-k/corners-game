"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Piece_1 = require("./model/Piece");
exports.default = (function (getWs) {
    var onIdentityCreated = function () { };
    var onGameCreated = function () { };
    var onGameUpdated = function () { };
    var onError = function () { };
    var onMessage = function (event) {
        var msg = JSON.parse(event.data);
        // todo move player initiation to backend
        if (msg.type === "IDENTITY_CREATED") {
            console.log("User joined: " + msg.payload.name);
            onIdentityCreated(msg.payload.games, {
                name: msg.payload.name,
                pieceColor: Piece_1.Piece.White,
                registered: msg.payload.registered,
            });
        }
        if (msg.type === "GAME_CREATED") {
            console.log("Game created: " + msg.payload.game);
            onGameCreated(msg.payload.game);
        }
        if (msg.type === "GAME_UPDATED") {
            console.log("Game updated: " + msg.payload.game.id);
            onGameUpdated(msg.payload.game);
        }
        if (msg.type === "ERROR") {
            console.error("Error: " + msg.payload.message);
            onError(msg.payload.message);
        }
    };
    return {
        init: function () { return getWs().onmessage = onMessage; },
        onIdentityCreated: function (f) { return (onIdentityCreated = f); },
        onGameCreated: function (f) { return (onGameCreated = f); },
        onGameUpdated: function (f) { return (onGameUpdated = f); },
        onError: function (f) { return (onError = f); },
    };
});
