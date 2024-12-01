import { Point } from "./Point";

export interface TurnValidationResponse {
    mistakeAt: Point,
    availableMoves: Point[],
}