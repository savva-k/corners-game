import { Game as GameModel, Piece as PieceEnum } from "../../model";
import { Point } from "../../model/Point";
import { TileMap } from "../../model/TileMap";
import { pointifyString } from "../../utils/GameBoardUtils";
import { GAME_FIELD_OFFSET, GLOBAL_REGISTRY_TEXTURES, SPRITES } from "../constan";
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

    constructor(scene: Game, game: GameModel, currentPlayerPieceColor: PieceEnum) {
        this.scene = scene;
        this.game = game;

        scene.events.on('cell-clicked', this.handleCellClick, this);

        this.initGameBoard(currentPlayerPieceColor);
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

        delete this.pieces[fromPosition];

        const toPosition = jumpPath[jumpPath.length - 1];
        this.pieces[toPosition] = piece;
        piece.moveToAnimated(jumpPath.map(pathCellName => this.getPieceCoordinates(pathCellName, piece.texture.key)));
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
        piece.moveTo(this.getPieceCoordinates(toPosition, piece.texture.key));
    }

    private handleCellClick(cellName: string) {
        if (this.pieces[cellName]) {
            this.selectedPieceCell = cellName;
        }

        if (this.selectedPieceCell && !this.pieces[cellName]) {
            this.scene.events.emit('move-piece', { from: pointifyString(this.selectedPieceCell), to: pointifyString(cellName) });
            this.selectedPieceCell = null;
            console.log('Request moving piece from ' + this.selectedPieceCell + ' to ' + cellName);
        }
    }

    private initGameBoard(currentPlayerPieceColor: PieceEnum) {
        // todo - reverse field for player 2
        Object.keys(this.game.gameMap.field).forEach(pointName => {
            const cell = this.game.gameMap.field[pointName];
            const { x, y } = this.getCellCoordinate(cell.tileMapName, cell.position);
            this.cells[pointName] = new Cell(this.scene, pointName, x, y, cell.tileMapName, cell.tileNumber);

            if (cell.piece) {
                const pieceTileMapName = cell.piece == PieceEnum.White ? 'piece_white' : 'piece_black';
                this.pieces[pointName] = new Piece(
                    this.scene,
                    x,
                    this.getPieceYCoordCorrection(pieceTileMapName, cell.tileMapName, y),
                    pieceTileMapName
                );
            }
        });
    }

    private getCellCoordinate(tileMapName: string, point: Point) {
        const tileMap = this.scene.game.registry.get(GLOBAL_REGISTRY_TEXTURES)[tileMapName] as TileMap;

        return {
            x: GAME_FIELD_OFFSET + point.x * tileMap.tileWidth + (tileMap.tileWidth / 2),
            y: GAME_FIELD_OFFSET + point.y * tileMap.tileHeight + (tileMap.tileHeight / 2)
        }
    }

    private getPieceYCoordCorrection(pieceTileMapName: string, cellTileMapName: string, y: number) {
        const cellTileMap = this.scene.game.registry.get(GLOBAL_REGISTRY_TEXTURES)[cellTileMapName] as TileMap;
        return y - (SPRITES[pieceTileMapName].height - cellTileMap.tileHeight) / 2
    }

    private getPieceCoordinates(cellName: string, pieceTextureKey: string): Coordinates {
        const cell = this.cells[cellName];
        if (!cell) {
            console.error("Cell not found, that's strange");
        }
        return {
            x: cell.x,
            y: this.getPieceYCoordCorrection(pieceTextureKey, cell.texture.key, cell.y),
        };
    }
}
