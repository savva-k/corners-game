import { Game as GameModel } from "../../model";
import { getCurrentPlayerPieceColor, getFiles, getRanks } from "../../utils/GameBoardUtils";
import { GAME_FIELD_OFFSET, SPRITES } from "../constan";
import { Game } from "../scenes/Game";
import { Cell } from "./Cell";

export default class Field {

    scene;
    game;

    constructor(scene: Game, game: GameModel) {
        this.scene = scene;
        this.game = game;

        scene.events.on('cell-clicked', this.handleCellClick, this);
        scene.events.on('game-data-updated', this.gameUpdate, this);

        this.initGameBoard();
    }

    handleCellClick(cellName: string) {
        console.log('Clicked ' + cellName);
    }

    gameUpdate(newGameData: GameModel) {
        console.log('Update ' + newGameData);
    }

    private initGameBoard() {
        const player1 = this.game.player1;
        const pieceColor = getCurrentPlayerPieceColor(this.game, player1);
        const files = getFiles(pieceColor);
        const ranks = getRanks(pieceColor);

        let dark = false;

        for (let file = 0; file < files.length; file++) {
            for (let rank = 0; rank < ranks.length; rank++) {
                this.createCell(files, ranks, file, rank, dark);
                dark = !dark;
            }
            dark = !dark;
        }
    }

    private createCell(files: string[], ranks: number[], file: number, rank: number, dark: boolean) {
        const name = `${files[file]}${ranks[rank]}`; // e.g. a1
        const {x, y} = this.getCellCooridate(file, rank);
        new Cell(this.scene, name, x, y, dark);
    }
    
    private getCellCooridate(x: integer, y: integer) {
        return {
            x: GAME_FIELD_OFFSET + x * SPRITES.cell.width + (SPRITES.cell.width / 2),
            y: GAME_FIELD_OFFSET + y * SPRITES.cell.height + (SPRITES.cell.height / 2)
        }
    }
}
