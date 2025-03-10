import { CANVAS, Game, Types } from 'phaser';
import { GAME_CONTAINER_ID, GLOBAL_REGISTRY_GAME_DATA, GLOBAL_REGISTRY_PLAYER, GLOBAL_REGISTRY_TRANSLATIONS } from './constan';
import { Game as MainGame } from './scenes/Game';
import { Game as GameModel } from '../model/Game';
import { Player } from '../model';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
    type: CANVAS, //todo: AUTO is resolved to WEBGL which causes some gaps between tiles on mobiles sometimes
    width: '100%',
    height: '80%',
    parent: GAME_CONTAINER_ID,
    pixelArt: true,
    antialias: false,
    scale: {
        mode: Phaser.Scale.NONE, // FIT to enable scaling when type: AUTO issue is fixed. Gaps are present even when mode = NONE and type = AUTO
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [
        MainGame
    ]
};

interface Props {
    parent: string | HTMLElement | null | undefined,
    backgroundColor: string,
    translations: (code: string) => string,
    gameData: GameModel,
    player: Player
}

const StartGame = ({parent, backgroundColor, translations, gameData, player }: Props) => {
    const game = new Game({ ...config, parent, backgroundColor });
    game.registry.set(GLOBAL_REGISTRY_TRANSLATIONS, translations);
    game.registry.set(GLOBAL_REGISTRY_GAME_DATA, gameData);
    game.registry.set(GLOBAL_REGISTRY_PLAYER, player);
    return game;
}

export default StartGame;
