import { Scene } from "phaser";
import { type Game as GameModel } from '../model/Game';
import { requestGameData } from "../WebSocket";
import { EventBus } from "../EventBus";
import { GLOBAL_REGISTRY_GAME_DATA, GLOBAL_REGISTRY_PLAYER } from "../constan";

export class WebsocketInit extends Scene {

    gameData!: GameModel;

    constructor() {
        super({ key: 'WebsocketInit' });
    }

    preload() {
        this.load.image('logo', 'logo.svg');

        setTimeout(() => requestGameData(), 1000); // todo - promise instead of timeout
        EventBus.once('GET_GAME_OK', (gameData: GameModel) => {
            this.gameData = gameData;
            this.registry.set(GLOBAL_REGISTRY_GAME_DATA, gameData);
            this.registry.set(GLOBAL_REGISTRY_PLAYER, gameData.player1);
            this.proceedToLoader();
        });

    }

    proceedToLoader() {
        this.scene.start('Loader', { gameData: this.gameData });
    }

    create() {
    }
}
