import { Scene, GameObjects } from 'phaser';
import { EventBus } from '../EventBus';
import Field from '../gameobjects/Field';
import { GAME_FIELD_OFFSET, GLOBAL_REGISTRY_GAME_DATA, GLOBAL_REGISTRY_PLAYER, GLOBAL_REGISTRY_TEXTURES, GLOBAL_REGISTRY_TRANSLATIONS, SPRITES } from '../constan';
import Cursor from '../gameobjects/Cursor';
import { Game as GameModel } from '../../model/Game';
import { Turn } from '../../model/Turn';
import { getCurrentPlayerPieceColor, stringifyPoint } from '../../utils/GameBoardUtils';
import { Piece, Player } from '../../model';
import { TurnValidation } from '../../model/TurnValidation';
import { getTileMap } from '../../api';

export const MAIN_GAME_SCENE_KEY = 'Game';

export interface TurnRequest {
    from: string,
    to: string,
}

export class Game extends Scene {

    debug = false;

    player: Player;
    gameData: GameModel;
    translations: (code: string) => string;

    field: Field;
    cursor: Cursor;
    currentTurnLabel: GameObjects.Text;

    currentPlayersMove = false;

    constructor() {
        super(MAIN_GAME_SCENE_KEY);
    }

    preload() {
        this.gameData = this.game.registry.get(GLOBAL_REGISTRY_GAME_DATA);
        this.player = this.game.registry.get(GLOBAL_REGISTRY_PLAYER);

        this.load.setPath('/assets');
        this.load.audio('background-music', 'sounds/little-slimex27s-adventure.mp3');
        this.load.audio('piece-jump', 'sounds/jump.wav');
        this.load.audio('cursor-click', 'sounds/click.wav');

        this.translations = this.game.registry.get(GLOBAL_REGISTRY_TRANSLATIONS);

        // Load tilemaps dynamically by gathering all unique tile map names and requesting an API
        this.game.registry.set(GLOBAL_REGISTRY_TEXTURES, {});
        const requiredTileMaps = [...new Set(Object.values(this.gameData.gameMap.field).map(cell => cell.tileMapName))];
        requiredTileMaps.forEach(tileMapName => {
            getTileMap(tileMapName).then(res => {
                const { name, imageUrl, tileWidth, tileHeight } = res.data;
                this.game.registry.get(GLOBAL_REGISTRY_TEXTURES)[name] = res.data;
                this.load.spritesheet(name, imageUrl, { frameWidth: tileWidth, frameHeight: tileHeight });
            })
        });

        // Load static tile maps
        // todo: move them to the server
        for (const name in SPRITES) {
            const sprite = SPRITES[name];
            this.load.spritesheet(name, sprite.image, { frameWidth: sprite.width, frameHeight: sprite.height });
        }
    }

    create() {
        this.cursor = new Cursor(this);
        this.turnOnMusic();

        this.initGameField();
        this.addCurrentPlayerLabel();
        this.addOpponentLabel();
        this.replayLastTurn();
        this.updateCurrentPlayersMove();

        EventBus.emit('current-scene-ready', this);
    }

    getGameId() {
        return this.gameData.id;
    }

    handleNewTurn(turn: Turn) {
        this.gameData.turns.push(turn);
        this.field.movePieceWithAnimation(
            stringifyPoint(turn.from),
            turn.path.reverse().slice(1).map(point => stringifyPoint(point))
        );
        this.switchCurrentTurn();
        this.updateCurrentPlayersMove();
    }

    handleInvalidTurn(turnValidation: TurnValidation) {
        this.cursor.setEnabled(true);
        console.log('invalid turn! ' + JSON.stringify(turnValidation));
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
        const jumpPath = lastTurn.path.slice(0, lastTurn.path.length - 1).reverse().map(point => stringifyPoint(point));
        this.field.movePiece(stringifyPoint(lastTurn.to), stringifyPoint(lastTurn.from));
        this.field.movePieceWithAnimation(stringifyPoint(lastTurn.from), jumpPath)
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
        this.updateCurrentTurnLabel();
    }

    private switchCurrentTurn() {
        this.gameData.currentTurn = this.gameData.currentTurn === Piece.White ? Piece.Black : Piece.White;
    }

    private updateCurrentTurnLabel() {
        const labelText = this.translations(this.currentPlayersMove ? 'in_game:yourTurn' : 'in_game:opponentsTurn');

        if (!this.currentTurnLabel) {
            this.currentTurnLabel = this.add.text(-100, -100, '');
        }

        this.currentTurnLabel.text = labelText;
        const x = this.scale.gameSize.width - GAME_FIELD_OFFSET - this.currentTurnLabel.width;
        const y = this.scale.gameSize.height - GAME_FIELD_OFFSET + this.currentTurnLabel.height - 10;
        this.currentTurnLabel.setPosition(x, y);
    }

}
