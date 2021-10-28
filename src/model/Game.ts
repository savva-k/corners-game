import { Piece } from "./Piece";
import { Player } from "./Player";
import { Turn } from "./Turn"

export interface Game {
    id: string,
    player1: Player,
    player2: Player,
    turns: Turn[],
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
