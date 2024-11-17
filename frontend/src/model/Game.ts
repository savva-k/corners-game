import { FinishReason } from "./FinishReason";
import { GameMap } from "./GameMap";
import { Piece } from "./Piece";
import { Player } from "./Player";
import { Turn } from "./Turn"

export interface Game {
    id: string,
    gameMap: GameMap,
    player1: Player,
    player2: Player | undefined,
    initiator: Player,
    turns: Turn[],
    currentTurn: Piece,
    player1Piece: Piece,
    player2Piece: Piece,
    isStarted: boolean,
    isFinished: boolean,
    finishReason: FinishReason | undefined,
    winner: Player | undefined,
    createdAt: string,
    updatedAt: string,
}
