import { Game as GameModel, Piece as PieceEnum } from "../../model";
import { getCurrentPlayerPieceColor, getFiles, getRanks } from "../../utils/GameBoardUtils";
import { GAME_FIELD_OFFSET, SPRITES } from "../constan";
import { Game } from "../scenes/Game";
import { Cell } from "./Cell";
import Piece from "./Piece";

export default class Field {

    scene;
    game;
    pieces: Record<string, Piece> = {};
    selectedPieceCell: string | null = null;

    constructor(scene: Game, game: GameModel) {
        this.scene = scene;
        this.game = game;

        scene.events.on('cell-clicked', this.handleCellClick, this);
        scene.events.on('game-data-updated', this.gameUpdate, this);

        this.initGameBoard();
    }

    handleCellClick(cellName: string, x: number, y: number) {
        if (this.pieces[cellName]) {
            this.selectedPieceCell = cellName;
        }

        if (this.selectedPieceCell && !this.pieces[cellName]) {
            const selectedPiece = this.pieces[this.selectedPieceCell];
            delete this.pieces[this.selectedPieceCell];
            this.pieces[cellName] = selectedPiece;
            selectedPiece.moveTo(x, this.getPieceYCoordCorrection(selectedPiece.texture.key, y));
            this.selectedPieceCell = null;
        }
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
        const { x, y } = this.getCellCooridate(file, rank);
        new Cell(this.scene, name, x, y, dark);

        if (this.game.field[name]) {
            const texture = this.game.field[name] == PieceEnum.White ? 'piece_white' : 'piece_black';
            this.pieces[name] = new Piece(this.scene, x, this.getPieceYCoordCorrection(texture, y), texture);
        }
    }

    private getCellCooridate(x: integer, y: integer) {
        return {
            x: GAME_FIELD_OFFSET + x * SPRITES.cell.width + (SPRITES.cell.width / 2),
            y: GAME_FIELD_OFFSET + y * SPRITES.cell.height + (SPRITES.cell.height / 2)
        }
    }

    private getPieceYCoordCorrection(texture: string, y: number) {
        return y - (SPRITES[texture].height - SPRITES['cell'].height) / 2
    }
}
