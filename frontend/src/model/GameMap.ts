import { Cell } from "./Cell";
import { Size2D } from "./Size2D";

export interface GameMap {
    size: Size2D,
    field: Record<string, Cell>,
}
