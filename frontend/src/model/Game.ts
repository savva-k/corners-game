import { FinishReason } from "./FinishReason";
import { Piece } from "./Piece";
import { Player } from "./Player";
import { Turn } from "./Turn"

export interface Game {
    id: string,
    player1: Player,
    player2: Player | undefined,
    initiator: Player,
    turns: Turn[],
    currentTurn: Piece,
    player1Piece: Piece,
    player2Piece: Piece,
    field: Record<string, Piece | undefined>,
    isStarted: boolean,
    isFinished: boolean,
    finishReason: FinishReason | undefined,
    winner: Player | undefined,
    createdAt: string,
    updatedAt: string,
    mistakeAtField: string | undefined,
    availableMoves: string[] | undefined,
}
