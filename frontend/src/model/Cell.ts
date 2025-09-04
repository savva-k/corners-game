import { Piece } from "./Piece";
import { type Point } from "./Point";

export interface Cell {
    tileMapName: string,
    tileNumber: number,
    piece?: Piece,
    position: Point,
}
