import { Piece } from "./Piece";
import { Point } from "./Point";

export interface Cell {
    tileMapName: string,
    tileNumber: number,
    piece?: Piece,
    position: Point,
}
