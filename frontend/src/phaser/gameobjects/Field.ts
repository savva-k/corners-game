import { Game as GameModel, Piece as PieceEnum } from "../../model";
import { getCurrentPlayerPieceColor, getFiles, getRanks } from "../../utils/GameBoardUtils";
import { GAME_FIELD_OFFSET, SPRITES } from "../constan";
import { Game } from "../scenes/Game";
import { Cell } from "./Cell";
import Piece from "./Piece";
import { Coordinates } from "./types";

export default class Field {

    scene;
    game;
    pieces: Record<string, Piece> = {};
    cells: Record<string, Cell> = {};
    selectedPieceCell: string | null = null;

    constructor(scene: Game, game: GameModel) {
        this.scene = scene;
        this.game = game;

        scene.events.on('cell-clicked', this.handleCellClick, this);
        scene.events.on('game-data-updated', this.gameUpdate, this);

        this.initGameBoard();
    }

    movePieceWithAnimation(fromPosition: string, jumpPath: string[]) {
        const piece = this.pieces[fromPosition];

        if (!piece) {
            console.error("Incorrect piece position was sent " + fromPosition);
            console.log(this.pieces);
            console.log(jumpPath);
            return;
        }

        if (jumpPath.length < 1) {
            console.error("Jump path is too short");
            return;
        }

        piece.moveTo(jumpPath.map(pathCellName => this.getPieceCoordinates(pathCellName, piece.texture.key)));
    }

    movePiece(fromPosition: string, toPosition: string) {
        const piece = this.pieces[fromPosition];

        if (!piece) {
            console.error("movePiece: incorrect piece position was sent");
            return;
        }

        if (this.pieces[toPosition]) {
            console.error("movePiece: target location is taken");
            return;
        }

        delete this.pieces[fromPosition];
        this.pieces[toPosition] = piece;
        const coordinates = this.getPieceCoordinates(toPosition, piece.texture.key);
        piece.x = coordinates.x;
        piece.y = coordinates.y;
    }

    handleCellClick(cellName: string, x: number, y: number) {
        if (this.pieces[cellName]) {
            this.selectedPieceCell = cellName;
        }

        if (this.selectedPieceCell && !this.pieces[cellName]) {
            const selectedPiece = this.pieces[this.selectedPieceCell];
            // todo call move api

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
        this.cells[name] = new Cell(this.scene, name, x, y, dark);

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

    private getPieceCoordinates(cellName: string, pieceTextureKey: string): Coordinates {
        const cell = this.cells[cellName];
        if (!cell) {
            console.error("Cell not found, that's strange");
        }
        return {
            x: cell.x,
            y: this.getPieceYCoordCorrection(pieceTextureKey, cell.y),
        };
    }
}
