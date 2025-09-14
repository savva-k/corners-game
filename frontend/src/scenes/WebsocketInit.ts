import { Scene } from "phaser";
import { type Game as GameModel } from '../model/Game';
import { WebsocketInitHandler } from "../statehandlers/WebsocketInitHandler";
import type { WebSocketConnection } from "../WebSocket";

export class WebsocketInit extends Scene {

    gameData!: GameModel;

    constructor() {
        super({ key: 'WebsocketInit' });
    }

    preload() {
        this.load.image('logo', 'logo.svg');
        const ws = this.registry.get('ws') as WebSocketConnection;
        const handler = new WebsocketInitHandler(ws, this);
        handler.activate();

        this.load.on('complete', () => {
            handler.joinGame();
        });
    }

    create() {
    }
}
