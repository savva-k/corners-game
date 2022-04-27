import { Piece } from "./Piece";
import { Player } from "./Player";
import { Turn } from "./Turn"

export interface Game {
    id: string,
    player1: Player,
    player2: Player | undefined,
    turns: Turn[],
    currentTurn: Piece,
    field: Record<string, Piece | undefined>,
    isStarted: boolean,
    isFinished: boolean,
    winner: Player | undefined,
    createdAt: Date,
    updatedAt: Date,
    mistakeAtField: string | undefined,
    availableMoves: string[] | undefined,
}
