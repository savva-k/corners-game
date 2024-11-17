import { Point } from "./Point";

export interface TurnValidation {
    mistakeAt: Point,
    availableMoves: Point[],
}