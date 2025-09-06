import { wsUrl } from "./api";
import { EventBus } from "./EventBus";
import type { Turn, Game as GameModel } from "./model";
import type { GameOverResponse } from "./model/GameOverResponse";
import type { TurnValidationResponse } from "./model/TurnValidationResponse";
import type { TurnRequest } from "./scenes/Game";

let connected = false;
const token = new URL(window.location.href).searchParams.get("token");
const ws = new WebSocket(wsUrl + "?token=" + token);


type GetGameResponse = {
    type: 'GET_GAME_OK',
    payload: GameModel,
};

type TurnResponse = {
    type: 'TURN_OK',
    payload: Turn,
};

type InvalidTurnResponse = {
    type: 'INVALID_TURN',
    payload: TurnValidationResponse,
};

type GameException = {
    type: 'GAME_EXCEPTION',
    payload: string,
}

type GameOver = {
    type: 'GAME_OVER',
    payload: GameOverResponse,
}

type ServerData = GetGameResponse | TurnResponse | InvalidTurnResponse | GameException | GameOver;

ws.addEventListener('open', () => {
    connected = true;
    console.log('Connected: game WS');
});
ws.addEventListener('close', () => {
    connected = false;
    console.log('Disconnected: game WS');
});
ws.addEventListener('error', (error) => {
    connected = false;
    console.error("WS error: " + error);
});
ws.addEventListener('message', (event) => {
    if (event.data) {
        console.log(event.data)
        const data = JSON.parse(event.data) as ServerData;
        EventBus.emit(data.type, data.payload)
    }
});

// const handleServerMessage = (gameInstance: Game, serverData: string) => {
//     const data = JSON.parse(serverData) as ServerData;
//     switch (data.type) {
//         case "TURN_OK": {
//             gameInstance.handleNewTurn(data.payload);
//             break;
//         };
//         case "INVALID_TURN": {
//             gameInstance.handleInvalidTurn(data.payload);
//             break;
//         };
//         case "GAME_EXCEPTION": {
//             gameInstance.handleException(data.payload);
//             break;
//         };
//         case "GAME_OVER": {
//             gameInstance.handleGameOver(data.payload.finishReason, data.payload.winner);
//             break;
//         }
//     }
// }

const requestGameData = () => {
    if (!connected) {
        console.error("WebSocket is not connected, cannot request game data");
        return;
    }
    ws.send(JSON.stringify({ type: "GET_GAME", payload: {} }));
}

const makeTurn = (turnRequest: TurnRequest) => {
    if (!connected) {
        console.error("WebSocket is not connected, cannot make a turn");
        return;
    }
    ws.send(JSON.stringify({ type: "TURN_REQUEST", payload: turnRequest }));
}

export { requestGameData, makeTurn };