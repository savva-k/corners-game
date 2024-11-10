import { AUTO, Game, Types } from 'phaser';
import { GAME_CONTAINER_ID, GAME_CANVAS_WIDTH, GAME_CANVAS_HEIGHT, GLOBAL_REGISTRY_TRANSLATIONS } from './constan';
import { Game as MainGame } from './scenes/Game';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
    type: AUTO,
    width: GAME_CANVAS_WIDTH,
    height: GAME_CANVAS_HEIGHT,
    parent: GAME_CONTAINER_ID,
    scene: [
        MainGame
    ]
};

const StartGame = (parent: string | HTMLElement | null | undefined, backgroundColor: string, translations: (code: string) => string) => {
    const game = new Game({ ...config, parent, backgroundColor });
    game.registry.set(GLOBAL_REGISTRY_TRANSLATIONS, translations);
    return game;
}

export default StartGame;
