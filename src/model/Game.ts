import { Piece } from "./Piece";

export interface Game {
    id: string,
    player1: string,
    player2: string,
    currentTurn: Piece,
    field: Record<string, Piece | undefined>,
    isStarted: boolean,
    isFinished: boolean,
    createdAt: Date,
    updatedAt: Date,
}
