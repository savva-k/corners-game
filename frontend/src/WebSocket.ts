import { EventBus } from "./EventBus";
import type { Turn, Game as GameModel } from "./model";
import type { GameOverResponse } from "./model/GameOverResponse";
import type { TurnValidationResponse } from "./model/TurnValidationResponse";

type Request = 'CREATE_OR_LOAD_GAME' | 'TURN_REQUEST';
type Response = 'CREATE_OR_LOAD_GAME_OK' | 'TURN_OK' | 'INVALID_TURN' | 'GAME_EXCEPTION' | 'GAME_OVER';

type JoinGameResponse = {
    type: Extract<Response, 'CREATE_OR_LOAD_GAME_OK'>,
    payload: GameModel,
};

type TurnResponse = {
    type: Extract<Response, 'TURN_OK'>,
    payload: Turn,
};

type InvalidTurnResponse = {
    type: Extract<Response, 'INVALID_TURN'>,
    payload: TurnValidationResponse,
};

type GameException = {
    type: Extract<Response, 'GAME_EXCEPTION'>,
    payload: string,
}

type GameOver = {
    type: Extract<Response, 'GAME_OVER'>,
    payload: GameOverResponse,
}

type ServerData = JoinGameResponse | TurnResponse | InvalidTurnResponse | GameException | GameOver;


class WebSocketConnection {
    isConnected: () => boolean;
    ws: WebSocket;

    constructor(ws: WebSocket, isConnected: () => boolean) {
        this.ws = ws;
        this.isConnected = isConnected;
    }

    public send(type: Request, payload: any) {
        if (!this.isConnected) {
            console.error("WebSocket is not connected, cannot send message " + type + " " + JSON.stringify(payload));
            return;
        }
        const message = JSON.stringify({ type, payload });
        console.log("Sending to server: " + message);
        this.ws.send(message);
    }
}

const connect = (url: string) => new Promise<WebSocketConnection>((resolve, reject) => {
    let connected = false;
    const ws = new WebSocket(url);
    const wsConnection = new WebSocketConnection(ws, () => connected);

    ws.addEventListener('open', () => {
        connected = true;
        resolve(wsConnection);
        console.log('Connected to the server');
    });
    ws.addEventListener('close', () => {
        connected = false;
        console.log('Disconnected from the server');
    });
    ws.addEventListener('error', (error) => {
        connected = false;
        console.error("Websocket error: " + error);
    });
    ws.addEventListener('message', (event) => {
        if (event.data) {
            console.log("Got from server: " + event.data);
            const data = JSON.parse(event.data) as ServerData;
            EventBus.emit(data.type, data.payload);
        }
    });
});

export { connect, WebSocketConnection };