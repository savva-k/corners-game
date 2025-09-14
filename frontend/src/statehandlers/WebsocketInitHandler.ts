import type { WebSocketConnection } from "../WebSocket";
import { EventBus } from "../EventBus";
import { type Game as GameModel } from '../model/Game';
import { GLOBAL_REGISTRY_GAME_DATA, GLOBAL_REGISTRY_PLAYER } from "../constan";
import type { WebsocketInit } from "../scenes/WebsocketInit";

export class WebsocketInitHandler {
    ws: WebSocketConnection;
    wsInitScene: WebsocketInit;

    constructor(ws: WebSocketConnection, wsInitScene: WebsocketInit) {
        this.ws = ws;
        this.wsInitScene = wsInitScene;
    }

    public joinGame() {
        this.ws.send('JOIN_GAME', {});
    }

    public activate() {
        EventBus.once('JOIN_GAME_OK', (gameData: GameModel) => {
            this.wsInitScene.registry.set(GLOBAL_REGISTRY_GAME_DATA, gameData);
            this.wsInitScene.registry.set(GLOBAL_REGISTRY_PLAYER, gameData.player1);
            this.wsInitScene.scene.start('Loader', { gameData: gameData });
        });
    }
}