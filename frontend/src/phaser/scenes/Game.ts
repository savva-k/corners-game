import { Scene, GameObjects } from 'phaser';
import { EventBus } from '../EventBus';
import Field from '../gameobjects/Field';
import { GAME_FRAME_OFFSET, GAME_SCENE_SCALE_FACTOR, GLOBAL_REGISTRY_GAME_DATA, GLOBAL_REGISTRY_PLAYER, GLOBAL_REGISTRY_TEXTURES, GLOBAL_REGISTRY_TRANSLATIONS, SPRITES } from '../constan';
import Cursor from '../gameobjects/Cursor';
import { Game as GameModel } from '../../model/Game';
import { Turn } from '../../model/Turn';
import { getPlayersPieceColor, getOpponentPlayerPieceColor, getPieceTexture, stringifyPoint, getOppositePieceColor } from '../../utils/GameBoardUtils';
import { FinishReason, Piece, Player } from '../../model';
import { TurnValidationResponse } from '../../model/TurnValidationResponse';
import { getTileMap } from '../../api';
import { TileMap } from '../../model/TileMap';
import { showErrorPopup } from '../gameobjects/ErrorPopup';
import { Point } from '../../model/Point';

export const MAIN_GAME_SCENE_KEY = 'Game';

const OUT_OF_SCREEN = -100;
const FIX_POS = -5;

export interface TurnRequest {
    from: Point,
    to: Point,
}

export class Game extends Scene {

    debug = false;

    player: Player;
    gameData: GameModel;
    tileMaps: Record<string, TileMap>;
    translations: (code: string) => string;

    field: Field;
    cursor: Cursor;
    currentTurnLabel: GameObjects.Text;

    bgMusic: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;

    currentPlayersMove = false;

    constructor() {
        super(MAIN_GAME_SCENE_KEY);
    }

    preload() {
        this.gameData = this.game.registry.get(GLOBAL_REGISTRY_GAME_DATA);
        this.player = this.game.registry.get(GLOBAL_REGISTRY_PLAYER);
        this.translations = this.game.registry.get(GLOBAL_REGISTRY_TRANSLATIONS);

        this.load.setPath('/assets');
        this.load.audio('background-music', 'sounds/little-slimex27s-adventure.mp3');
        this.load.audio('piece-jump', 'sounds/jump.wav');
        this.load.audio('cursor-click', 'sounds/click.wav');
        this.load.audio('exception', 'sounds/exception.wav');
        this.load.audio('winner', 'sounds/winning-218995.mp3');
        this.load.audio('loser', 'sounds/brass-fail-10-c-207138.mp3');

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
        this.tileMaps = this.game.registry.get(GLOBAL_REGISTRY_TEXTURES);

        // Load static tile maps
        // todo: move them to the server
        for (const name in SPRITES) {
            const sprite = SPRITES[name];
            this.load.spritesheet(name, sprite.image, { frameWidth: sprite.width, frameHeight: sprite.height });
        }
    }

