import { Piece } from "./Piece";

export interface Game {
    id: string,
    player1: string,
    player2: string,
    turns: string[][],
    currentTurn: Piece,
    field: Record<string, Piece | undefined>,
    isStarted: boolean,
    isFinished: boolean,
    winner: string | undefined,
    createdAt: Date,
    updatedAt: Date,
    mistakeAtField: string | undefined,
    availableMoves: string[] | undefined,
}
