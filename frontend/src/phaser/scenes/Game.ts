import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import Field from '../gameobjects/Field';
import { GAME_FIELD_OFFSET, SPRITES } from '../constan';
import Cursor from '../gameobjects/Cursor';
import { Game as GameModel } from '../../model/Game';
import { Turn } from '../../model/Turn';
import { getCurrentPlayerPieceColor } from '../../utils/GameBoardUtils';
import { Piece, Player } from '../../model';

export const MAIN_GAME_SCENE_KEY = 'Game';

export interface TurnRequest {
    from: string,
    to: string,
}

export class Game extends Scene {

    debug = false;

    player: Player;
    gameData: GameModel;

    field: Field;
    cursor: Cursor;

    currentPlayersMove = false;

    constructor() {
        super(MAIN_GAME_SCENE_KEY);
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
        this.cursor = new Cursor(this);
        this.turnOnMusic();
        EventBus.emit('current-scene-ready', this);
    }

    setGame(gameData: GameModel) {
        this.gameData = gameData;

        this.initGameField();
        this.addCurrentPlayerLabel();
        this.addOpponentLabel();
        this.replayLastTurn();
        this.updateCurrentPlayersMove();
    }

    setCurrentPlayer(player: Player) {
        this.player = player;
    }

    handleNewTurn(turn: Turn) {
        this.gameData.turns.push(turn);
        this.field.movePieceWithAnimation(turn.from, turn.path.reverse().slice(1));
        this.switchCurrentTurn();
        this.updateCurrentPlayersMove();
    }

    setMakeTurn(makeTurnFunc: ({from, to}: TurnRequest) => void) {
        this.events.on('move-piece', ({from, to}: TurnRequest) => {
            if (!this.currentPlayersMove) return;
            this.cursor.setEnabled(false);
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
        const pieceColor = getCurrentPlayerPieceColor(this.gameData, this.player);
        this.field = new Field(this, this.gameData, pieceColor);
    }

    private addOpponentLabel() {
        const opponentName = this.gameData.player1.name === this.player.name ? this.gameData.player2!.name : this.gameData.player1.name;
        const label = this.add.text(-100, -100, opponentName);
        const x = this.scale.gameSize.width - GAME_FIELD_OFFSET - label.width;
        const y = GAME_FIELD_OFFSET - label.height - 10;
        label.setPosition(x, y);
    }

    private addCurrentPlayerLabel() {
        const label = this.add.text(-100, -100, this.player.name);
        const x = GAME_FIELD_OFFSET;
        const y = this.scale.gameSize.height - GAME_FIELD_OFFSET + label.height - 10;
        label.setPosition(x, y);
    }

    private updateCurrentPlayersMove() {
        this.currentPlayersMove = this.gameData.currentTurn === getCurrentPlayerPieceColor(this.gameData, this.player);
        this.cursor.setEnabled(this.currentPlayersMove);
    }

    private switchCurrentTurn() {
        this.gameData.currentTurn = this.gameData.currentTurn === Piece.White ? Piece.Black : Piece.White;
    }

}
