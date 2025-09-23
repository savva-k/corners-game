import { Scene } from "phaser";
import { type Game as GameModel } from '../../model/Game';
import { WebsocketInitHandler } from "./WebsocketInitHandler";
import type { WebSocketConnection } from "../../WebSocket";
import type { Player } from "../../model";

export class WebsocketInit extends Scene {

    gameData!: GameModel;

    constructor() {
        super({ key: 'WebsocketInit' });
    }

    preload() {
        let loadingText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, "Loading: 0%", {
            font: "12px Arial",
            color: "#ffffff",
        }).setOrigin(0.5);

        this.load.on("progress", (value: number) => {
            loadingText.setText(`Loading: ${Math.round(value * 100)}%`);
        });

        this.load.image('logo', 'logo.svg');
        const ws = this.registry.get('ws') as WebSocketConnection;
        const handler = new WebsocketInitHandler(ws, this);
        handler.activate();

        this.load.on('complete', () => {
            handler.joinGame();
        });
    }

    continueLoading(gameData: GameModel, player: Player) {
        this.scene.start('Loader', { gameData, player });
    }

    create() {
    }
}
