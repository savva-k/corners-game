import { type Game as GameModel, Piece as PieceEnum } from "../model";
import { type Point } from "../model/Point";
import { type TileMap } from "../model/TileMap";
import { getPieceTexture, pointifyString } from "../utils/GameBoardUtils";
import { GAME_SCENE_SCALE_FACTOR, GLOBAL_REGISTRY_TEXTURES, SPRITES } from "../constan";
import { Game } from "../scenes/Game";
import { Cell } from "./Cell";
import Piece from "./Piece";
import { type Coordinates } from "./types";

export default class Field {

    scene;
    game;
    tileMaps: Record<string, TileMap>;
    pieces: Record<string, Piece> = {};
    cells: Record<string, Cell> = {};

    fieldOffsetX = 0;
    fieldOffsetY = 0;
    mapWidthInCells = 0;
    mapHeightInCells = 0;
    scaleFactor = 1;
    selectedPieceCell: string | null = null;


    constructor(scene: Game, game: GameModel, currentPlayerPieceColor: PieceEnum) {
        this.scene = scene;
        this.game = game;

        scene.events.on('cell-clicked', this.handleCellClick, this);

        this.tileMaps = this.scene.game.registry.get(GLOBAL_REGISTRY_TEXTURES);
        this.scaleFactor = this.scene.registry.get(GAME_SCENE_SCALE_FACTOR) as number;

        this.mapWidthInCells = this.game.gameMap.size.width;
        this.mapHeightInCells = this.game.gameMap.size.height;

        this.calculateFieldXYOffset();
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

    getPiecesByType() {
        const piecesByType: Record<PieceEnum, Piece[]> = { 'WHITE': [], 'BLACK': [] };
        Object.values(this.pieces).forEach(piece => piecesByType[piece.pieceType].push(piece));
        return piecesByType;
    }

    private handleCellClick(cellName: string) {
        if (this.pieces[cellName]) {
            this.selectedPieceCell = cellName;
        }

        if (this.selectedPieceCell && !this.pieces[cellName]) {
            console.log('Request moving piece from ' + this.selectedPieceCell + ' to ' + cellName);
            this.scene.events.emit('move-piece', { from: pointifyString(this.selectedPieceCell), to: pointifyString(cellName) });
            this.selectedPieceCell = null;
        }
    }

    private initGameBoard(currentPlayerPieceColor: PieceEnum) {
        const mirrorField = currentPlayerPieceColor === this.game.player2Piece;

        Object.keys(this.game.gameMap.field).forEach(pointName => {
            const cell = this.game.gameMap.field[pointName];
            const { x, y } = this.getCellCoordinate(cell.tileMapName, cell.position, mirrorField);
            this.cells[pointName] = new Cell(this.scene, pointName, x, y, cell.tileMapName, cell.tileNumber);

            if (cell.piece) {
                const pieceTileMapName = getPieceTexture(cell.piece);
                const piece = new Piece(
                    this.scene,
                    x,
                    this.getPieceYCoordCorrection(pieceTileMapName, cell.tileMapName, y),
                    cell.piece,
                    pieceTileMapName
                );
                this.pieces[pointName] = piece;

                if (!this.game.isFinished) {
                    this.scene.time.delayedCall(
                        Math.random() * 3000,
                        () => piece.idle()
                    );
                }
            }
        });
    }

    private getCellCoordinate(tileMapName: string, point: Point, mirrorField: boolean) {
        const tileMap = this.tileMaps[tileMapName] as TileMap;
        const pointX = mirrorField ? this.game.gameMap.size.width - 1 - point.x : point.x;
        const pointY = mirrorField ? this.game.gameMap.size.height - 1 - point.y : point.y;

        return {
            x: Math.ceil(this.fieldOffsetX + pointX * tileMap.tileWidth * this.scaleFactor + (tileMap.tileWidth / 2)),
            y: Math.ceil(this.fieldOffsetY + pointY * tileMap.tileHeight * this.scaleFactor + (tileMap.tileHeight / 2))
        };
    }

    private getPieceYCoordCorrection(pieceTileMapName: string, cellTileMapName: string, y: number) {
        const cellTileMap = this.tileMaps[cellTileMapName];
        return Math.ceil(y - (SPRITES[pieceTileMapName].height * this.scaleFactor - cellTileMap.tileHeight * this.scaleFactor) / 2);
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

    private calculateFieldXYOffset() {
        const cellTileMapName = this.game.gameMap.field['0,0'].tileMapName;
        const cellTileMap = this.tileMaps[cellTileMapName];

        this.fieldOffsetX = Math.ceil(this.scene.scale.width / 2 - this.mapWidthInCells * cellTileMap.tileWidth * this.scaleFactor / 2);
        this.fieldOffsetY = Math.ceil(this.scene.scale.height / 2 - this.mapHeightInCells * cellTileMap.tileHeight * this.scaleFactor / 2);
    }
}
