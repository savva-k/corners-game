import { AUTO, Game, Types } from 'phaser';
import { GAME_CONTAINER_ID, GAME_CANVAS_WIDTH, GAME_CANVAS_HEIGHT } from './constan';
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

const StartGame = (parent: string | HTMLElement | null | undefined, backgroundColor: string) => {
    return new Game({ ...config, parent, backgroundColor });
}

export default StartGame;

