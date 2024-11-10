import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import Field from '../gameobjects/Field';
import { GAME_FIELD_OFFSET, SPRITES } from '../constan';
import Cursor from '../gameobjects/Cursor';
import { Game as GameModel } from '../../model/Game';
import { Turn } from '../../model/Turn';
import { getCurrentPlayerPieceColor } from '../../utils/GameBoardUtils';

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

        this.initGameField();
        this.addCurrentPlayerLabel(gameData.player1.name);
        this.addOpponentLabel(gameData.player2!.name);
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

    private initGameField() {
        const player1 = this.gameData.player1;
        const pieceColor = getCurrentPlayerPieceColor(this.gameData, player1);
        this.field = new Field(this, this.gameData, pieceColor);
    }

    private addOpponentLabel(name: string) {
        const label = this.add.text(-100, -100, name);
        const x = this.scale.gameSize.width - GAME_FIELD_OFFSET - label.width;
        const y = GAME_FIELD_OFFSET - label.height - 10;
        label.setPosition(x, y);
    }

    private addCurrentPlayerLabel(name: string) {
        const label = this.add.text(-100, -100, name);
        const x = GAME_FIELD_OFFSET;
        const y = this.scale.gameSize.height - GAME_FIELD_OFFSET + label.height - 10;
        label.setPosition(x, y);
    }

}
