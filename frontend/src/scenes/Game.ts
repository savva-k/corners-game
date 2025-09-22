import { Scene, GameObjects } from 'phaser';
import Field from '../gameobjects/Field';
import { GAME_FRAME_OFFSET, GAME_SCENE_SCALE_FACTOR, GLOBAL_REGISTRY_TEXTURES } from '../constan';
import Cursor from '../gameobjects/Cursor';
import { type Game as GameModel } from '../model/Game';
import { type Turn } from '../model/Turn';
import { getPlayersPieceColor, getOpponentPlayerPieceColor, getPieceTexture, stringifyPoint, getOppositePieceColor } from '../utils/GameBoardUtils';
import { FinishReason, Piece, type Player } from '../model';
import { type TurnValidationResponse } from '../model/TurnValidationResponse';
import { type TileMap } from '../model/TileMap';
import { showErrorPopup } from '../gameobjects/ErrorPopup';
import { type Point } from '../model/Point';
import { MainGameHandler } from '../statehandlers/MainGameHandler';

const OUT_OF_SCREEN = -100;
const MINUS_5PX = -5;
const PLUS_5PX = 5;

export interface TurnRequest {
    from: Point,
    to: Point,
}

export class Game extends Scene {

    debug = false;

    player!: Player;
    gameData!: GameModel;
    tileMaps!: Record<string, TileMap>;
    translations!: (code: string) => string;

    field!: Field;
    cursor!: Cursor;
    currentTurnLabel!: GameObjects.Text;

    bgMusic!: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;

    currentPlayersMove = false;

    handler!: MainGameHandler;

    constructor() {
        super('Game');
    }

    init(data: { gameData: GameModel, player: Player }) {
        if (data.gameData && data.player) {
            this.gameData = data.gameData;
            this.player = data.player;
        } else {
            console.error("Game data and / or player is undefined!");
        }
    }

    preload() {
        this.translations = (s) => s; // todo fix i18n
        this.tileMaps = this.game.registry.get(GLOBAL_REGISTRY_TEXTURES);
        this.handler = new MainGameHandler(this.registry.get('ws'), this);
        this.handler.activate();
    }

    create() {
        this.calculateAndSetScaleFactor();
        this.cursor = new Cursor(this);
        this.turnOnMusic();

        this.initGameField();
        this.addCurrentTurnLabel();
        this.addPlayerLabel();
        this.addOpponentLabel();
        this.updateCurrentPlayersMove();
        this.gameData.isFinished ? this.replayGameOver() : this.replayLastTurn();

        this.events.on('move-piece', (turnRequest: TurnRequest) => {
            if (!this.currentPlayersMove || !this.gameData.isStarted || this.gameData.isFinished) return;
            this.cursor.disable();
            this.cursor.moveOutOfScreen();
            this.handler.makeTurn(turnRequest);
        });
    }

    onShutdown() {
        this.handler.deactivate();
    }

    getGameId() {
        return this.gameData.id;
    }

    handleNewPlayerJoined(player: Player, isStarted: boolean) {
        this.gameData.player2 = player;
        this.gameData.isStarted = isStarted;

        console.log("New player joined: " + JSON.stringify(player) + ", isStarted: " + isStarted);
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

    private addPlayerLabel() {
        const currentPlayersPieceTexture = getPieceTexture(getPlayersPieceColor(this.gameData, this.player));
        const pieceSprite = this.add.sprite(OUT_OF_SCREEN, OUT_OF_SCREEN, currentPlayersPieceTexture, 0);
        const playerLabel = this.add.text(OUT_OF_SCREEN, OUT_OF_SCREEN, this.player.name);
        const x = 0;
        const y = this.scale.gameSize.height - GAME_FRAME_OFFSET + playerLabel.height - 10;
        pieceSprite.setPosition(x + pieceSprite.width / 2, y);
        playerLabel.setPosition(pieceSprite.x + pieceSprite.width / 2 + PLUS_5PX, y + PLUS_5PX);
    }

    private addOpponentLabel() {
        const opponentPlayersPieceTexture = getPieceTexture(getOpponentPlayerPieceColor(this.gameData, this.player));
        const opponentName = this.getOpponentNameOrUnknown();
        const label = this.add.text(OUT_OF_SCREEN, OUT_OF_SCREEN, opponentName);
        const x = this.scale.gameSize.width - label.width;
        const y = GAME_FRAME_OFFSET - label.height - 10;
        this.add.sprite(x - label.width / 2 + MINUS_5PX, y + MINUS_5PX, opponentPlayersPieceTexture, 0);
        label.setPosition(x, y);
    }

    private getOpponentNameOrUnknown() {
        const opponent = this.gameData.player1.name === this.player.name ? this.gameData.player2 : this.gameData.player1;
        return opponent ? opponent.name : this.translations('in_game:waitingForOpponent');
    }

    private addCurrentTurnLabel() {
        if (!this.currentTurnLabel) {
            this.currentTurnLabel = this.add.text(OUT_OF_SCREEN, OUT_OF_SCREEN, '');
        }
        const y = this.scale.gameSize.height - GAME_FRAME_OFFSET + this.currentTurnLabel.height - 10;
        this.currentTurnLabel.setY(y);
    }

    private updateCurrentPlayersMove() {
        this.currentPlayersMove = this.gameData.currentTurn === getPlayersPieceColor(this.gameData, this.player);
        this.currentPlayersMove && !this.gameData.isFinished && this.gameData.isStarted
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
