import { Game as MainGame } from './scenes/Game';
import { AUTO, Game, Types } from 'phaser';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
    type: AUTO,
    width: 640,
    height: 480,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scene: [
        MainGame
    ]
};

const StartGame = (parent: string | HTMLElement | null | undefined) => {
    return new Game({ ...config, parent });
}

export default StartGame;

