import { Scene } from 'phaser';
import Field from '../../gameobjects/Field';
import { GAME_SCENE_SCALE_FACTOR, GLOBAL_REGISTRY_TEXTURES } from '../../constan';
import Cursor from '../../gameobjects/Cursor';
import { type Game as GameModel } from '../../model/Game';
import { type Turn } from '../../model/Turn';
import { getOpponentPlayerPieceColor, stringifyPoint, getOppositePieceColor } from '../../utils/GameBoardUtils';
import { FinishReason, Piece, type Player } from '../../model';
import { type TurnValidationResponse } from '../../model/TurnValidationResponse';
import { type TileMap } from '../../model/TileMap';
import { showErrorPopup } from '../../gameobjects/ErrorPopup';
import { type Point } from '../../model/Point';
import { MainGameHandler } from './MainGameHandler';
import { getPlayerUsername } from '../../utils/JwtUtil';
import { HUD } from './HUD';
import { SoundManager } from './SoundManager';

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

    currentPlayersMove = false;

    handler!: MainGameHandler;
    hud!: HUD;
    soundManager!: SoundManager;

    constructor() {
        super('Game');
    }

    init(data: { gameData: GameModel }) {
        if (data.gameData) {
            this.gameData = data.gameData;
            this.player = this.getPlayer()!;
        } else {
            console.error("Game data and / or player is undefined!");
        }
    }

    preload() {
        this.translations = (s) => s; // todo fix i18n
        this.tileMaps = this.game.registry.get(GLOBAL_REGISTRY_TEXTURES);
        this.handler = new MainGameHandler(this.registry.get('ws'), this);
        this.handler.activate();
        this.hud = new HUD(this);
        this.soundManager = new SoundManager(this);
    }

    create() {
        this.calculateAndSetScaleFactor();
        this.cursor = new Cursor(this);

        this.initGameField();
        this.hud.addCurrentTurnLabel(this.field.fieldOffsetY);
        this.hud.addPlayerLabel(this.player);
        this.hud.addOrReplaceOpponentLabel(this.getOpponentName(), getOpponentPlayerPieceColor(this.player));
        this.updateCurrentPlayersMove();
        this.gameData.isFinished ? this.replayGameOver() : this.replayLastTurn();

        this.events.on('move-piece', (turnRequest: TurnRequest) => {
            if (!this.currentPlayersMove || !this.gameData.isStarted || this.gameData.isFinished) return;
            this.cursor.disable();
            this.cursor.moveOutOfScreen();
            this.handler.makeTurn(turnRequest);
        });

        this.events.emit('start-game');
    }

    onShutdown() {
        this.handler.deactivate();
    }

    handleNewPlayerJoined(player: Player, isStarted: boolean) {
        if (!this.gameData.player1) {
            this.gameData.player1 = player;
        } else if (!this.gameData.player2) {
            this.gameData.player2 = player;
        }
        this.gameData.isStarted = isStarted;

        console.log("New player joined: " + JSON.stringify(player) + ", isStarted: " + isStarted);
        this.hud.addOrReplaceOpponentLabel(this.getOpponentName(), getOpponentPlayerPieceColor(this.player));
        this.updateCurrentPlayersMove();
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
        this.field.movePieceWithAnimation(stringifyPoint(lastTurn.from), jumpPath);
    }

    private initGameField() {
        this.field = new Field(this, this.gameData, this.player.piece);
    }

    private getOpponentName() {
        const opponent = this.gameData.player1.name === this.player.name ? this.gameData.player2 : this.gameData.player1;
        return opponent ? opponent.name : null;
    }

    private updateCurrentPlayersMove() {
        this.currentPlayersMove = this.gameData.currentTurn === this.player.piece;
        this.currentPlayersMove && !this.gameData.isFinished && this.gameData.isStarted
            ? this.cursor.enable()
            : this.cursor.disable();

        this.hud.updateCurrentTurnLabel(this.currentPlayersMove, this.gameData.isFinished);
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

        const currentPlayersPiece = this.player.piece;
        const winnerPiece = winner.piece;
        const loserPiece = getOppositePieceColor(winnerPiece);
        const pieces = this.field.getPiecesByType();

        pieces[winnerPiece].forEach(piece => piece.win());
        pieces[loserPiece].forEach(piece => piece.lose());

        this.events.emit('finish-game', currentPlayersPiece === winnerPiece ? 'winner' : 'loser');
    }

    private handleDraw(finishReason: FinishReason) {
        console.log('Draw: ' + finishReason);
        // todo
    }

    private getPlayer() {
        const username = getPlayerUsername();
        if (this.gameData.player1?.name === username) {
            return this.gameData.player1;
        } else if (this.gameData.player2?.name === username) {
            return this.gameData.player2;
        }
        throw new Error("Player from JWT not found in game data: " + username);
    }
}
