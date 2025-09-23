import type { WebSocketConnection } from "../../WebSocket";
import { EventBus } from "../../EventBus";
import { type Game as GameModel } from '../../model/Game';
import type { WebsocketInit } from "./WebsocketInitScene";
import { getPlayerFromJwt } from "../../utils/JwtUtil";

export class WebsocketInitHandler {
    ws: WebSocketConnection;
    wsInitScene: WebsocketInit;

    constructor(ws: WebSocketConnection, wsInitScene: WebsocketInit) {
        this.ws = ws;
        this.wsInitScene = wsInitScene;
    }

    public joinGame() {
        this.ws.send('CREATE_OR_LOAD_GAME', {});
    }

    public activate() {
        EventBus.once('CREATE_OR_LOAD_GAME_OK', (gameData: GameModel) => {
            this.wsInitScene.continueLoading(gameData, getPlayerFromJwt());
        });
    }
}