    create() {
        this.calculateAndSetScaleFactor();
        this.cursor = new Cursor(this);
        this.turnOnMusic();

        this.initGameField();
        this.addCurrentTurnLabel();
        this.addOpponentLabel();
        this.updateCurrentPlayersMove();
        this.gameData.isFinished ? this.replayGameOver() : this.replayLastTurn();

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

    handleInvalidTurn(turnValidation: TurnValidationResponse) {
        this.cursor.enable();
        console.log('invalid turn! ' + JSON.stringify(turnValidation));
    }

    handleGameOver(finishReason: FinishReason, winner: Player) {
        switch (finishReason) {
            case FinishReason.WhiteWon:
            case FinishReason.BlackWon:
                this.handleWin(finishReason, winner);
                break;
            case FinishReason.DrawBlackCantMove:
            case FinishReason.DrawWhiteCantMove:
            case FinishReason.DrawBothHome:
            case FinishReason.DrawMoreThan80Moves:
                this.handleDraw(finishReason);
                break;
        }
    }

    handleException(exceptionTranslationCode: string) {
        showErrorPopup(
            this,
            this.translations(exceptionTranslationCode)
        );
    }

    setMakeTurn(makeTurnFunc: ({ from, to }: TurnRequest) => void) {
        this.events.on('move-piece', ({ from, to }: TurnRequest) => {
            if (!this.currentPlayersMove || this.gameData.isFinished) return;
            this.cursor.disable();
            this.cursor.moveOutOfScreen();
            makeTurnFunc({ from, to });
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
        this.bgMusic = this.sound.add('background-music');
        this.bgMusic.volume = 0.1;
        this.bgMusic.play({ loop: true });
    }

    private turnOffMusic() {
        if (this.bgMusic) {
            this.bgMusic.stop();
        }
    }

    private initGameField() {
        const pieceColor = getPlayersPieceColor(this.gameData, this.player);
        this.field = new Field(this, this.gameData, pieceColor);
    }

    private addOpponentLabel() {
        const opponentPlayersPieceTexture = getPieceTexture(getOpponentPlayerPieceColor(this.gameData, this.player));
        const opponentName = this.gameData.player1.name === this.player.name ? this.gameData.player2!.name : this.gameData.player1.name;
        const label = this.add.text(OUT_OF_SCREEN, OUT_OF_SCREEN, opponentName);
        const x = this.scale.gameSize.width - label.width;
        const y = GAME_FRAME_OFFSET - label.height - 10;
        this.add.sprite(x - label.width / 2 + FIX_POS, y + FIX_POS, opponentPlayersPieceTexture, 0);
        label.setPosition(x, y);
    }

    private addCurrentTurnLabel() {
        if (!this.currentTurnLabel) {
            this.currentTurnLabel = this.add.text(-100, -100, '');
        }
        const currentPlayersPieceTexture = getPieceTexture(getPlayersPieceColor(this.gameData, this.player));
        const x = 0;
        const y = this.scale.gameSize.height - GAME_FRAME_OFFSET + this.currentTurnLabel.height - 10;
        const pieceSprite = this.add.sprite(OUT_OF_SCREEN, OUT_OF_SCREEN, currentPlayersPieceTexture, 0);
        pieceSprite.setPosition(x + pieceSprite.width / 2 + FIX_POS, y + FIX_POS);
        this.currentTurnLabel.setY(y);
    }

    private updateCurrentPlayersMove() {
        this.currentPlayersMove = this.gameData.currentTurn === getPlayersPieceColor(this.gameData, this.player);
        this.currentPlayersMove && !this.gameData.isFinished
            ? this.cursor.enable()
            : this.cursor.disable();
        this.updateCurrentTurnLabel();
    }

    private replayGameOver() {
        if (!this.gameData.finishReason || !this.gameData.winner) {
            console.error('Finish reason or winner is not set, we cannot celebrate :(');
            return;
        }
        this.handleGameOver(this.gameData.finishReason, this.gameData.winner)
    }

    private switchCurrentTurn() {
        this.gameData.currentTurn = this.gameData.currentTurn === Piece.White ? Piece.Black : Piece.White;
    }

    private updateCurrentTurnLabel() {
        this.currentTurnLabel.text = this.getCurrentTurnLabelText();
        this.currentTurnLabel.setX(this.scale.gameSize.width / 2 - this.currentTurnLabel.width / 2);
    }

    private getCurrentTurnLabelText() {
        let translationCode;

        if (this.gameData.isFinished) {
            translationCode = 'in_game:gameFinished';
        } else {
            translationCode = this.currentPlayersMove ? 'in_game:yourTurn' : 'in_game:opponentsTurn';
        }

        return this.translations(translationCode);
    }

    private calculateAndSetScaleFactor() {
        const cellTileMapName = this.gameData.gameMap.field['0,0'].tileMapName;
        const { tileWidth, tileHeight } = this.tileMaps[cellTileMapName];
        const fieldWidth = tileWidth * this.gameData.gameMap.size.width;
        const fieldHeight = tileHeight * this.gameData.gameMap.size.height;
        const { width: sceneWidth, height: sceneHeight } = this.scale;

        let scaleFactorX = 1;
        let scaleFactorY = 1;

        if (sceneWidth < fieldWidth) {
            scaleFactorX = sceneWidth / fieldWidth;
        }

        if (sceneHeight < fieldHeight) {
            scaleFactorY = sceneHeight / fieldHeight;
        }

        this.registry.set(GAME_SCENE_SCALE_FACTOR, Math.min(scaleFactorX, scaleFactorY));
    }

    private handleWin(finishReason: FinishReason, winner: Player) {
        console.log(winner.name + ' wins! ' + finishReason);

        const currentPlayersPiece = getPlayersPieceColor(this.gameData, this.player);
        const winnerPiece = getPlayersPieceColor(this.gameData, winner);
        const loserPiece = getOppositePieceColor(winnerPiece);
        const pieces = this.field.getPiecesByType();

        pieces[winnerPiece].forEach(piece => piece.win());
        pieces[loserPiece].forEach(piece => piece.lose());

        this.turnOffMusic();
        this.sound.play(
            currentPlayersPiece === winnerPiece ? 'winner' : 'loser',
            { volume: 0.4 }
        );
    }

    private handleDraw(finishReason: FinishReason) {
        console.log('Draw: ' + finishReason);
        // todo
    }

}
