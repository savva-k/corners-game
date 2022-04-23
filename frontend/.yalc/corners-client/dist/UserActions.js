"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (getWs) {
    var createGame = function () {
        getWs().send(JSON.stringify({
            type: "CREATE_GAME",
        }));
    };
    var registerPlayer = function (name, refresh) {
        getWs().send(JSON.stringify({
            payload: {
                name: name,
            },
            type: refresh ? "REFRESH_IDENTITY" : "GET_IDENTITY",
        }));
    };
    var joinGame = function (gameId) {
        getWs().send(JSON.stringify({
            payload: {
                gameId: gameId,
            },
            type: "JOIN_GAME",
        }));
    };
    var makeTurn = function (gameId, current, desired) {
        console.log("Let's pretend that we've validated the input before sending to the server for now...");
        getWs().send(JSON.stringify({
            type: "MAKE_TURN",
            payload: {
                gameId: gameId,
                currentPosition: current,
                desiredPosition: desired,
            },
        }));
    };
    return { makeTurn: makeTurn, joinGame: joinGame, registerPlayer: registerPlayer, createGame: createGame };
});
