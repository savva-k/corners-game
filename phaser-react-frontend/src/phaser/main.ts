import { AUTO, Game, Types } from 'phaser';
import { GAME_CONTAINER_ID, SPRITES } from './constan';
import { Game as MainGame } from './scenes/Game';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
    type: AUTO,
    width: SPRITES.cell.width * 8 + SPRITES.cell.width * 2,
    height: SPRITES.cell.height * 8 + SPRITES.cell.height * 2,
    parent: GAME_CONTAINER_ID,
    backgroundColor: '#028af8',
    scene: [
        MainGame
    ]
};

const StartGame = (parent: string | HTMLElement | null | undefined) => {
    return new Game({ ...config, parent });
}

export default StartGame;

