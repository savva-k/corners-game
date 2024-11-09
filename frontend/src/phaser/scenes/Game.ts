import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import Field from '../gameobjects/Field';
import { SPRITES } from '../constan';
import Cursor from '../gameobjects/Cursor';
import { Game as GameModel } from '../../model/Game';
import { Turn } from '../../model/Turn';

export interface TurnRequest {
    from: string,
    to: string,
}

export class Game extends Scene {

    debug = false;
    field: Field;
    gameData: GameModel;

    constructor() {
        super('Game');
    }

    preload() {
        this.load.setPath('/assets');
        this.load.audio('background-music', 'sounds/little-slimex27s-adventure.mp3');
        this.load.audio('piece-jump', 'sounds/jump.wav');
        this.load.audio('cursor-click', 'sounds/click.wav');

        for (const name in SPRITES) {
            const sprite = SPRITES[name];
            this.load.spritesheet(name, sprite.image, { frameWidth: sprite.width, frameHeight: sprite.height });
        }
    }

    create() {
        new Cursor(this);
        this.turnOnMusic();
        EventBus.emit('current-scene-ready', this);
    }

    setGame(gameData: GameModel) {
        this.gameData = gameData;
        this.field = new Field(this, this.gameData);
        this.replayLastTurn();
    }

    handleNewTurn(turn: Turn) {
        this.gameData.turns.push(turn);
        this.field.movePieceWithAnimation(turn.from, turn.path.reverse().slice(1));
    }

    setMakeTurn(makeTurnFunc: ({from, to}: TurnRequest) => void) {
        this.events.on('move-piece', ({from, to}: TurnRequest) => {
            makeTurnFunc({from, to});
        });
    }

    private replayLastTurn() {
        if (this.gameData.turns.length == 0) {
            return;
        }
        const lastTurn = this.gameData.turns[this.gameData.turns.length - 1];
        const jumpPath = lastTurn.path.slice(0, lastTurn.path.length - 1).reverse();
        this.field.movePiece(lastTurn.to, lastTurn.from);
        this.field.movePieceWithAnimation(lastTurn.from, jumpPath)
    }

    private turnOnMusic() {
        const bgMusic = this.sound.add('background-music');
        bgMusic.volume = 0.1;
        // bgMusic.play({ loop: true });
    }

}
